import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Allergy } from '../../../models/allergy';

@Component({
  selector: 'app-record-update-allergy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-update-allergy.component.html',
  styleUrls: ['./record-update-allergy.component.css']
})
export class RecordUpdateAllergyComponent {
  @Input() userId!: string;
  @Input() allergy!: Allergy;
  @Output() formSubmit = new EventEmitter<any>();

  deprecateAllergy() {
    this.formSubmit.emit({
      ...this.allergy,
      designation: `${this.allergy.designation} - Deprecated`
    });
  }
}

