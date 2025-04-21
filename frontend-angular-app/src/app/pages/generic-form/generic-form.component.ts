import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
// generic-form.component.ts
export class GenericFormComponent {
  @Input() fields: any[] = [];
  @Input() formData: any = {};
  @Input() isUpdate: any = {};
  @Input() showSubmit: boolean = true; // New input property with default true
  @Output() formSubmit = new EventEmitter<any>();

  constructor() {}

  submitForm() {
    this.formSubmit.emit(this.formData);
  }
}