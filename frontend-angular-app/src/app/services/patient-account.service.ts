import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept': 'application/json',
    //Authorization: 'my-auth-token'
  })
};

export interface PatientAccount {
  name(arg0: string, name: any): unknown;
  profileId: any;
  data: any;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birth: string;
  emergencyContact: string;
}
export interface Appointment {
  appointmentId: string;
  patientId: string;
  appointmentDate: string;
  description: string;
  doctor: string;
  status: string;
}
@Injectable({
  providedIn: 'root',

})
export class PatientAccountService {

  constructor(private http: HttpClient,
  @Inject('PATIENT_ACCOUNT_API_URL') private apiUrl: string
  ) {}

  // Register a new patient account
  registerPatientAccount(patientAccount: PatientAccount): Observable<PatientAccount> {
    return this.http.post<PatientAccount>(`${this.apiUrl}/register`, patientAccount);
  }

  // Fetch all patient accounts 
  getAllPatientAccounts(): Observable<{ data: PatientAccount[] }> {
    return this.http.get<{ data: PatientAccount[] }>(this.apiUrl, httpOptions);
  }
  getPatientAccountByEmail(email: string): Observable<PatientAccount> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<PatientAccount>(`${this.apiUrl}/email/${encodedEmail}`);
  }
  // Fetch a single patient account by ID
  getPatientAccountById(id: string): Observable<PatientAccount> {
    return this.http.get<PatientAccount>(`${this.apiUrl}/${id}`);
  }

  // Update patient account details
  updatePatientAccount(id: string, patientAccount: Partial<PatientAccount>): Observable<PatientAccount> {
    return this.http.put<PatientAccount>(`${this.apiUrl}/${id}`, patientAccount);
  }

  // Delete a patient account 
  deletePatientAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // Add an appointment
  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }
}
