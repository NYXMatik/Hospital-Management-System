import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Staff } from '../../../models/staff.model';
import { StaffService } from '../../../services/staff.service';
import { GenericFormComponent } from '../../generic-form/generic-form.component';

@Component({
  selector: 'app-create-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './create-staff.component.html',
  styleUrls: ['../../components-styles/create.component.css']
})
export class CreateStaffComponent implements OnInit{

  staff: Staff = {
    id: '',
    fullName: '',
    licenseNumber: '',
    email: '',
    phoneNumber: '',
    recruitmentYear: new Date().getFullYear(),
    category: '',
    specialization: ''
  };

  fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'licenseNumber', label: 'License Number', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
    { name: 'recruitmentYear', label: 'Recruitment Year', type: 'number', required: true },
    { name: 'category', label: 'Category', type: 'select', required: true, options: ['Doctor', 'Nurse', 'Other'] },
    { name: 'specialization', label: 'Specialization', type: 'select', required: true, options: [] },
  ];

  isUpdate = false; // Flag to check if the form is for updating or creating
  message: string = ''; // Success or error message
  createdStaff?: Staff | null = null; // To exibit staff created
  isExpanded: boolean = false;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.staffService.getSpecializations().then((specializations) => {
      const specializationField = this.fields.find(field => field.name === 'specialization');
      if (specializationField) {
        specializationField.options = specializations;
      }
    });
  }

  // Method to submit form with staff data
  onSubmit() {
    console.log('Staff data:', this.staff);

    // Clean messages and staff data before each sent to backend
    this.message = '';
    this.createdStaff = null;

    // Send data to backend
    this.staffService.createStaff(this.staff).subscribe({
      next: (createdStaff) => {
          this.message = 'Staff created successfully!';
          this.createdStaff = createdStaff; //status code 2xx
          console.log('Staff created successfully:', createdStaff);

          // Emit event of created staff
          this.staffService.staffUpdatedSource.next();
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          const err = `Error creating Staff profile. Verify data and try again! \n- License number, email and phone number must be unique!`;
          this.message = err.replace(/\n/g, '<br>');

        } else if (error.status >= 500 && error.status < 600) {
          this.message = `Error creating Staff profile. Connection failed!`;
        }

        console.error('Error creating Staff profile:', error);
      }
    });
  }

  // Method to clear the form and reset the staff object for a new entry
  createNewStaff() {
    this.createdStaff = null; // Reset the created staff details
    this.staff = {
      id: '',
      fullName: '',
      licenseNumber: '',
      email: '',
      phoneNumber: '',
      recruitmentYear: new Date().getFullYear(),
      category: '',
      specialization: ''
    };

    this.message = '';
    this.isUpdate = false;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

}
