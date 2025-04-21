import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordAllergyService } from '../../../services/medical-record-allergy.service';
import { ListAllergiesComponent } from '../../medical-conditions-allergies/list-allergies-to-add/list-allergies.component';

@Component({
  selector: 'app-record-add-allergy',
  standalone: true,
  imports: [CommonModule, ListAllergiesComponent],
  templateUrl: './record-add-allergy.component.html',
  styleUrls: ['./record-add-allergy.component.css']
})
export class RecordAddAllergyComponent{
  @Input() userId!: string;
  
  constructor(
    private medicalRecordAllergyService: MedicalRecordAllergyService
  ) {}

  onSubmit(selectedAllergy: any) {
    console.log('Selected allergy:', selectedAllergy);
    if (selectedAllergy) {
      this.medicalRecordAllergyService.updateAllergies(
        this.userId,
        [selectedAllergy.code]
      ).subscribe({
        next: (response) => {
          console.log('Allergy updated successfully', response);
          this.medicalRecordAllergyService.allergyUpdatedSource.next();
        },
        error: (error) => {
        console.error('Error updating allergies:', error);
        const errorMessage = error.error?.errors?.message || 'Failed to update allergy';
        }
      });
    }
  }
}