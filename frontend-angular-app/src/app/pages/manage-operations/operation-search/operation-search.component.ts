import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationTypeService, OperationTypeDTO, VersionDTO, PhaseDTO, StaffRequirementDTO } from '../../../services/operation-type.service';
import { UpdateOperationComponent } from '../operation-update/operation-update.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-operation',
  standalone: true,
  imports: [FormsModule, CommonModule, UpdateOperationComponent, RouterModule],
  templateUrl: './operation-search.component.html',
  styleUrls: ['../../components-styles/search.component.css',
              '../../components-styles/delete.component.css']
})



export class SearchOperationComponent implements OnInit {
  isLoading: boolean = false;
  success: string | null = null;
  error: string | null = null;
  isExpanded: boolean = false;

  operations: OperationTypeDTO[] = [];
  name: string = '';
  showInactive: boolean = false;

  selectedOperation: any = null;
  isModalActive = false;

  detailedOperation: OperationTypeDTO | null = null;
  isDetailsModalActive = false;

  isDeleteModalActive = false;
  operationToDelete: string | null = null;


  private subscription!: Subscription;

  constructor(
    private operationService: OperationTypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOperations();
    this.subscription = this.operationService.operationUpdated.subscribe(() => {
      this.clearMessages();
      this.getOperations();
    });
  }

  clearMessages() {
    this.success = '';
    this.error = '';
  }

  getOperations(): void {
    this.isLoading = true;
    this.operationService.getOperations().subscribe({
      next: (operations) => {
        this.operations = operations.filter(op => {
          const latestVersion = this.getLatestVersion(op);
          return this.showInactive || (latestVersion?.status ?? false);
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error loading operations';
        this.isLoading = false;
      }
    });
  }

  searchOperations(): void {
    this.clearMessages();
    this.isLoading = true;
    
    this.operationService.getOperations().subscribe({
      next: (operations) => {
        this.operations = operations
          .filter(op => op.name.toLowerCase().includes(this.name.toLowerCase()))
          .filter(op => {
            const latestVersion = this.getLatestVersion(op);
            return this.showInactive || (latestVersion?.status ?? false);
          });
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error searching operations';
        this.isLoading = false;
      }
    });
  }

  public getLatestVersion(operation: OperationTypeDTO) {
    if (!operation.versions.length) return undefined;
    return operation.versions.reduce((latest, current) => 
      current.versionNumber > latest.versionNumber ? current : latest
    );
  }

  openEditModal(operation: OperationTypeDTO): void {
    this.router.navigate(['update'], {
      relativeTo: this.route,
      state: { operation }
    });
    this.selectedOperation = { ...operation };
    this.isModalActive = true;
  }

  openDetailsModal(operationName : string): void {
    this.operationService.getOperationByName(operationName).subscribe({
      next: (operation) => {
        this.detailedOperation = operation;
      },
      error: (error) => {
        this.error = 'Error loading operation details';
      }
    });
    this.isDetailsModalActive = true;
  }

  closeEditModal(): void {
    this.selectedOperation = null;
    this.isModalActive = false;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }


  
  // Add method to close details modal
  closeDetailsModal(): void {
    this.detailedOperation = null;
    this.isDetailsModalActive = false;
  }

  openDeleteModal(operationName: string): void {
    this.operationToDelete = operationName;
    this.isDeleteModalActive = true;
  }

  closeDeleteModal(): void {
    this.operationToDelete = null;
    this.isDeleteModalActive = false;
  }

  confirmDelete(): void {
    if (this.operationToDelete) {
      this.operationService.deleteOperation(this.operationToDelete).subscribe({
        next: () => {
          this.success = 'Operation deleted successfully';
          this.getOperations();
          this.closeDeleteModal();
        },
        error: (error) => {
          this.error = 'Error deleting operation';
        }
      });
    }
  }
}