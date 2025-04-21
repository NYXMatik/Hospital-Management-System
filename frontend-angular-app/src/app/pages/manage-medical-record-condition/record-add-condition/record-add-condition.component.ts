import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordConditionService } from '../../../services/medical-record-condition.service';
import { ListMedicalConditionsComponent } from "../../medical-conditions-allergies/list-medical-conditions-to-add/list-medical-conditions.component";

interface FormOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-record-add-condition',
  standalone: true,
  imports: [CommonModule, ListMedicalConditionsComponent],
  templateUrl: './record-add-condition.component.html',
  styleUrls: ['./record-add-condition.component.css']
})
export class RecordAddConditionComponent {
  @Input() userId!: string;
  
  constructor(
    private medicalRecordConditionService: MedicalRecordConditionService
  ) {}

  onSubmit(selectedCondition: any) {
    if (selectedCondition) {
      this.medicalRecordConditionService.updateConditions(
        this.userId,
        [selectedCondition.code]
      ).subscribe({
        next: (response) => {
          console.log('Condition updated successfully', response);
          this.medicalRecordConditionService.conditionUpdatedSource.next();
        },
        error: (error) => {
          console.error('Error updating conditions:', error);
          this.medicalRecordConditionService.conditionUpdatedSource.next();
        },
      });
    }
  }
}