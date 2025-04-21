import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { MedicalConditionService } from '../../../services/medical-condition.service';
import { ResultListComponent } from "../../generic-search/result-form.component";
import { SearchFormComponent } from '../../generic-search/search-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { RecordAddConditionComponent } from '../../manage-medical-record-condition/record-add-condition/record-add-condition.component';

@Component({
  selector: 'app-list-medical-conditions',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ResultListComponent, SearchFormComponent],
  templateUrl: './list-medical-conditions.component.html',
  styleUrls: ['../../components-styles/search.component.css']
})
export class ListMedicalConditionsComponent implements OnInit {

  isLoading: boolean = false;
  headers: string[] = [];
  success: string | null = null;
  error: string | null = null;
  isExpanded: boolean = false;

  medicalConditionsList: any[] = [];

  selectedMedicalCondition?: MedicalCondition | null = null; // To exibit allergy details

  searchFields = [
    { name: 'code', label: 'Code', placeholder: 'Enter code', value: '' },
    { name: 'designation', label: 'Designation', placeholder: 'Enter designation', value: '' }
  ];

  // Configuração dos botões
  actionButtons = [
    { label: 'Add', action: 'add', class: 'btn-add' },
    { label: 'View Details', action: 'viewDetails', class: 'btn-view' }
  ];

  constructor(private medicalConditionService: MedicalConditionService, private router: Router, private route: ActivatedRoute,
    private addConditionToRecord: RecordAddConditionComponent
   ) {}

  ngOnInit(): void {
    this.clearMessages();
    this.selectedMedicalCondition = null;
    this.getMedicalConditions();
  }

  clearMessages() {
    this.success = '';
    this.error = '';
  }

  getMedicalConditions(): void {
    this.isLoading = true;

    this.medicalConditionService.listAndfilterMedicalConditions('', '').subscribe({
      next: (resp) => {
        this.medicalConditionsList = resp.body || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.medicalConditionsList = [];
        this.error = error;
      }
    });
  }

  handleSearch(values: any): void {

    this.clearMessages();
    this.isLoading = true;
    this.selectedMedicalCondition = null;

    this.medicalConditionService.listAndfilterMedicalConditions(values.code, values.designation).subscribe({
      next: (resp) => {
        this.medicalConditionsList = resp.body || [];
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

        this.medicalConditionsList = [];
        this.isLoading = false;
      }
    });
  }

  // Tratamento de cliques nos botões
  handleAction(event: { action: string; item: MedicalCondition }): void {
    const { action, item } = event;

    if (action === 'add') {
      this.handleAdd(item);
    } else if (action === 'viewDetails') {
      this.viewDetails(item);
    }
  }

  handleAdd(item: MedicalCondition): void{
    console.log('Add action triggered for item:', item);
    this.addConditionToRecord.onSubmit(item);
  }

  viewDetails(item: MedicalCondition): void {
    this.selectedMedicalCondition = item;
    console.log('View Details action triggered for item:', this.selectedMedicalCondition);
  }

  closeModal(): void {
    this.selectedMedicalCondition = null;
  }


}


