import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalConditionService } from '../../../../services/medical-condition.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../../generic-form/generic-form.component';
import { MedicalCondition } from '../../../../models/medical-condition.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-medical-conditions',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './update-medical-conditions.component.html',
  styleUrls: ['../../../components-styles/update.component.css']
})
export class UpdateMedicalConditionsComponent {
  message: string = ''; // Success or error message
    updatedMedicalCondition?: MedicalCondition | null = null; // To exibit Medical Condition created
    code: string | null = null;
    fields: any[] = [];
    isUpdate = true;
  
    @Input() medicalCondition: MedicalCondition = {
      code: '',
      designation: '',
      description: '',
      commonSymptoms: []
    };
  
    @Input() isModal = false;
    @Output() close = new EventEmitter<void>();
  
    constructor(private medicalConditionService: MedicalConditionService, private route: ActivatedRoute, private router: Router) {}
  
    ngOnInit(): void {
      const currentNavigation = this.router.getCurrentNavigation();
      if (currentNavigation?.extras.state) {
        const state = currentNavigation.extras.state;
        if (state && state['medicalCondition']) {
          this.medicalCondition = state['medicalCondition'];
        } else {
          this.message = 'No medical condition data available!';
        }
      }
  
      this.fields = [
        { name: 'designation', label: 'Designation', type: 'text', required: false },
        { name: 'description', label: 'Description', type: 'text', required: false }
      ];
    }
  
    onSubmit() {
      console.log('Medical Condition data:', this.medicalCondition);
  
      this.message = '';
      this.updatedMedicalCondition = null;
  
      this.medicalConditionService.updateMedicalCondition(this.medicalCondition).subscribe({
        next: (updatedMedicalCondition) => {
          this.message = 'Medical Condition updated successfully!';
          this.updatedMedicalCondition = updatedMedicalCondition; 
          console.log('Medical Condition updated successfully:', this.updatedMedicalCondition);
  
          // Emit event of updated Medical Condition
          this.medicalConditionService.medicalConditionUpdatedSource.next();
        },
        error: (error: HttpErrorResponse) => {
          
          if (error.error && typeof error.error === 'string') {
            this.message = error.error; 
          } else if (error.error && error.error.message) {
            this.message = error.error.message; 
          } else {
            this.message = 'An unknown error occurred.';
          }
          console.error('Error updating Medical Condition:', error);
        }            
      });
    }
  
    closeModal(): void {
      this.close.emit();
      this.router.navigate(['./'], { relativeTo: this.route });
    }
}
