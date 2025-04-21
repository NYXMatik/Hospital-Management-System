import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-patient-account',
  templateUrl: './manage-patient-account.component.html',
  styleUrls: ['./manage-patient-account.component.css']
})
export class ManagePatientAccountComponent {
  constructor(private router: Router) {}

  // Redirect to login route
  redirectToLogin(): void {
    this.router.navigate(['/manage-patient-account/login']);
  }

  // Redirect to register route
  redirectToRegister(): void {
    this.router.navigate(['/manage-patient-account/register']);
  }
}
