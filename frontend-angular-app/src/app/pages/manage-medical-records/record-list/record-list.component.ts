import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicalRecordService, MedicalRecordWithPatient } from '../../../services/medical-record.service';
import { MedicalRecord } from '../../../models/medical-record.model';
import { RecordListAllergyComponent } from '../../manage-medical-record-allergy/record-list-allergy/record-list-allergy.component';
import { RecordAddAllergyComponent } from '../../manage-medical-record-allergy/record-add-allergy/record-add-allergy.component';
import { RecordUpdateAllergyComponent } from '../../manage-medical-record-allergy/record-update-allergy/record-update-allergy.component';
import { Allergy } from '../../../models/allergy';
import { MedicalRecordAllergyService } from '../../../services/medical-record-allergy.service';
import { Subscription } from 'rxjs';
import { RecordListConditionComponent } from '../../manage-medical-record-condition/record-list-condition/record-list-condition.component';
import { RecordAddConditionComponent } from '../../manage-medical-record-condition/record-add-condition/record-add-condition.component';
import { RecordUpdateConditionComponent } from '../../manage-medical-record-condition/record-update-condition/record-update-condition.component';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { MedicalRecordConditionService } from '../../../services/medical-record-condition.service';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    RouterModule, 
    RecordListAllergyComponent, 
    RecordAddAllergyComponent, 
    RecordUpdateAllergyComponent,
    RecordListConditionComponent,
    RecordAddConditionComponent,
    RecordUpdateConditionComponent],
  templateUrl: './record-list.component.html',
  styleUrls: ['../../components-styles/search.component.css',
    '../../components-styles/delete.component.css',
    './record-list.component.css']
})
export class RecordListComponent implements OnInit, OnDestroy {
  records: MedicalRecordWithPatient[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  isExpanded: boolean = true;
  searchTerm: string = '';

  selectedRecord: MedicalRecordWithPatient | null = null;
  isDetailsModalActive: boolean = false;
  isAllergiesExpanded: boolean = false;
  isConditionsExpanded: boolean = false;
  isAddingAllergy: boolean = false;
  isAddingCondition: boolean = false;
  isEditingAllergy: boolean = false;
  isEditingCondition: boolean = false;
  selectedAllergy: Allergy | null = null;
  selectedCondition: MedicalCondition | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private recordService: MedicalRecordService,
    private recordAllergyService: MedicalRecordAllergyService,
    private recordConditionService: MedicalRecordConditionService
  ) {}

