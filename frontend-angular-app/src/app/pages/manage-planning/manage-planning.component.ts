import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulerService } from '../../services/scheduler.service';

export interface Schedule {
  endTime: number;
  roomSchedule: RoomEvent[];
  staffSchedules: StaffSchedule[];
  status: string;
}

interface RoomEvent {
  end: number;
  id: string;
  start: number;
}

interface StaffSchedule {
  schedule: RoomEvent[];
  staff: string;
}

@Component({
  selector: 'app-manage-planning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-planning.component.html',
  styleUrl: './manage-planning.component.css'
})
export class ManagePlanningComponent {
  schedule: Schedule | null = null;

  constructor(private schedulerService: SchedulerService) {}

  getNormalSchedule() {
    this.schedulerService.getNormalSchedule().subscribe({
      next: (data: Schedule) => {
        this.schedule = data;
        console.log('Normal Schedule:', this.schedule);
      },
      error: (error) => console.error('Error fetching normal schedule:', error)
    });
  }

  getOccupancySchedule() {
    this.schedulerService.getOccupancySchedule().subscribe({
      next: (data: Schedule) => {
        this.schedule = data;
        console.log('Occupancy Schedule:', this.schedule);
      },
      error: (error) => console.error('Error fetching occupancy schedule:', error)
    });
  }
}