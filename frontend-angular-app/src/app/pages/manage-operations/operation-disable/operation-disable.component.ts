// operation-disable.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationTypeService, OperationTypeDTO, VersionDTO } from '../../../services/operation-type.service';
import { GenericFormComponent } from '../../generic-form/generic-form.component';

@Component({
  selector: 'app-operation-disable',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericFormComponent],
  templateUrl: './operation-disable.component.html',
  styleUrls: ['../../components-styles/update.component.css']
})
export class OperationDisableComponent {
  operationName: string = '';
  operation?: OperationTypeDTO;
  latestVersion?: VersionDTO;
  loading: boolean = false;
  message: string = '';
  disabledOperation?: OperationTypeDTO | null = null;

  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();

  fields = [
    { name: 'operationName', label: 'Operation Name', type: 'text', required: true }
  ];

  constructor(
    private operationService: OperationTypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  searchOperation(): void {
    this.loading = true;
    this.message = '';
    
    this.operationService.getOperationByName(this.operationName).subscribe({
      next: (operation) => {
        this.operation = operation;
        this.latestVersion = this.getLatestVersion();
        this.loading = false;
      },
      error: () => {
        this.message = 'Operation not found';
        this.loading = false;
      }
    });
  }

  confirmDisable(): void {
    if (!this.operation || !this.latestVersion) return;

    const newVersion: VersionDTO = {
      ...this.latestVersion,
      versionNumber: this.latestVersion.versionNumber + 1,
      date: new Date().toISOString().split('T')[0],
      status: false,
      pending: false
    };

    this.loading = true;
    this.operationService.updateOperation(this.operationName, newVersion).subscribe({
      next: (updatedOperation) => {
        this.message = 'Operation disabled successfully';
        this.disabledOperation = updatedOperation;
        this.loading = false;
        this.operationService.operationUpdated.next();
      },
      error: () => {
        this.message = 'Failed to disable operation';
        this.loading = false;
      }
    });
  }

  public getLatestVersion(): VersionDTO | undefined {
    if (!this.operation?.versions.length) return undefined;
    return this.operation.versions.reduce((latest, current) => 
      current.versionNumber > latest.versionNumber ? current : latest
    );
  }

  closeModal(): void {
    this.close.emit();
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  cancel(): void {
    if (this.isModal) {
      this.closeModal();
    } else {
      this.router.navigate(['/admin/manage-operations']);
    }
  }
}