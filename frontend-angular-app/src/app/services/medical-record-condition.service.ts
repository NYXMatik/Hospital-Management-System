import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { MedicalCondition } from '../models/medical-condition.model';
import { MedicalRecord } from '../models/medical-record.model';
import { MedicalConditionService } from './medical-condition.service';
import { MedicalConditionAPI } from '../models/medical-condition-api.model';


export interface ConditionItem {
  code: string;
  designation: string;
  description: string;
  commonSymptoms: string[];
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordConditionService {
  constructor(
    private http: HttpClient,
    @Inject('MEDICAL_RECORDS_API_URL') private apiUrl: string,
    private medicalConditionService: MedicalConditionService
  ) {}

  private refreshListSource = new Subject<void>();
  refreshList$ = this.refreshListSource.asObservable();

  public conditionUpdatedSource = new Subject<void>();
  conditionUpdated$ = this.conditionUpdatedSource.asObservable();


  private transformApiToModel(apiCondition: MedicalConditionAPI): MedicalCondition {
    return {
      code: apiCondition.medicalConditionId,
      designation: apiCondition.name,
      description: apiCondition.description,
      commonSymptoms: apiCondition.commonSymptoms
    };
  }

  // Get conditions list from condition service
  getMedicalConditions(): Observable<HttpResponse<MedicalCondition[]>> {
    console.log('Getting medical conditions:\n', this.medicalConditionService.listAndfilterMedicalConditions());
    return this.medicalConditionService.listAndfilterMedicalConditions();
  }

  // Update conditions in medical record
  updateConditions(userId: string, conditions: string[]): Observable<MedicalRecord> {
    const url = `http://localhost:5005/api/medical-records/medical-conditions/${userId}`;
    const payload = { 
      medicalConditions: conditions.map(code => code.trim())
    };
    return this.http.patch<MedicalRecord>(
      url,
      payload,
      {
        ...httpOptions,
        observe: 'body',
        responseType: 'json'
      }
    ).pipe(
      tap(() => this.refreshListSource.next())
    );
  }

  // Update a specific condition in medical record
  updateCondition(userId: string, condition: MedicalCondition): Observable<MedicalRecord> {
    const url = `http://localhost:5005/api/medical-records/medical-conditions/${userId}`;
    
    const symptoms = (Array.isArray(condition.commonSymptoms)
      ? condition.commonSymptoms
      : (typeof condition.commonSymptoms === 'string'
        ? (condition.commonSymptoms as string).split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [])) as string[];

    const payload = {
      code: condition.code,
      designation: condition.designation,
      description: condition.description,
      commonSymptoms: symptoms
    };

    return this.http.put<MedicalRecord>(
      url,
      payload,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(() => this.refreshListSource.next())
    );
  }
}