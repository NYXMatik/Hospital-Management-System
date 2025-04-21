import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationTypeService, OperationTypeDTO, VersionDTO, PhaseDTO, StaffRequirementDTO } from '../../../services/operation-type.service';
import { GenericFormComponent } from '../../generic-form/generic-form.component';

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  showSubmit: boolean;
  options?: string[];
}

@Component({
  selector: 'app-create-operation',
  standalone: true,
  imports: [FormsModule, CommonModule, GenericFormComponent],
  templateUrl: './create-operation.component.html',
  styleUrls: [
    '../../components-styles/create.component.css'
  ]
})
export class CreateOperationComponent implements OnInit {
  operation: OperationTypeDTO = {
    name: '',
    versions: []
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

  specializations: string[] = [];
  roles: string[] = [];
  isUpdate = false;
  message: string = '';
  createdOperation: OperationTypeDTO | null = null;
  isExpanded: boolean = false;

  constructor(private operationService: OperationTypeService) {
    this.addVersion();
  }

  ngOnInit(): void {
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
      this.message = 'Error loading specializations and roles';
    }
  }

  addVersion() {
    const newVersion: VersionDTO = {
      versionNumber: this.operation.versions.length + 1,
      date: new Date().toISOString().split('T')[0],
      status: true,
      pending: false,
      phases: []
    };
    this.addDefaultPhases(newVersion);
    this.operation.versions.push(newVersion);
  }

  addDefaultPhases(version: VersionDTO) {
    const defaultPhases: PhaseDTO[] = [
      {
        name: 'Preparation',
        description: '',
        duration: '00:30:00',
        phaseStep: 1,
        staffList: [{  // Initialize with one staff member
          specialty: '',
          role: '',
          quantity: 1
        }]
      },
      {
        name: 'Operation',
        description: '',
        duration: '02:00:00',
        phaseStep: 2,
        staffList: [{
          specialty: '',
          role: '',
          quantity: 1
        }]
      },
      {
        name: 'Recovery',
        description: '',
        duration: '01:00:00',
        phaseStep: 3,
        staffList: [{
          specialty: '',
          role: '',
          quantity: 1
        }]
      }
    ];
    version.phases = defaultPhases;
  }

  addPhase(version: VersionDTO): void {
    const newPhase: PhaseDTO = {
      name: `Phase ${version.phases.length + 1}`,
      description: '',
      duration: '00:30:00',
      phaseStep: version.phases.length + 1,
      staffList: [{  // Initialize with one required staff member
        specialty: '',
        role: '',
        quantity: 1
      }]
    };
    version.phases.push(newPhase);
  }

  removePhase(version: VersionDTO, index: number) {
    if (version.phases.length > 3) {
      version.phases.splice(index, 1);
      // Update phase steps
      version.phases.forEach((phase, idx) => {
        phase.phaseStep = idx + 1;
      });
    }
  }

  addStaffToPhase(phase: PhaseDTO): void {
    const newStaff: StaffRequirementDTO = {
      specialty: '',
      role: '',
      quantity: 1
    };
    phase.staffList.push(newStaff);
  }

  removeStaffFromPhase(phase: PhaseDTO, index: number): void {
    phase.staffList.splice(index, 1);
  }

  validateOperation(): boolean {
    if (!this.operation.name) return false;
    return this.operation.versions.every(version => 
      version.phases.every(phase => 
        phase.staffList.length > 0 && 
        phase.staffList.every(staff => 
          staff.specialty && staff.role && staff.quantity > 0
        )
      )
    );
  }

  onSubmit() {
    this.message = '';
    this.createdOperation = null;

    if (!this.validateOperation()) {
      this.message = 'Please fill all required fields and ensure each phase has at least one staff member';
      return;
    }

    this.operationService.addOperation(this.operation).subscribe({
      next: (createdOperation) => {
        this.message = 'Operation type created successfully!';
        this.createdOperation = createdOperation;
        this.operationService.operationUpdated.next();
      },
      error: (error) => {
        if (error.status >= 400 && error.status < 500) {
          this.message = 'Error creating operation type. Operation name must be unique!';
        } else {
          this.message = 'Error creating operation type. Connection failed!';
        }
      }
    });
  }

  createNewOperation() {
    this.createdOperation = null;
    this.operation = {
      name: '',
      versions: []
    };
    this.addVersion();
    this.message = '';
    this.isUpdate = false;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
}