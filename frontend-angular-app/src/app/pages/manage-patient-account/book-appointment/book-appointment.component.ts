import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientAccountService } from '../../../services/patient-account.service';
import { NgZone } from '@angular/core';
import { StaffService } from '../../../services/staff.service';
import { Staff } from '../../../models/staff.model';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-component.css'],
})
export class BookAppointmentComponent implements OnInit {
  appointmentData = {
    appointmentId: '',         
    patientId: '',            
    appointmentDate: '',       
    description: '',          
    doctor: '',               
    status: 'Pending',        
  };

  errorMessages: string[] = [];
  successMessage: string | null = null;
  doctors: Staff[] = []; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientAccountService,
    private ngZone: NgZone,
    private staffservice: StaffService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.appointmentData.patientId = params.get('profileId') || '';
      this.loadDoctors();
    });
  }
  loadDoctors(): void {
    this.staffservice.getStaffs().subscribe({
      next: (response) => {
        console.log('Staff members response:', response.body);
        const staffMembers: Staff[] = response.body || [];
        this.doctors = staffMembers.filter(member => member.id.startsWith('D'));
      },
      error: (error) => {
        console.error('Error fetching staff members', error);
        this.errorMessages.push('Failed to load doctors. Please try again.');
      }
    });
  }

  bookAppointment(): void {
    this.errorMessages = [];
    this.successMessage = null;

    if (!this.appointmentData.doctor || !this.appointmentData.description || !this.appointmentData.appointmentDate) {
      this.errorMessages.push('Doctor, description, and appointment date are required.');
      return;
    }

    this.appointmentData.appointmentId = this.generateAppointmentId();

    this.patientService.addAppointment(this.appointmentData).subscribe({
        next: () => {

          this.patientService.getPatientAccountById(this.appointmentData.patientId).subscribe({
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
        },
        error: (error) => {
          this.errorMessages.push(
            error.error?.message || 'An error occurred while booking the appointment.'
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/manage-patient-account']);
  }

  generateAppointmentId(): string {
    return 'appt-' + Math.random().toString(36).substring(2, 15);
  }
}