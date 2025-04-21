import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medical-conditions-allergies',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './medical-conditions-allergies.component.html',
  styleUrls: ['./medical-conditions-allergies.component.css']
})
export class MedicalConditionsAllergiesComponent {

  selectedSection: string = 'allergies';

}
