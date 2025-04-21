import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientProfile } from '../models/patient-profile';
import { Subject } from 'rxjs';

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
export class PatientService {

  constructor(private http: HttpClient,
    @Inject('PATIENT_PROFILE_API_URL') private apiUrl: string) { }

  public patientUpdatedSource = new Subject<void>(); // Subject to emit updating event
  patientUpdated$ = this.patientUpdatedSource.asObservable();

  createPatient(patient: PatientProfile): Observable<PatientProfile> {
    return this.http.post<PatientProfile>(this.apiUrl, patient, httpOptions);
  }

  getPatients(): Observable<HttpResponse<PatientProfile[]>>{
    return this.http.get<PatientProfile[]>(
      this.apiUrl,
      { observe: 'response' }
    );
  }

  filterPatients(name?: string, email?: string, phoneNumber?: string, birth?: string, gender?: string): Observable<HttpResponse<PatientProfile[]>> {
    let query = '?';
    if (name) query += `name=${encodeURIComponent(name)}&`;
    if (email) query += `email=${encodeURIComponent(email)}&`;
    if (phoneNumber) query += `phone=${encodeURIComponent(phoneNumber)}&`;
    if (birth) query += `birth=${encodeURIComponent(birth)}&`;
    if (gender) query += `gender=${encodeURIComponent(gender)}&`;

    const theUrl = `${this.apiUrl}/filter${query.slice(0, -1)}`; // Remove the "&" extra at the end
    console.log("url", theUrl);
    return this.http.get<PatientProfile[]>(theUrl, { observe: 'response' });
  }

  // Method to search by medicalRecordNumber
  getPatientsById(medicalRecordNum: string): Observable<HttpResponse<PatientProfile>> {
    const theUrl = `${this.apiUrl}/${medicalRecordNum}`;

    return this.http.get<PatientProfile>(
      theUrl,
      { observe: 'response' }
    );
  }

  updatePatient(patient: PatientProfile): Observable<PatientProfile> {
    const theUrl = `${this.apiUrl}/${patient.medicalRecordNum}`;

    return this.http.put<PatientProfile>(
      theUrl,
      patient,
      httpOptions
    );
  }

  deactivatePatient(medicalRecordNum: string): Observable<any>{
    const theUrl = `${this.apiUrl}/${medicalRecordNum}`;

    return this.http.delete(
      theUrl,
      httpOptions
      )
    }

}
