import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { MedicalCondition } from '../../../../models/medical-condition.model';
import { GenericFormComponent } from '../../../generic-form/generic-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-medical-conditions',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './create-medical-conditions.component.html',
  styleUrls: ['../../../components-styles/create.component.css']
})
export class CreateMedicalConditionsComponent {

  medicalCondition: MedicalCondition = {
      code: '',
      designation: '',
      description: '',
      commonSymptoms: []
    };
  
    fields = [
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'text', required: false },
      { name: 'commonSymptoms', label: 'Common Symptoms', type: 'text', required: true }
    ];
  
    isUpdate = false; // Flag to check if the form is for updating or creating
    message: string = ''; // Success or error message
    createdMedicalCondition?: MedicalCondition | null = null; // To exibit medicalCondition created
  
    isExpanded: boolean = false;
  
    constructor(
      private medicalConditionService: MedicalConditionService,
    ) {}
  
    // Method to submit form with medicalCondition data
    onSubmit() {
      console.log('MedicalCondition Data:', this.medicalCondition);

      // Converter commonSymptoms para array (separado por vírgulas)
      this.medicalCondition.commonSymptoms = this.medicalCondition.commonSymptoms
        .toString() // Assegura que é string
        .split(',') // Divide por vírgulas
        .map(symptom => symptom.trim()) // Remove espaços em branco

      console.log('Processed MedicalCondition:', this.medicalCondition);
  
      // Clean messages and medicalCondition data before each submission
      this.message = '';
      this.createdMedicalCondition = null;
  
      // Send data to backend
      this.medicalConditionService.createMedicalCondition(this.medicalCondition).subscribe({
        next: (createdMedicalCondition) => {
          this.message = 'Medical Condition created successfully!';
          this.createdMedicalCondition = createdMedicalCondition; //status code 2xx
          console.log('Medical Condition created successfully:', createdMedicalCondition);
          
          // Emit event of created medicalCondition
          this.medicalConditionService.medicalConditionUpdatedSource.next();
        },
        error: (error: HttpErrorResponse) => {
          // Captura a mensagem de erro específica
          if (error.error && typeof error.error === 'string') {
            this.message = error.error; // Exemplo: "Code cannot be empty."
          } else if (error.error && error.error.message) {
            this.message = error.error.message; // Caso seja um objeto estruturado
          } else {
            this.message = 'An unknown error occurred.';
          }
          console.error('Error creating Medical Condition:', error);
        }
      });
    }
  
    // Method to clear the form and reset the medicalCondition object for a new entry
    createNewMedicalCondition() {
      this.createdMedicalCondition = null;
      this.medicalCondition = {
        code: '',
        designation: '',
        description: '',
        commonSymptoms: []
      };
      this.message = '';
      this.isUpdate = false;
    }
  
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    }

}
