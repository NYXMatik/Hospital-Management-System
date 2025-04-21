import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Importar CommonModule para ngIf
import { MedicalRecordService } from '../../../services/medical-record.service';

@Component({
  selector: 'app-account-manager',
  standalone: true,  // Asegúrate de que tu componente es standalone
  imports: [CommonModule],  // Importar CommonModule para usar ngIf
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.css']
})
export class ManageAccountComponent implements OnInit {

  accountDetails: any = {}; 
  appointments: any[] = [];  
  loading: boolean = false;

  constructor(
    private router: Router,
    private medicalRecordService: MedicalRecordService
  ) {}

  ngOnInit(): void {
    this.loadAccountDetails();
  }

  loadAccountDetails(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.accountDetails = JSON.parse(user);
      this.loadAppointments(); 
    } else {
      this.accountDetails = {
        fullName: 'Unknown User',
        email: 'unknown@example.com',
        phoneNumber: 'N/A',
        birth: 'N/A',
        address: {},
        profileId: null,
        isEmailVerified: false
      };
    }
  }

  downloadMedicalRecord(): void {
    if (this.accountDetails.profileId) {
      this.loading = true;
      this.medicalRecordService.downloadMedicalRecord(this.accountDetails.profileId)
        .subscribe({
          next: () => {
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            console.error('Error downloading medical record:', error);
          }
        });
    }
  }

  loadAppointments(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.appointments = user.appointments || [];  // Asignar las citas si existen en localStorage
  }

  updateAccount(): void {
    localStorage.setItem('user', JSON.stringify(this.accountDetails));
    this.router.navigate(['/manage-patient-account/update']);
  }

  deleteAccount(): void {
    if (this.accountDetails.profileId) {
      this.router.navigate([`/manage-patient-account/delete`, this.accountDetails.profileId]);
    } else {
      alert('User ID is missing. Cannot delete the account.');
    }
  }

  bookAppointment(): void {
    this.router.navigate(['/manage-patient-account/book-appointment', this.accountDetails.profileId]);
  }
  logout() {
    // Lógica para cerrar sesión
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/manage-patient-account/login']);
  }
}
