import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import { MedicalCondition } from '../models/medical-condition.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept': 'application/json',
    //Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {

  constructor(private http: HttpClient,
    @Inject('MEDICAL_CONDITIONS_API_URL') private apiUrl: string) {}

  public medicalConditionUpdatedSource = new Subject<void>(); // Subject to emit event of updating
  medicalConditionUpdated$ = this.medicalConditionUpdatedSource.asObservable();

  createMedicalCondition(medicalCondition: MedicalCondition): Observable<MedicalCondition> {
    return this.http.post<MedicalCondition>(
      this.apiUrl,
      medicalCondition,
      httpOptions
    );
  }

  listAndfilterMedicalConditions(code?: string, designation?: string): Observable<HttpResponse<MedicalCondition[]>> {
    let query = '?';
    if (code) query += `code=${encodeURIComponent(code)}&`;
    if (designation) query += `designation=${encodeURIComponent(designation)}&`;

    const theUrl = `${this.apiUrl}${query.slice(0, -1)}`; // Remove the "&" extra at the end
    return this.http.get<MedicalCondition[]>(theUrl, { observe: 'response' });
  }

  updateMedicalCondition(medicalCondition: MedicalCondition): Observable<MedicalCondition> {
    const theUrl = `${this.apiUrl}/${medicalCondition.code}`;

    return this.http.patch<MedicalCondition>(
      theUrl,
      medicalCondition,
      httpOptions
    );
  }

}
