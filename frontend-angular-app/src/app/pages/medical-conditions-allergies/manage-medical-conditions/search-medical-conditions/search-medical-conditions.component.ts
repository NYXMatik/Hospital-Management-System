import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicalCondition } from '../../../../models/medical-condition.model';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { UpdateMedicalConditionsComponent } from "../update-medical-conditions/update-medical-conditions.component";
import { SearchFormComponent } from "../../../generic-search/search-form.component";
import { ResultListComponent } from "../../../generic-search/result-form.component";
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-medical-conditions',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, UpdateMedicalConditionsComponent, SearchFormComponent, ResultListComponent],
  templateUrl: './search-medical-conditions.component.html',
  styleUrls: ['../../../components-styles/search.component.css']
})
export class SearchMedicalConditionsComponent implements OnInit {

  isLoading: boolean = false;
  headers: string[] = [];
  success: string | null = null;
  error: string | null = null;
  isExpanded: boolean = false;

  medicalConditionList: MedicalCondition[] = [];
  code: string = '';
  designation: string = '';

  selectedMedicalCondition: any = null;
  isModalActive = false;
  medicalConditions: string[] = [];

  searchFields = [
      { name: 'code', label: 'Code', placeholder: 'Enter code', value: '' },
      { name: 'designation', label: 'Designation', placeholder: 'Enter designation', value: '' }
    ];

  // Configuração dos botões para o ResultListComponent
  actionButtons = [
    { label: 'Edit', action: 'edit', class: 'btn-edit' }
  ];

  private subscription!: Subscription;

  constructor(private medicalConditionService: MedicalConditionService, private router: Router, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.clearMessages();
    this.getMedicalConditions();
    this.subscription = this.medicalConditionService.medicalConditionUpdated$.subscribe(() => {
      this.clearMessages();
      this.getMedicalConditions(); // update allergies list
    });
  }

  clearMessages() {
    this.success = '';
    this.error = '';
  }

  getMedicalConditions(): void {
    this.isLoading = true;

    this.medicalConditionService.listAndfilterMedicalConditions('', '').subscribe({
      next: (resp) => {
        this.medicalConditionList = resp.body || [];
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

        this.isLoading = false;
      }
    });
  }

  handleSearch(values: any): void {

    this.clearMessages();
    this.isLoading = true;

    this.medicalConditionService.listAndfilterMedicalConditions(values.code, values.designation).subscribe({
      next: (resp) => {
        this.medicalConditionList = resp.body || [];
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

        this.medicalConditionList = [];
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

  openEditModal(medicalCondition: MedicalCondition): void {
    console.log('Edit button clicked for medical condition:', medicalCondition);

    this.router.navigate(['update'], {
      relativeTo: this.route,
      state: { medicalCondition }
    });

    this.selectedMedicalCondition = { ...medicalCondition };
    this.isModalActive = true; // Activate modal
  }

  closeEditModal(): void {
    this.selectedMedicalCondition = null;
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
