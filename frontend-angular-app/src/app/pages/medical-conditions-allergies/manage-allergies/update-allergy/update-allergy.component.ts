import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AllergyService } from '../../../../services/allergy.service';
import { Allergy } from '../../../../models/allergy';
import { GenericFormComponent } from '../../../generic-form/generic-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-allergy',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './update-allergy.component.html',
  styleUrls: ['../../../components-styles/update.component.css']
})

export class UpdateAllergyComponent implements OnInit {

  message: string = ''; // Success or error message
  updatedAllergy?: Allergy | null = null; // To exibit allergy updated
  allergyId: string | null = null;
  fields: any[] = [];
  isUpdate = true;

  @Input() allergy: Allergy = {
    code: '',
    designation: '',
    description: ''
  };

  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();

  constructor(private allergyService: AllergyService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      const state = currentNavigation.extras.state;
      if (state && state['allergy']) {
        this.allergy = state['allergy'];
      } else {
        this.message = 'No allergy data available!';
      }
    }

    this.fields = [
      { name: 'designation', label: 'Designation', type: 'text', required: false },
      { name: 'description', label: 'Description', type: 'text', required: false }
    ];
  }

  onSubmit() {
    console.log('Allergy data:', this.allergy);

    // Clean messages and allergy data before each sent to backend
    this.message = '';
    this.updatedAllergy = null;

    this.allergyService.updateAllergy(this.allergy).subscribe({
      next: (updatedAllergy) => {
        this.message = 'Allergy updated successfully!';
        this.updatedAllergy = updatedAllergy;
        console.log('Allergy updated successfully:', this.updatedAllergy);

        // Emit event of update allergy
        this.allergyService.allergyUpdatedSource.next();
      },
      error: (error: HttpErrorResponse) => {
          
        if (error.error && typeof error.error === 'string') {
          this.message = error.error; 
        } else if (error.error && error.error.message) {
          this.message = error.error.message; 
        } else {
          this.message = 'An unknown error occurred.';
        }
        console.error('Error updating Allergy:', error);
      }
    });
  }

  closeModal(): void {
    this.close.emit();
    this.router.navigate(['./'], { relativeTo: this.route });
  }

}
