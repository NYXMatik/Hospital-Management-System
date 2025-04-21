import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environment.prod';

// Update DTO interfaces in operation-type.service.ts
export interface StaffRequirementDTO {
  specialty: string;
  role: string;
  quantity: number;
}

export interface PhaseDTO {
  name: string;
  description: string;
  duration: string;
  phaseStep: number;
  staffList: StaffRequirementDTO[];
}

export interface VersionDTO {
  versionNumber: number;
  date: string;
  status: boolean;
  pending: boolean;
  phases: PhaseDTO[];
}

export interface OperationTypeDTO {
  name: string;
  versions: VersionDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class OperationTypeService {
  private apiUrl = environment.apiUrl + environment.endpoints.operation_type;

  public operationUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getOperations(): Observable<OperationTypeDTO[]> {
    return this.http.get<OperationTypeDTO[]>(`${this.apiUrl}`);
  }

  getOperationByName(name: string): Observable<OperationTypeDTO> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<OperationTypeDTO>(`${this.apiUrl}/${encodedName}`);
  }

  addOperation(operation: OperationTypeDTO): Observable<OperationTypeDTO> {
    return this.http.post<OperationTypeDTO>(this.apiUrl, operation);
  }

  updateOperation(name: string, version: VersionDTO): Observable<OperationTypeDTO> {
    const encodedName = encodeURIComponent(name);
    return this.http.post<OperationTypeDTO>(`${this.apiUrl}/${encodedName}`, version);
  }

  deleteOperation(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name);
    return this.http.delete(`${this.apiUrl}/${encodedName}`);
  }

  getRoles(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['Doctor', 'Nurse', 'Other']);
      }, 100);
    });
  }

  getSpecializations(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          'Cardiology',
          'Neurology',
          'Orthopedics',
          'Dermatology',
          'Gastroenterology',
          'Psychiatry',
          'Pediatrics',
        ]);
      }, 100);
    });
  }
}
