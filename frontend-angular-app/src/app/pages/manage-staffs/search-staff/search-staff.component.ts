import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Staff } from '../../../models/staff.model';
import { StaffService } from '../../../services/staff.service';
import { UpdateStaffComponent } from '../update-staff/update-staff.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-staff',
  standalone: true,
  imports: [FormsModule, CommonModule, UpdateStaffComponent, RouterModule],
  templateUrl: './search-staff.component.html',
  styleUrls: ['../../components-styles/search.component.css']
})
export class SearchStaffComponent implements OnInit {

  isLoading: boolean = false;
  headers: string[] = [];
  success: string | null = null;
  error: string | null = null;
  isExpanded: boolean = false;

  staffList: Staff[] = [];
  email: string = '';
  specialization: string = '';
  name: string = '';
  phoneNumber: string = '';

  selectedStaff: any = null;
  isModalActive = false;
  specializations: string[] = []; // Lista dinâmica de especializações

  private subscription!: Subscription;

  constructor(private staffService: StaffService, private router: Router, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.getStaffs();
    this.subscription = this.staffService.staffUpdated$.subscribe(() => {
      this.clearMessages();
      this.getStaffs(); // Loads/Update staff list
    });

    // Reutiliza o serviço para buscar especializações
    this.staffService.getSpecializations().then((specializations) => {
      this.specializations = specializations;
    });
  }

  clearMessages() {
    this.success = '';
    this.error = '';
  }

  // Method to get all staffs
  getStaffs(): void {
    this.isLoading = true;

    this.staffService.getStaffs().subscribe({
      next: (resp) => {
        if (!resp.body || resp.body.length === 0) {
          this.error = 'No staff found!';
          this.staffList = [];
          this.isLoading = false;
        } else if (resp.headers){
          // Extract the header
          const keys = resp.headers.keys();
          this.headers = keys.map(key => `${key}: ${resp.headers.get(key)}`);
          // Extract the body
          this.staffList = resp.body;
          this.isLoading = false;
        }
      },
      error: (error) => {

        if (error.status >= 400 && error.status < 500) {
          this.error  = `Error geting Staff profile. No staff found!`;

        } else if (error.status >= 500 && error.status < 600) {
          this.error = `Error geting Staff profile. Connection failed!`;
        }

        this.isLoading = false;

        console.error('Error creating Staff profile:', error);
      }
    });
  }

  searchStaffs(): void {
    this.clearMessages();
    this.isLoading = true;

    this.staffService.filterStaffs(this.name, this.email, this.specialization).subscribe({
      next: (resp) => {
        if (!resp.body || resp.body.length === 0) {
          this.error = 'No staff found!';
          this.staffList = [];
        } else {
          this.staffList = resp.body;
          console.log("staff list", this.staffList);
        }
        this.isLoading = false;
      },
      error: (error) => {

        if (error.status >= 400 && error.status < 500) {
          this.error  = `Error geting Staff profile. No staff found!`;

        } else if (error.status >= 500 && error.status < 600) {
          this.error = `Error geting Staff profile. Connection failed!`;
        }

        this.isLoading = false;

        console.error('Error creating Staff profile:', error);

      },
    });
  }

  deactivateStaff(staff: Staff): void {
    this.clearMessages();

    if (confirm(`Are you sure you want to deactivate ${staff.fullName}?`)) {
      this.staffService.deactivateStaff(staff.id).subscribe({
        next: (response) => {

          if (response && response.message) {
            this.success = response.message;
            console.log("Staff deactivated");
            this.getStaffs();
          }
        },
        error: (error) => {
          if (error.status >= 400 && error.status < 500) {
            this.error = `Error deactivating Staff profile.`;

          } else if (error.status >= 500 && error.status < 600) {
            this.error = `Error deactivating Staff profile. Connection failed!`;
          }
          this.isLoading = false;
          console.error('Error deactivating Staff profile:', error);
        }
      });
    }
  }


  openEditModal(staff: Staff): void {
    console.log('Edit button clicked for Staff:', staff);

    this.router.navigate(['update'], {
    relativeTo: this.route,
    state: { staff }
  });

  this.selectedStaff = { ...staff };
  this.isModalActive = true; // Activate modal
  }

  closeEditModal(): void {
    this.selectedStaff = null;
    this.isModalActive = false; // Close modal
  }

  isModalRouteActive(): boolean {
    const firstChild = this.route.firstChild;
    if (!firstChild) {
      return false;
    }
    return firstChild.snapshot.url[0]?.path === 'update';
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }


}
