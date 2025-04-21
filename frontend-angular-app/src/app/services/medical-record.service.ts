import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { MedicalRecord } from '../models/medical-record.model';
import { PatientAccount, PatientAccountService } from './patient-account.service';
import { PatientProfile } from '../models/patient-profile';
import { PatientService } from './patient-profile.service';

export interface AllergyItem {
  code: string;
  designation: string;
  description: string;
}

interface MedicalRecordResponse {
  userId: string;
  medicalConditions: any[];
  allergies: any[];
}

export interface MedicalRecordWithPatient extends MedicalRecord {
  patientName: string;
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
export class MedicalRecordService {

  constructor(
    private http: HttpClient,
    private patientService: PatientService,
    private patientAccountService: PatientAccountService,
    @Inject('MEDICAL_RECORDS_API_URL') private apiUrl: string
  ) {}

  public medicalRecordUpdatedSource = new Subject<void>(); // Subject to emit event of updating
  medicalRecordUpdated$ = this.medicalRecordUpdatedSource.asObservable();

  createMedicalRecord(medicalRecord: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(
      this.apiUrl,
      medicalRecord,
      httpOptions
    );
  }

  listAndfilterMedicalRecords(): Observable<HttpResponse<MedicalRecord[]>> {
    return this.http.get<MedicalRecord[]>(
      this.apiUrl,
      { ...httpOptions, observe: 'response' }
    );
  }
  
  listMedicalRecordsWithPatientInfo(): Observable<HttpResponse<MedicalRecordWithPatient[]>> {
    return this.http.get<MedicalRecord[]>(this.apiUrl, httpOptions).pipe(
      switchMap(medicalRecords => {
        const medicalRecordsWithPatient$ = medicalRecords.map(medicalRecord => {
          return this.patientAccountService.getPatientAccountById(medicalRecord.userId).pipe(
            map(patient => {
              const medicalRecordWithPatient: MedicalRecordWithPatient = {
                ...medicalRecord,
                patientName: patient.data.name.fullName
              };
              return medicalRecordWithPatient;
            })
          );
        });
        return forkJoin(medicalRecordsWithPatient$).pipe(
          map(medicalRecordsWithPatient => {
            return new HttpResponse({
              body: medicalRecordsWithPatient,
              status: 200,
              statusText: 'OK'
            });
          })
        );
      })
    );
  }

  updateMedicalConditions(userId: string, medicalConditions: string[]): Observable<MedicalRecord> {
    const url = `${this.apiUrl}/medical-conditions/${userId}`;
    return this.http.patch<MedicalRecord>(
      url,
      { medicalConditions },
      httpOptions
    );
  }

  searchMedicalRecords(code?: string, designation?: string): Observable<HttpResponse<MedicalRecord[]>> {
    let query = '?';
    if (code) query += `code=${encodeURIComponent(code)}&`;
    if (designation) query += `designation=${encodeURIComponent(designation)}&`;

    const theUrl = `${this.apiUrl}/condition-search${query.slice(0, -1)}`; // Remove the "&" extra at the end
    return this.http.get<MedicalRecord[]>(theUrl, { observe: 'response' });
  }

  getMedicalRecordByUserId(userId: string): Observable<MedicalRecord> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<MedicalRecordResponse>(url, httpOptions).pipe(
      tap(response => {
        console.log('Medical Record Response:', response);
      }),
      map(response => response as MedicalRecord),
      catchError(error => {
        console.error('Error fetching medical record:', error);
        throw error;
      })
    );
  }

  downloadMedicalRecord(userId: string): Observable<any> {
    return forkJoin({
      medical: this.getMedicalRecordByUserId(userId),

    }).pipe(
      map(({ medical}) => {
        const content = this.formatFullMedicalRecord(medical);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medical_record_${userId}_full.txt`;
        link.click();
        window.URL.revokeObjectURL(url);
        return { medical};
      })
    );
  }

  private formatFullMedicalRecord(
    medical: MedicalRecord,
    account?: PatientAccount | null,
    profile?: PatientProfile | null
  ): string {
    let content = '=== COMPLETE MEDICAL RECORD ===\n\n';

    if (account) {
      // Add debug logging
      console.log('Account data:', account);
      
      // Access the nested data property
      const accountData = account.data || account;
      
      content += '=== ACCOUNT INFORMATION ===\n';
      content += `Profile ID: ${accountData.profileId || 'N/A'}\n`;
      content += `Name: ${accountData.name.fullName || 'N/A'}\n`;
      content += `Email: ${accountData.contactInfo.email || 'N/A'}\n`;
      content += `Phone: ${accountData.contactInfo.phoneNumber || 'N/A'}\n`;
      content += '\n';
    } else {
      console.log('No account data available');
    }

    if (profile) {
      // Add debug logging
      console.log('Profile data:', profile);

      content += '=== PROFILE INFORMATION ===\n';
      content += `Medical Record #: ${profile.medicalRecordNum}\n`;
      content += `Name: ${profile.fullName}\n`;
      content += `Email: ${profile.email}\n`;
      content += `Phone: ${profile.phoneNumber}\n`;
      content += `Gender: ${profile.gender}\n`;
      content += `Birth: ${profile.birth}\n`;
      content += `Emergency Contact: ${profile.emergencyContact}\n\n`;
    }

    content += '=== MEDICAL RECORD DETAILS ===\n';
    content += this.formatMedicalRecord(medical);

    return content;
  }

  private formatMedicalRecord(record: MedicalRecord): string {
    return `Medical Record
User ID: ${record.userId}

Medical Conditions:
${(record.medicalConditions || []).map(mc => 
  `- ${mc.designation || 'N/A'}
   Code: ${mc.code || 'N/A'}
   Description: ${mc.description || 'N/A'}
   Common Symptoms: ${(mc.commonSymptoms || []).join(', ') || 'None'}`
).join('\n\n')}

Allergies:
${(record.allergies || []).map(a => 
  `- ${a.designation || 'N/A'}
   Code: ${a.code || 'N/A'}
   Description: ${a.description || 'N/A'}`
).join('\n\n')}
`;
  }

// Methods for managing freetext entries
addFreeText(userId: string, text: string): Observable<void> {
  const url = `${this.apiUrl}/freetext?userId=${userId}`;
  return this.http.put<void>(url, { text }, httpOptions);
}

updateFreeText(userId: string, oldText: string, newText: string): Observable<void> {
  const url = `${this.apiUrl}/freetext?userId=${userId}`;
  return this.http.patch<void>(url, { oldText, newText }, httpOptions);
}
}