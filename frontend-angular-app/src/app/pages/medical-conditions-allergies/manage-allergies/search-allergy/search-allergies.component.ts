import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Allergy } from '../../../../models/allergy';
import { AllergyService } from '../../../../services/allergy.service';
import { UpdateAllergyComponent } from '../update-allergy/update-allergy.component';
import { SearchFormComponent } from "../../../generic-search/search-form.component";
import { ResultListComponent } from "../../../generic-search/result-form.component";
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-search-allergies',
  standalone: true,
  imports: [FormsModule, CommonModule, UpdateAllergyComponent, RouterModule, SearchFormComponent, ResultListComponent],
  templateUrl: './search-allergies.component.html',
  styleUrls: ['../../../components-styles/search.component.css']
})
export class SearchAllergiesComponent implements OnInit {

  isLoading: boolean = false;
  headers: string[] = [];
  success: string | null = null;
  error: string | null = null;
  isExpanded: boolean = false;

  allergyList: any[] = [];
  code: string = '';
  designation: string = '';

  selectedAllergy: any = null;
  isModalActive = false;

  searchFields = [
    { name: 'code', label: 'Code', placeholder: 'Enter code', value: '' },
    { name: 'designation', label: 'Designation', placeholder: 'Enter designation', value: '' }
  ];

  // Configuração dos botões para o ResultListComponent
  actionButtons = [
    { label: 'Edit', action: 'edit', class: 'btn-edit' }
  ];

  private subscription!: Subscription;

  constructor(private allergyService: AllergyService, private router: Router, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.getAllergies();
    this.subscription = this.allergyService.allergyUpdated$.subscribe(() => {
      this.clearMessages();
      this.getAllergies(); // update allergies list
    });
  }

  clearMessages() {
    this.success = '';
    this.error = '';
  }

  getAllergies(): void {
    this.isLoading = true;

    this.allergyService.filterAllergies('', '').subscribe({
      next: (resp) => {
        this.allergyList = resp.body || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error;
      }
    });
  }

  handleSearch(values: any): void {

    this.clearMessages();
    this.isLoading = true;

    this.allergyService.filterAllergies(values.code, values.designation).subscribe({
      next: (resp) => {
        this.allergyList = resp.body || [];
        this.isLoading = false;
      },

      error: (error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'string') {
          this.error = error.error;
        } else if (error.error && error.error.message) {
          this.error = error.error.message;
        } else {
          this.error = 'Connection failed.';
        }
        console.error('Error getting Medical Conditions:', error);

        this.allergyList = [];
        this.isLoading = false;
      }
    });
  }

  // Tratamento de ações recebidas do ResultListComponent
  handleAction(event: { action: string; item: any }): void {
    const { action, item } = event;

    if (action === 'edit') {
      this.openEditModal(item);
    }
  }

  openEditModal(allergy: Allergy): void {
    console.log('Edit button clicked for allergy:', allergy);

    this.router.navigate(['update'], {
      relativeTo: this.route,
      state: { allergy }
    });

    this.selectedAllergy = { ...allergy };
    this.isModalActive = true; // Activate modal
  }

  closeEditModal(): void {
    this.selectedAllergy = null;
    this.isModalActive = false; // Close modal
  }

  isModalRouteActive(): boolean {
    const firstChild = this.route.firstChild;
    if (!firstChild) {
      return false;
    }
    return firstChild.snapshot.url[0]?.path === 'update';
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
}
