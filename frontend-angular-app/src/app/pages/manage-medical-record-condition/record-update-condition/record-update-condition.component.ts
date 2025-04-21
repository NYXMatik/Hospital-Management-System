import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalCondition } from '../../../models/medical-condition.model';

@Component({
  selector: 'app-record-update-condition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-update-condition.component.html',
  styleUrls: ['./record-update-condition.component.css']
})
export class RecordUpdateConditionComponent {
  @Input() userId!: string;
  @Input() condition!: MedicalCondition;
  @Output() formSubmit = new EventEmitter<any>();

  deprecateCondition() {
    this.formSubmit.emit({
      ...this.condition,
      designation: `${this.condition.designation} - Deprecated`
    });
  }
}