import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientProfile } from '../../../models/patient-profile';
import { PatientService } from '../../../services/patient-profile.service';
import { Subscription } from 'rxjs';
import { UpdatePatientProfileComponent } from "../update-patient-profile/update-patient-profile.component";

@Component({
  selector: 'app-search-patient-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, UpdatePatientProfileComponent],
  templateUrl: './search-patient-profile.component.html',
  styleUrls: ['../../components-styles/search.component.css']
})
export class SearchPatientProfileComponent implements OnInit {

  isLoading: boolean = false;
  headers: string[] = [];
  success: string | null = null;
  error: string | null = null;

  isExpanded: boolean = false;

  patientList: PatientProfile[] = [];
  email: string = '';
  name: string = '';
  phoneNumber: string = '';
  birth: string = '';
  gender: string = '';

  selectedPatient: any = null;
  isModalActive = false;

  private subscription!: Subscription;

  constructor(private patientService: PatientService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getPatients();
    this.subscription = this.patientService.patientUpdated$.subscribe(() => {
      this.clearMessages();
      this.getPatients(); // update patients list
    });
  }

  clearMessages() {
    this.success = '';
    this.error = '';
  }

  // Method to get all patients
  getPatients(): void {
    this.isLoading = true;

    this.patientService.getPatients().subscribe({
      next: (resp) => {
        if (!resp.body || resp.body.length === 0) {
          this.error = 'No patient found!';
          this.patientList = [];
          this.isLoading = false;
        } else if (resp.headers) {
          // Extract the header
          const keys = resp.headers.keys();
          this.headers = keys.map(key => `${key}: ${resp.headers.get(key)}`);
          // Extract the body
          this.patientList = resp.body;
          this.isLoading = false;
        }
      },
      error: (error) => {

        if (error.status >= 400 && error.status < 500) {
          this.error  = 'Error geting Patient profile. No patient found!';

        } else if (error.status >= 500 && error.status < 600) {
          this.error = 'Error geting Patient profile. Connection failed!';
        }

        this.isLoading = false;

        console.error('Error creating Patient profile:', error);
      }
    });
  }

  searchPatients(): void {
    this.clearMessages();
    this.isLoading = true;

    this.patientService.filterPatients(this.name, this.email, this.phoneNumber, this.birth, this.gender).subscribe({
      next: (resp) => {
        if (!resp.body || resp.body.length === 0) {
          this.error = 'No patient found!';
          this.patientList = [];
        } else {
          this.patientList = resp.body;
        }
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          this.error  = 'Error geting Patient profile. No patient found!';

        } else if (error.status >= 500 && error.status < 600) {
          this.error = 'Error geting Patient profile. Connection failed!';
        }

        this.isLoading = false;

        console.error('Error creating Patient profile:', error);
      },
    });
  }

  deactivatePatient(patient: PatientProfile): void {
    this.clearMessages();
    if (confirm(`Are you sure you want to deactivate ${patient.fullName}?`)) {
      this.patientService.deactivatePatient(patient.medicalRecordNum).subscribe({
        next: (response) => {

          if (response && response.message) {
            this.success = response.message;
          }

          console.log("Patient deactivated");
          this.getPatients();
        },
        error: (error) => {
          if (error.status >= 400 && error.status < 500) {
            this.error = `Error deactivating Patient profile.`;
          } else if (error.status >= 500 && error.status < 600) {
            this.error = `Error deactivating Patient profile. Connection failed!`;
          }

          this.isLoading = false;
          console.error('Error deactivating Patient profile:', error);
        }
      });

    }

  }

  openEditModal(patient: PatientProfile): void {
    console.log('Edit button clicked for Patient:', patient);

    this.router.navigate(['update'], {
    relativeTo: this.route,
    state: { patient }
  });

  this.selectedPatient = { ...patient };
  this.isModalActive = true; // Activate modal
  }

  closeEditModal(): void {
    this.selectedPatient = null;
    this.isModalActive = false; // Close modal
  }

  isModalRouteActive(): boolean {
    const firstChild = this.route.firstChild;
    if (!firstChild) {
      return false;
    }
    return firstChild.snapshot.url[0]?.path === 'update';
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

}
