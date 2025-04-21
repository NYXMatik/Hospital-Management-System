import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecordAddComponent } from './record-add/record-add.component';

@Component({
  selector: 'app-manage-medical-records',
  standalone: true,
  imports: [RouterModule, RecordAddComponent],
  templateUrl: './manage-medical-records.component.html',
  styleUrls: ['../components-styles/manage.component.css']
})
export class ManageMedicalRecordsComponent {
}