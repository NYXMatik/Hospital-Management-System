import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PatientAccountService } from '../../../services/patient-account.service';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../generic-form/generic-form.component';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login-patient-account',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericFormComponent],
  templateUrl: './login-patient-account.component.html',

  styleUrls: ['./login-patient-account.component.css']
})
export class LoginPatientAccountComponent implements OnInit {
  isLoading = true;
  accounts: any[] = [];
  formFields = [{
    name: 'profileId',
    label: 'Select Account',
    type: 'select',
    options: [] as any[],
    required: true
  }];
  simulateUserId: string = ''; 

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private patientService: PatientAccountService
  ) { }

  ngOnInit(): void {
    this.loadAccounts();
    (window as any).handleOauthResponse = this.handleOauthResponse.bind(this);
  }

  loadAccounts() {
    this.patientService.getAllPatientAccounts().subscribe({
      next: (response) => {
        this.accounts = response.data;
        this.formFields[0].options = this.accounts.map(account => ({
          value: account.profileId,
          label: `${account.fullName} (${account.email})`
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.isLoading = false;
      }
    });
  }

  mockLogin(formData: any) {
    const selectedAccount = this.accounts.find(acc => acc.profileId === formData.profileId);
    if (selectedAccount) {
      const simulatedUser = {
        profileId: selectedAccount.profileId,
        name: {
          fullName: selectedAccount.fullName
        },
        email: selectedAccount.email,
        phoneNumber: selectedAccount.phoneNumber,
        birthDate: selectedAccount.birth,
        gender: selectedAccount.gender,
        emergencyContact: selectedAccount.emergencyContact,
        isEmailVerified: true,
        appointments: [],
        simulated: true
      };

      localStorage.setItem('user', JSON.stringify(simulatedUser));
      localStorage.setItem('token', '');

      this.ngZone.run(() => {
        this.router.navigate(['/manage-account']);
      });
    }
  }

  handleOauthResponse(response: any) {
    const responsePayload = this.decodeJWTToken(response.credential);
    const email = responsePayload.email;

    this.patientService.getPatientAccountByEmail(email).subscribe({
      next: (response) => {
        console.log('Backend response:', response);

        if (response?.data) {
          const userData = response.data;

          const simulatedUser = {
            profileId: userData.profileId || 'N/A',
            name: userData.name || 'N/A',
            email: userData.contactInfo.email || 'N/A',
            phoneNumber: userData.contactInfo.phoneNumber || 'N/A',
            birthDate: userData.birthDate || 'N/A',
            address: userData.address || {},
            isEmailVerified: userData.isEmailVerified || false,
            appointments: userData.appointments || [],
            simulated: true
          };

          localStorage.setItem('user', JSON.stringify(simulatedUser));
          localStorage.setItem('token', '');

          this.ngZone.run(() => {
            this.router.navigate(['manage-account']);
          });
          
        } else {
          console.error('Invalid response structure:', response);
          alert('Failed to simulate login. Please check the email and try again.');
        }
      },
      error: (error) => {
        console.error('Error during simulated login', error);
        alert('Failed to simulate login. Please check the email and try again.');
      }
    });
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  onInputChange(event: any) {
    this.simulateUserId = event.target.value;
  }

  goBack() {
    this.ngZone.run(() => {
      this.router.navigate(['/manage-patient-account']);
    });
  }
}