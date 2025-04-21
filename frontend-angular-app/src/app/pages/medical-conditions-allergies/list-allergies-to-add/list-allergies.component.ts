import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Allergy } from '../../../models/allergy';
import { AllergyService } from '../../../services/allergy.service';
import { ResultListComponent } from "../../generic-search/result-form.component";
import { SearchFormComponent } from '../../generic-search/search-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { RecordAddAllergyComponent } from '../../manage-medical-record-allergy/record-add-allergy/record-add-allergy.component';

@Component({
  selector: 'app-list-allergies',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ResultListComponent, SearchFormComponent],
  templateUrl: './list-allergies.component.html',
  styleUrls: ['../../components-styles/search.component.css']
})
export class ListAllergiesComponent implements OnInit {

  isLoading: boolean = false;
  headers: string[] = [];
  success: string | null = null;
  error: string | null = null;
  isExpanded: boolean = false;

  allergyList: any[] = [];

  selectedAllergy?: Allergy | null = null; // To exibit allergy details

  searchFields = [
    { name: 'code', label: 'Code', placeholder: 'Enter code', value: '' },
    { name: 'designation', label: 'Designation', placeholder: 'Enter designation', value: '' }
  ];

  // Configuração dos botões
  actionButtons = [
    { label: 'Add', action: 'add', class: 'btn-add' },
    { label: 'View Details', action: 'viewDetails', class: 'btn-view' }
  ];

  constructor(private allergyService: AllergyService, private router: Router, private route: ActivatedRoute,
    private addAlergyRecord : RecordAddAllergyComponent
  ) {}

  ngOnInit(): void {
    this.clearMessages();
    this.selectedAllergy = null;
    this.getAllergies();
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
    this.selectedAllergy = null;

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

  // Tratamento de cliques nos botões
  handleAction(event: { action: string; item: Allergy }): void {
    const { action, item } = event;

    if (action === 'add') {
      this.handleAdd(item);
    } else if (action === 'viewDetails') {
      this.viewDetails(item);
    }
  }

  handleAdd(item: Allergy): void{
    console.log('Add action triggered for item:', item);
    this.addAlergyRecord.onSubmit(item);

  }

  viewDetails(item: Allergy): void {
    this.selectedAllergy = item;
    console.log('View Details action triggered for item:', this.selectedAllergy);
  }

  closeModal(): void {
    this.selectedAllergy = null;
  }


}


