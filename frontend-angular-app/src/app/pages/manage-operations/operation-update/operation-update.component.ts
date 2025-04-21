import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericFormComponent } from '../../generic-form/generic-form.component';
import { OperationTypeService, OperationTypeDTO, VersionDTO, PhaseDTO } from '../../../services/operation-type.service';

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  showSubmit: boolean;
  options?: string[];
}

@Component({
  selector: 'app-update-operation',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './operation-update.component.html',
  styleUrls: ['../../components-styles/update.component.css', './operation-update.component.css']
})
export class UpdateOperationComponent implements OnInit {
  message: string = '';
  updatedOperation?: OperationTypeDTO | null = null;
  specializations: string[] = [];
  roles: string[] = [];
  isUpdate = true;

  @Input() operation: OperationTypeDTO = {
    name: '',
    versions: []
  };
  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();

  newVersion: VersionDTO = {
    versionNumber: 1,
    date: new Date().toISOString().split('T')[0],
    status: true,
    pending: false,
    phases: []
  };

  fields: Field[] = [
    { 
      name: 'name', 
      label: 'Operation Name', 
      type: 'text', 
      required: true,
      showSubmit: false
    }
  ];

  versionFields: Field[] = [
    { 
      name: 'date', 
      label: 'Date', 
      type: 'date', 
      required: true,
      showSubmit: true
    },
    { 
      name: 'status', 
      label: 'Active', 
      type: 'checkbox', 
      required: false,
      showSubmit: true
    },
    { 
      name: 'pending', 
      label: 'Pending', 
      type: 'checkbox', 
      required: false,
      showSubmit: true
    }
  ];

  phaseFields: Field[] = [
    { 
      name: 'name', 
      label: 'Phase Name', 
      type: 'text', 
      required: true,
      showSubmit: false
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'text', 
      required: true,
      showSubmit: false
    },
    { 
      name: 'duration', 
      label: 'Duration', 
      type: 'time', 
      required: true,
      showSubmit: false
    }
  ];

  staffFields: Field[] = [
    { 
      name: 'specialty', 
      label: 'Specialty', 
      type: 'select', 
      required: true,
      options: [], // Initialize with empty array
      showSubmit: false
    },
    { 
      name: 'role', 
      label: 'Role', 
      type: 'select', 
      required: true,
      options: [], // Initialize with empty array
      showSubmit: false
    },
    { 
      name: 'quantity', 
      label: 'Quantity', 
      type: 'number', 
      required: true,
      showSubmit: false
    }
  ];

  constructor(
    private operationService: OperationTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state) {
      const state = currentNavigation.extras.state;
      if (state && state['operation']) {
        this.operation = state['operation'];
        this.initializeNewVersion();  // Ensure this is called
      } else {
        this.message = 'No operation data available!';
      }
    } else {
      this.initializeNewVersion();  // Add default initialization if no state
    }
  
    this.loadDropdownOptions();
  }

  async loadDropdownOptions(): Promise<void> {
    try {
      this.specializations = await this.operationService.getSpecializations();
      this.roles = await this.operationService.getRoles();
      // Update staffFields options
      this.staffFields.find(field => field.name === 'specialty')!.options = this.specializations;
      this.staffFields.find(field => field.name === 'role')!.options = this.roles;
    } catch (error) {
      console.error('Error loading dropdown options:', error);
    }
  }

  private initializeNewVersion(): void {
    const latestVersion = this.getLatestVersion();
    if (!latestVersion) return;
    
    this.newVersion = {
      versionNumber: latestVersion.versionNumber + 1,
      date: new Date().toISOString().split('T')[0],
      status: true,
      pending: false,
      phases: [
        {
          name: 'Preparation',
          description: '',
          duration: '00:30:00',
          phaseStep: 1,
          staffList: [{ specialty: '', role: '', quantity: 1 }]
        },
        {
          name: 'Operation',
          description: '',
          duration: '02:00:00',
          phaseStep: 2,
          staffList: [{ specialty: '', role: '', quantity: 1 }]
        },
        {
          name: 'Recovery',
          description: '',
          duration: '01:00:00',
          phaseStep: 3,
          staffList: [{ specialty: '', role: '', quantity: 1 }]
        }
      ]
    };
  }

  private getLatestVersion(): VersionDTO | undefined {
    if (!this.operation?.versions.length) return undefined;
    return this.operation.versions.reduce((latest, current) => 
      current.versionNumber > latest.versionNumber ? current : latest
    );
  }

  addPhase(): void {
    this.newVersion.phases.push({
      name: `Phase ${this.newVersion.phases.length + 1}`,
      description: '',
      duration: '00:30:00',
      phaseStep: this.newVersion.phases.length + 1,
      staffList: [{ specialty: '', role: '', quantity: 1 }]
    });
  }

  removePhase(index: number): void {
    if (this.newVersion.phases.length <= 3) return;
    this.newVersion.phases.splice(index, 1);
    this.newVersion.phases.forEach((phase, idx) => {
      phase.phaseStep = idx + 1;
    });
  }

  addStaffToPhase(phase: PhaseDTO): void {
    phase.staffList.push({
      specialty: '',
      role: '',
      quantity: 1
    });
  }

  removeStaffFromPhase(phase: PhaseDTO, index: number): void {
    phase.staffList.splice(index, 1);
  }

  validatePhases(): boolean {
    return this.newVersion.phases.every(phase => phase.staffList.length >= 1);
  }

  ensureThreePhases(): void {
    while (this.newVersion.phases.length < 3) {
      this.addPhase();
    }
    while (this.newVersion.phases.length > 3) {
      this.newVersion.phases.pop();
    }
  }

  onSubmit() {
    this.message = '';
    this.updatedOperation = null;

    this.ensureThreePhases();

    if (!this.validatePhases()) {
      this.message = 'Each phase must have at least 1 staff member';
      return;
    }

    this.operationService.updateOperation(this.operation.name, this.newVersion).subscribe({
      next: (updatedOperation) => {
        this.message = 'Operation updated successfully!';
        this.updatedOperation = updatedOperation;
        this.operationService.operationUpdated.next();
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          this.message = 'Error updating operation. Please check your input.';
        } else {
          this.message = 'Error updating operation. Connection failed!';
        }
      }
    });
  }

  closeModal(): void {
    this.close.emit();
    this.router.navigate(['./'], { relativeTo: this.route });
  }
}