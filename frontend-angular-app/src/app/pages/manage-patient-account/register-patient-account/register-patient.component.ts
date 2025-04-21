import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientAccountService } from '../../../services/patient-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css'],
})
export class RegisterPatientComponent {
  patient = {
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  };

  constructor(private http: HttpClient,
    private patientService: PatientAccountService,
    private router: Router

  ) {}

  // Handles form submission
  onSubmit(): void {
    if (this.isValidPatient(this.patient)) {
      this.registerPatient(this.patient);
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  // Sends patient data to the backend
  private registerPatient(patient: any): void {
    this.patientService.registerPatientAccount(patient).subscribe({
      next: (response) => {
        console.log('Patient registered successfully:', response);
        alert('Patient registered successfully!');
        this.resetForm();
        this.router.navigate(['manage-patient-account']);
      },
      error: (error) => {
        console.error('Error during registration:', error);
        const errors = error?.error?.Errors || ['Registration failed, please try again.'];
        alert(errors.join('\n'));
      },
    });
  }

  // Validates the patient data
  public isValidPatient(patient: any): boolean {
    return (
      patient.fullName.trim() !== '' &&
      this.isValidEmail(patient.email) &&
      patient.phone.trim() !== '' &&
      patient.birthDate.trim() !== '' &&
      this.isValidAddress(patient.address)
    );
  }

  // Validates the address object
  public isValidAddress(address: any): boolean {
    return (
      address.street.trim() !== '' &&
      address.city.trim() !== '' &&
      address.state.trim() !== '' &&
      address.postalCode.trim() !== '' &&
      address.country.trim() !== ''
    );
  }

  // Basic email validation
  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Resets the form fields
  public resetForm(): void {
    this.patient = {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    };
  }
}
