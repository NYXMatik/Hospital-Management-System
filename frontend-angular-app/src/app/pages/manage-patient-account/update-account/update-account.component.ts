import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatientAccountService } from '../../../services/patient-account.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-update-patient-account',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-component.css']
})
export class UpdateAccountComponent implements OnInit {

  accountDetails: any = {}; 

  constructor(
    private router: Router,
    private http: HttpClient,
    private patientService: PatientAccountService,
    private ngZone: NgZone,


  ) {}

  ngOnInit(): void {
    this.loadAccountDetails(); 
  }

  loadAccountDetails(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.accountDetails = JSON.parse(user);
    } else {
      this.accountDetails = {
        profileId: null, 
        fullName: 'Unknown User',
        email: 'unknown@example.com',
        phone: 'N/A',
        birthDate: 'N/A',
        address: {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          postalCode: 'N/A',
          country: 'N/A'
        },
        isEmailVerified: false,
        active: true
      };
    }
  }
  
  
  onSubmit(): void {
    if (!this.accountDetails.email || !this.isValidEmail(this.accountDetails.email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    if (!this.accountDetails.phoneNumber || !this.isValidPhone(this.accountDetails.phoneNumber)) {
      alert('Please enter a valid phone number.');
      return;
    }
  
    // Prepara el cuerpo de la solicitud
    const updatedUser = {
      fullName: this.accountDetails.name.fullName,
      email: this.accountDetails.email,
      phone: this.accountDetails.phoneNumber,
      street: this.accountDetails.address.street,
      city: this.accountDetails.address.city,
      state: this.accountDetails.address.state,
      postalCode: this.accountDetails.address.postalCode,
      country: this.accountDetails.address.country,
      birthDate: this.accountDetails.birthDate
    };
  
    const userId = this.accountDetails.profileId;
  
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    // Enviar solicitud PUT al backend
    this.patientService.updatePatientAccount(userId,updatedUser).subscribe({
      next: (response) => {
        const email = this.accountDetails.email;
        this.patientService.getPatientAccountByEmail(email).subscribe({
          next: (response) => {
            console.log('Backend response:', response);
    
            if (response?.data) {
              const userData = response.data;
    
              const simulatedUser = {
                profileId: userData.profileId || 'N/A',
                name: userData.name|| 'N/A',
                email: userData.contactInfo.email || 'N/A',
                phoneNumber: userData.contactInfo.phoneNumber || 'N/A',
                birthDate: userData.birthDate || 'N/A',
                address: userData.address || {},
                isEmailVerified: userData.isEmailVerified || false,
                appointments: userData.appointments || [],
                simulated: true
              };;
    
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
        console.log('Account updated successfully!', response);
      },
      error: (error) => {
        if (error.status === 400) {
          alert('Bad request: Please ensure all fields are correctly filled.');
        } else {
          console.error('Error updating account:', error);
          alert('An error occurred while updating your account. Please try again later.');
        }
      }
    });
  }
  
  // Método para validar correo electrónico
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  
isValidPhone(phone: string): boolean {
  const phonePattern = /^\+(\d{1,3})[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{0,9}$/;
  return phonePattern.test(phone);
}

  goBack(): void {
    this.router.navigate(['/manage-account']);  // Redirect to account management page
  }
}
