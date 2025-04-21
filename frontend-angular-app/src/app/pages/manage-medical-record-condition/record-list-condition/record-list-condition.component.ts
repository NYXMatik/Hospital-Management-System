import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../../generic-search/search-form.component';
import { ResultListComponent } from '../../generic-search/result-form.component';
import { MedicalRecordConditionService } from '../../../services/medical-record-condition.service';
import { Subject, takeUntil } from 'rxjs';
import { MedicalCondition } from '../../../models/medical-condition.model';

export interface ConditionItem {
  code: string;
  designation: string;
  description: string;
  commonSymptoms: string[];
}


@Component({
  selector: 'app-record-list-condition',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, ResultListComponent],
  templateUrl: './record-list-condition.component.html',
  styleUrls: ['./record-list-condition.component.css']
})
export class RecordListConditionComponent implements OnChanges {
  @Input() conditions: MedicalCondition[] = []; 
  @Input() isExpanded: boolean = false;
  @Output() editCondition = new EventEmitter<MedicalCondition>();

  searchFields = [
    { 
      name: 'code', 
      label: 'Condition Code', 
      placeholder: 'Enter condition code',
      value: '' 
    }
  ];

  displayConfig = {
    title: (item: ConditionItem) => `${item.code} - ${item.designation}`,
    subtitle: (item: ConditionItem) => item.description,
    details: (item: ConditionItem) => item.commonSymptoms.join(', ')
  };

  conditionItems: ConditionItem[] = [];


  actions = [
    { label: 'Depreciate', action: 'edit', class: 'add-button' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private medicalRecordConditionService: MedicalRecordConditionService) {}

  ngOnInit() {
    console.log('Initial conditions:', this.conditions);
    this.medicalRecordConditionService.refreshList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSearch('');
      });

    this.medicalRecordConditionService.conditionUpdated$
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
    if (changes['conditions']) {
      console.log('Conditions changed:', changes['conditions'].currentValue);
      this.updateConditionItems(this.conditions);
    }
  }

  private updateConditionItems(conditions: MedicalCondition[]) {
    if (!conditions) {
      console.warn('No conditions provided');
      return;
    }
  
    this.conditionItems = conditions.map(condition => ({
      code: condition.code,
      designation: condition.designation,
      description: condition.description,
      commonSymptoms: condition.commonSymptoms
    }));
  
    console.log('Updated conditionItems:', this.conditionItems);
  }
  
  onSearch(values: any): void {
    if (!values.code) {
      this.updateConditionItems(this.conditions);
      return;
    }
    
    const searchTerm = values.code.toLowerCase();
    const filteredConditions = this.conditions.filter(condition => 
      condition.code.toLowerCase().includes(searchTerm) ||
      condition.designation.toLowerCase().includes(searchTerm)
    );
    
    this.updateConditionItems(filteredConditions);
  }

  onAction(event: { action: string; item: MedicalCondition }): void {
    if (event.action === 'edit') {
      this.editCondition.emit(event.item);
    }
  }
}