import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient-profile.service';
import { PatientProfile } from '../../../models/patient-profile';
import { GenericFormComponent } from '../../generic-form/generic-form.component';

@Component({
  selector: 'app-update-patient-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './update-patient-profile.component.html',
  styleUrls: ['../../components-styles/update.component.css']
})

export class UpdatePatientProfileComponent implements OnInit {

  message: string = ''; // Success or error message
  updatedPatient?: PatientProfile | null = null; // To exibit patient update
  patientId: string | null = null;
  fields: any[] = [];
  isUpdate = true;

  @Input() patient: PatientProfile = {
    medicalRecordNum: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birth: '',
    emergencyContact: ''
  };

  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();

  constructor(private patientService: PatientService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      const state = currentNavigation.extras.state;
      if (state && state['patient']) {
        this.patient = state['patient'];
      } else {
        this.message = 'No patient data available!';
      }
    }

    this.fields = [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
      { name: 'birth', label: 'Birth', type: 'date', required: true },
      { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: true }
    ];
  }

  onSubmit() {
    console.log('Patient data:', this.patient);

    // Clean messages and patient data before each sent to backend
    this.message = '';
    this.updatedPatient = null;

    this.patientService.updatePatient(this.patient).subscribe({
      next: (updatedPatient) => {
        this.message = 'Patient updated successfully!';
        this.updatedPatient = updatedPatient;
        console.log('Patient updated successfully:', this.updatedPatient);

        // Emit event of update patient
        this.patientService.patientUpdatedSource.next();
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          // Extract error message from backend
          if (error.error && error.error.errors) {
            const err = `Error updating Patient profile. Please verify the following:\n- ${error.error.errors.join('\n- ')}`;
            this.message = err.replace(/\n/g, '<br>');
          } else {
            this.message = `Error updating Patient profile. Verify data and try again! \n- Email and phone number must be unique!`;
          }
        } else if (error.status >= 500 && error.status < 600) {
          this.message = `Error updating Patient profile. Connection failed!`;
        }
        console.error('Error updating Patient profile:', error);
      }
    });
  }

  closeModal(): void {
    this.close.emit();
    this.router.navigate(['./'], { relativeTo: this.route });
  }

}
