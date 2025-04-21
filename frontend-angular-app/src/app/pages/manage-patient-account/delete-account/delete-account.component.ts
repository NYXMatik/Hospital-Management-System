import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for redirection
import { PatientAccountService } from '../../../services/patient-account.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {
  isDeleting: boolean = false;
  deletionError: string | null = null;
  deletionSuccess: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private patientService: PatientAccountService,
  ) {}

  onDeleteAccount(): void {
    const userId = this.getUserId(); // Get the user's ID dynamically
    if (!userId) {
      alert('User ID is missing. Please log in again or contact support.');
      return;
    }

    if (confirm("Are you sure you want to delete your account and all associated data? This action cannot be undone.")) {
      this.isDeleting = true;
      this.deletionError = null;
      this.deletionSuccess = null;

      this.patientService.deletePatientAccount(userId).subscribe({
        next: () => {
          this.deletionSuccess = 'Your account and all associated data have been deleted successfully.';
          this.isDeleting = false;

          localStorage.clear(); 

          this.router.navigate(['/manage-patient-account/login']);
        },
        error: (error) => {
          console.error('Error during account deletion:', error);
          this.deletionError = 'An error occurred while trying to delete your account. Please try again later.';
          this.isDeleting = false;
        },
      });
    }
  }

  private getUserId(): string | null {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.profileId || null; 
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }
}
