import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../../generic-search/search-form.component';
import { ResultListComponent } from '../../generic-search/result-form.component';
import { MedicalRecordAllergyService } from '../../../services/medical-record-allergy.service';
import { Subject, takeUntil } from 'rxjs';

interface AllergyItem {
  code: string;
  designation: string;
  description: string;
}

@Component({
  selector: 'app-record-list-allergy',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, ResultListComponent],
  templateUrl: './record-list-allergy.component.html',
  styleUrls: ['./record-list-allergy.component.css']
})
export class RecordListAllergyComponent implements OnChanges {
  @Input() allergies: AllergyItem[] = []; 
  @Input() isExpanded: boolean = false;
  @Output() editAllergy = new EventEmitter<AllergyItem>();

  searchFields = [
    { 
      name: 'code', 
      label: 'Allergy Code', 
      placeholder: 'Enter allergy code',
      value: '' 
    }
  ];

  allergyItems: AllergyItem[] = [];
  actions = [
    { label: 'Depreciate', action: 'edit', class: 'add-button' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private medicalRecordAllergyService: MedicalRecordAllergyService) {}

  ngOnInit() {
    this.medicalRecordAllergyService.refreshList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSearch('');
      });

    this.medicalRecordAllergyService.allergyUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSearch('');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allergies']) {
      this.allergyItems = this.allergies;
      console.log(this.allergyItems); // Add this line to check the structure
    }
  }

  onSearch(values: any): void {
    if (!values.code) {
      this.allergyItems = this.allergies;
      console.log(this.allergyItems);
      return;
    }
    
    this.allergyItems = this.allergies.filter(allergy => 
      allergy.code.toLowerCase().includes(values.code.toLowerCase()) ||
      allergy.designation.toLowerCase().includes(values.code.toLowerCase())
    );
  }

  onAction(event: { action: string; item: AllergyItem }): void {
    if (event.action === 'edit') {
      this.editAllergy.emit(event.item);
    }
  }
}