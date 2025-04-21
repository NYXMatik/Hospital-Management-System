import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Allergy } from '../models/allergy';
import { MedicalRecord } from '../models/medical-record.model';
import { AllergyService } from './allergy.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordAllergyService {
  constructor(
    private http: HttpClient,
    @Inject('MEDICAL_RECORDS_API_URL') private apiUrl: string,
    private allergyService: AllergyService
  ) {}

  private refreshListSource = new Subject<void>();
  refreshList$ = this.refreshListSource.asObservable();


  public allergyUpdatedSource = new Subject<void>();
  allergyUpdated$ = this.allergyUpdatedSource.asObservable();

  // Get allergies list from allergy service
  getAllergies(): Observable<HttpResponse<Allergy[]>> {
    return this.allergyService.filterAllergies();
  }

  // Update allergies in medical record
  updateAllergies(userId: string, allergies: string[]): Observable<MedicalRecord> {
    const url = `http://localhost:5005/api/MedicalRecordAllergy/allergies`;
    const payload = { 
      allergies: allergies.map(code => code.trim())
    };
    tap(() => this.refreshListSource.next())
    return this.http.patch<MedicalRecord>(
      `${url}?userId=${encodeURIComponent(userId)}`,
      payload,
      {
        ...httpOptions,
        observe: 'body',
        responseType: 'json'
      }
    );
  }

  // Update a specific allergy in medical record
  updateAllergy(userId: string, allergy: Allergy): Observable<MedicalRecord> {
    // http://localhost:5005/api/MedicalRecordAllergy/allergies?userId=
    const url = `http://localhost:5005/api/MedicalRecordAllergy/allergies?userId=${encodeURIComponent(userId)}`;

    // print the body of the request
    console.log('Updating allergy: ',
      JSON.stringify(allergy, null, 2)
    );
    tap(() => this.refreshListSource.next())
    return this.http.put<MedicalRecord>(
      url,
      allergy,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        observe: 'body',
        responseType: 'json'
      }
      
    );
  }
}