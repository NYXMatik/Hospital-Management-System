import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../generic-form/generic-form.component';
import { PatientAccount, PatientAccountService } from '../../../services/patient-account.service';
import { MedicalRecordService } from '../../../services/medical-record.service';

@Component({
  selector: 'app-record-add',
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './record-add.component.html',
  styleUrls: ['./record-add.component.css']
})
export class RecordAddComponent implements OnInit {
  formFields = [{
    name: 'patientId',
    label: 'Select Patient',
    type: 'select',
    options: [] as any[],
    required: true
  }];

  constructor(
    private patientService: PatientAccountService,
    private medicalRecordService: MedicalRecordService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatientAccounts().subscribe({
      next: (patients: { data: PatientAccount[] }) => {
        this.formFields[0].options = patients.data.map((patient: PatientAccount) => ({
          value: patient.profileId,
          label: patient.fullName
        }));
      },
      error: (error) => console.error('Error loading patients:', error)
    });
  }
  onSubmit(formData: any) {
    if (formData.patientId) {
      this.medicalRecordService.createMedicalRecord({
        userId: formData.patientId,
        allergies: [],
        freeTexts: '',
        medicalConditions: []
      }).subscribe({
        next: (response) => {
          console.log('Medical record created:', response);
          this.medicalRecordService.medicalRecordUpdatedSource.next();
        },
        error: (error) => {
          console.error('Error creating medical record:', error);
          alert(`Error creating medical record: ${error.message}`);
        }
      });
    }
  }
}