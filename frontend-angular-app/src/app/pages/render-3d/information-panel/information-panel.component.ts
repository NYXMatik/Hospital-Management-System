// information-panel.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RoomInfo {
  RoomId: string;
  specialization: string;
  schedule: TimeSlot[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  activity: string;
}

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class InformationPanelComponent {
  @Input() visible = false;
  @Input() roomInfo: RoomInfo | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}