import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Allergy } from '../models/allergy';
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
export class AllergyService {

  constructor(private http: HttpClient,
    @Inject('ALLERGY_API_URL') private apiUrl: string) { }

  public allergyUpdatedSource = new Subject<void>(); // Subject to emit updating event
  allergyUpdated$ = this.allergyUpdatedSource.asObservable();

  createAllergy(allergy: Allergy): Observable<Allergy> {
    return this.http.post<Allergy>(this.apiUrl, allergy, httpOptions);
  }

  filterAllergies(code?: string, designation?: string): Observable<HttpResponse<Allergy[]>> {
    let query = '?';
    if (code) query += `code=${encodeURIComponent(code)}&`;
    if (designation) query += `designation=${encodeURIComponent(designation)}&`;

    const theUrl = `${this.apiUrl}${query.slice(0, -1)}`; // Remove the "&" extra at the end
    return this.http.get<Allergy[]>(theUrl, { observe: 'response' });
  }

  updateAllergy(allergy: Allergy): Observable<Allergy> {
    const theUrl = `${this.apiUrl}/${allergy.code}`;

    return this.http.patch<Allergy>(
      theUrl,
      allergy,
      httpOptions
    );
  }



}
