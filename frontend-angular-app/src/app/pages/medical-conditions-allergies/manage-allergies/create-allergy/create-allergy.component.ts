import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AllergyService } from '../../../../services/allergy.service';
import { Allergy } from '../../../../models/allergy';
import { GenericFormComponent } from '../../../generic-form/generic-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-allergy',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './create-allergy.component.html',
  styleUrls: ['../../../components-styles/create.component.css']
})
export class CreateAllergyComponent {
  allergy: Allergy = {
    code: '',
    designation: '',
    description: ''
  };

  fields = [
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: false }
  ];

  isUpdate = false; // Flag to check if the form is for updating or creating
  message: string = ''; // Success or error message
  createdAllergy?: Allergy | null = null; // To exibit allergy created

  isExpanded: boolean = false;

  constructor(
    private allergyService: AllergyService,
  ) {}

  // Method to submit form with allergy data
  onSubmit() {
    console.log('Allergy Data:', this.allergy);  

    // Clean messages and allergy data before each submission
    this.message = '';
    this.createdAllergy = null;

    // Send data to backend
    this.allergyService.createAllergy(this.allergy).subscribe({
      next: (createdAllergy) => {
        this.message = 'Allergy created successfully!';
        this.createdAllergy = createdAllergy; //status code 2xx
        console.log('Allergy created successfully:', createdAllergy);

        // Emit event of created allergy
        this.allergyService.allergyUpdatedSource.next();
      },
      error: (error: HttpErrorResponse) => {
        // Captura a mensagem de erro específica
        if (error.error && typeof error.error === 'string') {
          this.message = error.error; 
        } else if (error.error && error.error.message) {
          this.message = error.error.message; 
        } else {
          this.message = 'An unknown error occurred.';
        }
        console.error('Error creating Allergy profile:', error);
      }
    });
  }

  // Method to clear the form and reset the allergy object for a new entry
  createNewAllergy() {
    this.createdAllergy = null;
    this.allergy = {
      code: '',
      designation: '',
      description: ''
    };
    this.message = '';
    this.isUpdate = false;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
}