  ngOnInit(): void {
    this.getRecords();
    
    // Subscribe to allergy updates
    this.subscription.add(
      this.recordAllergyService.allergyUpdated$.subscribe(() => {
        this.getRecords();
      })
    );

    // Subscribe to medical record updates
    this.subscription.add(
      this.recordService.medicalRecordUpdated$.subscribe(() => {
        this.getRecords();
      })
    );

    // Subscribe to condition updates
    this.subscription.add(
      this.recordConditionService.conditionUpdated$.subscribe(() => {
        this.getRecords();
      })
    );

    // Restore selected record and expanded state from local storage if available
    const savedRecordId = localStorage.getItem('selectedRecordId');
    const isConditionsExpanded = localStorage.getItem('isConditionsExpanded') === 'true';
    if (savedRecordId) {
      this.selectedRecord = this.records.find(record => record.userId === savedRecordId) || null;
      if (this.selectedRecord) {
        this.isDetailsModalActive = true;
        this.isConditionsExpanded = isConditionsExpanded;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getRecords(): void {
    this.isLoading = true;
    this.recordService.listMedicalRecordsWithPatientInfo().subscribe({
      next: (response) => {
        this.records = response.body || [];
        this.isLoading = false;

        // Restore selected record and expanded state from local storage if available
        const savedRecordId = localStorage.getItem('selectedRecordId');
        const isConditionsExpanded = localStorage.getItem('isConditionsExpanded') === 'true';
        if (savedRecordId) {
          this.selectedRecord = this.records.find(record => record.userId === savedRecordId) || null;
          if (this.selectedRecord) {
            this.isDetailsModalActive = true;
            this.isConditionsExpanded = isConditionsExpanded;
          }
        }
      },
      error: (error) => {
        this.error = 'Error loading medical records';
        this.isLoading = false;
      }
    });
  }

  searchRecords(): void {
    this.isLoading = true;
    if (!this.searchTerm.trim()) {
      this.getRecords();
      return;
    }

    this.recordService.listMedicalRecordsWithPatientInfo().subscribe({
      next: (response) => {
        this.records = (response.body || []).filter(record => 
          record.patientName?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error searching medical records';
        this.isLoading = false;
      }
    });
  }

  openDetailsModal(record: MedicalRecordWithPatient): void {
    this.selectedRecord = record;
    this.isDetailsModalActive = true;
    localStorage.setItem('selectedRecordId', record.userId);
  }

  closeDetailsModal(): void {
    this.selectedRecord = null;
    this.isDetailsModalActive = false;
    localStorage.removeItem('selectedRecordId');
    localStorage.removeItem('isConditionsExpanded');
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleAllergies(): void {
    this.isAllergiesExpanded = !this.isAllergiesExpanded;
  }

  toggleConditions(): void {
    this.isConditionsExpanded = !this.isConditionsExpanded;
    localStorage.setItem('isConditionsExpanded', this.isConditionsExpanded.toString());
  }

  toggleAddAllergy(): void {
    this.isAddingAllergy = !this.isAddingAllergy;
  }

  toggleEditAllergy(allergy: Allergy): void {
    this.selectedAllergy = allergy;
    this.isEditingAllergy = !this.isEditingAllergy;
  }

  handleAllergySubmit(formData: any): void {
    if (this.selectedRecord) {
      const allergyCode = formData.allergy.trim();
      this.recordService.updateMedicalConditions(this.selectedRecord.userId, [allergyCode]).subscribe({
        next: (response) => {
          console.log('Allergy added successfully', response);
          this.toggleAddAllergy();
          this.getRecords();
        },
        error: (error) => {
          console.error('Error adding allergy:', error);
        }
      });
    }
  }

  handleAllergyUpdate(formData: any): void {
    if (this.selectedRecord && this.selectedAllergy) {
      this.recordAllergyService.updateAllergy(this.selectedRecord.userId, formData).subscribe({
        next: (response: any) => {
          console.log('Allergy updated successfully', response);
          if (this.selectedAllergy) {
            this.toggleEditAllergy(this.selectedAllergy);
          }
          this.getRecords();
        },
        error: (error: any) => {
          console.error('Error updating allergy:', error);
        }
      });
    }
  }

  toggleAddCondition(): void {
    this.isAddingCondition = !this.isAddingCondition;
  }

  toggleEditCondition(condition: MedicalCondition): void {
    this.selectedCondition = condition;
    this.isEditingCondition = !this.isEditingCondition;
  }

  handleConditionSubmit(formData: any): void {
    if (this.selectedRecord) {
      const conditionCode = formData.condition.trim();
      this.recordService.updateMedicalConditions(this.selectedRecord.userId, [conditionCode]).subscribe({
        next: (response) => {
          console.log('Condition added successfully', response);
          this.toggleAddCondition();
          this.getRecords();
        },
        error: (error) => {
          console.error('Error adding condition:', error);
        }
      });
    }
  }

  handleConditionUpdate(formData: any): void {
    if (this.selectedRecord && this.selectedCondition) {
      this.recordConditionService.updateCondition(this.selectedRecord.userId, formData).subscribe({
        next: (response: any) => {
          console.log('Condition updated successfully', response);
          if (this.selectedCondition) {
            this.toggleEditCondition(this.selectedCondition);
          }
          this.getRecords();
        },
        error: (error: any) => {
          console.error('Error updating condition:', error);
        }
      });
    }
  }
}