import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sarm-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './sarm-home.component.html',
  styleUrl: './sarm-home.component.css'
})
export class SARMHomeComponent {
  title = 'SARM';
  constructor(private router: Router) {}

  navigateToAdmin() {
    console.log("Navigating to admin");
    this.router.navigate(['admin']);
  }

  navigateToPatient() {
    console.log("Navigating to patient");
    this.router.navigate(['patient']);
  }

  navigateToDoctor() {
    console.log("Navigating to doctor");
    this.router.navigate(['doctor/manage-medical-records']);
  }
}
