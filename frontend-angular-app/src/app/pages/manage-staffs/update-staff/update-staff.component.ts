import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../../../services/staff.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../generic-form/generic-form.component';
import { Staff } from '../../../models/staff.model';

@Component({
  selector: 'app-update-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './update-staff.component.html',
  styleUrls: ['../../components-styles/update.component.css']
})
export class UpdateStaffComponent implements OnInit{

  message: string = ''; // Success or error message
  updatedStaff?: Staff | null = null; // To exibit staff created
  staffId: string | null = null;
  fields: any[] = [];
  isUpdate = true;

  @Input() staff: Staff = {
    id: '',
    fullName: '',
    licenseNumber: '',
    email: '',
    phoneNumber: '',
    recruitmentYear: new Date().getFullYear(),
    category: '',
    specialization: ''
  };

  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();

  constructor(private staffService: StaffService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      const state = currentNavigation.extras.state;
      if (state && state['staff']) {
        this.staff = state['staff'];
      } else {
        this.message = 'No staff data available!';
      }
    }

    this.staffService.getSpecializations().then((specializations) => {
      const specializationField = this.fields.find(field => field.name === 'specialization');
      if (specializationField) {
        specializationField.options = specializations;
      }
    });

    this.fields = [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
      { name: 'specialization', label: 'Specialization', type: 'select', required: true, options: [] },
    ];
  }

  onSubmit() {
    console.log('Staff data:', this.staff);

    this.message = '';
    this.updatedStaff = null;

    this.staffService.updateStaff(this.staff).subscribe({
      next: (updatedStaff) => {
        this.message = 'Staff updated successfully!';
        this.updatedStaff = updatedStaff; // Atualização bem-sucedida
        console.log('Staff updated successfully:', this.updatedStaff);

        // Emit event of created staff
        this.staffService.staffUpdatedSource.next();
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          if (error.error && error.error.errors) {
            const err = `Error updating Staff profile. Please verify the following:\n- ${error.error.errors.join('\n- ')}`;
            this.message = err.replace(/\n/g, '<br>');
          }
        } else if (error.status >= 500 && error.status < 600) {
          this.message = `Error updating Staff profile. Connection failed!`;
        }
        console.error('Error updating Staff profile:', error);
      }
    });
  }

  closeModal(): void {
    this.close.emit();
    this.router.navigate(['./'], { relativeTo: this.route });
  }
}

