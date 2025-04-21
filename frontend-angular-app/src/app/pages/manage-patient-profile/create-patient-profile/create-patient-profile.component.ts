import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient-profile.service';
import { PatientProfile } from '../../../models/patient-profile';
import { GenericFormComponent } from '../../generic-form/generic-form.component';

@Component({
  selector: 'app-create-patient-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './create-patient-profile.component.html',
  styleUrls: ['../../components-styles/create.component.css']
})
export class CreatePatientProfileComponent {
  patient: PatientProfile = {
    medicalRecordNum: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birth: '',
    emergencyContact: ''
  };

  fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female'] },
    { name: 'birth', label: 'Birth', type: 'date', required: true },
    { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: true },
  ];

  isUpdate = false; // Flag to check if the form is for updating or creating
  message: string = ''; // Success or error message
  createdPatient?: PatientProfile | null = null; // To exibit patient created

  isExpanded: boolean = false;

  constructor(
    private patientService: PatientService,
  ) {}

  // Method to submit form with patient data
  onSubmit() {
    console.log('Patient Profile Data:', this.patient);

    // Clean messages and patient data before each submission
    this.message = '';
    this.createdPatient = null;

    // Send data to backend
    this.patientService.createPatient(this.patient).subscribe({
      next: (createdPatient) => {
        this.message = 'Patient created successfully!';
        this.createdPatient = createdPatient; //status code 2xx
        console.log('Patient created successfully:', createdPatient);

        // Emit event of created patient
        this.patientService.patientUpdatedSource.next();
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          const err = `Error creating Patient profile. Verify data and try again! \n- Email and phone number must be unique!`;
          this.message = err.replace(/\n/g, '<br>');
        } else if (error.status >= 500 && error.status < 600) {
          this.message = `Error creating Patient profile. Connection failed!`;
        }

        console.error('Error creating Patient profile:', error);
      }
    });
  }

  // Method to clear the form and reset the patient object for a new entry
  createNewPatient() {
    this.createdPatient = null;
    this.patient = {
      medicalRecordNum: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      birth: '',
      emergencyContact: ''
    };
    this.message = '';
    this.isUpdate = false;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
}
