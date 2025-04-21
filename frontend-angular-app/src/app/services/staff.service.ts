import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import { Staff } from '../models/staff.model';

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
export class StaffService {

  constructor(private http: HttpClient,
    @Inject('STAFF_API_URL') private apiUrl: string) {}

  public staffUpdatedSource = new Subject<void>(); // Subject to emit event of updating
  staffUpdated$ = this.staffUpdatedSource.asObservable();

  createStaff(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(
      this.apiUrl,
      staff,
      httpOptions
    );
  }

  getStaffs(): Observable<HttpResponse<Staff[]>>{
    return this.http.get<Staff[]>(
      this.apiUrl,
      { observe: 'response' }
    );
  }

  filterStaffs(name?: string, email?: string, specialization?: string): Observable<HttpResponse<Staff[]>> {
    let query = '?';
    if (name) query += `name=${encodeURIComponent(name)}&`;
    if (email) query += `email=${encodeURIComponent(email)}&`;
    if (specialization) query += `specialization=${encodeURIComponent(specialization)}&`;

    const theUrl = `${this.apiUrl}/filter${query.slice(0, -1)}`; // Remove the "&" extra at the end
    return this.http.get<Staff[]>(theUrl, { observe: 'response' });
  }

  // Method to search by specialization
  getStaffById(id: string): Observable<HttpResponse<Staff>> {
    const theUrl = `${this.apiUrl}/${id}`;

    return this.http.get<Staff>(
      theUrl,
      { observe: 'response' }
    );
  }

  deactivateStaff(id: string): Observable<any>{
  const theUrl = `${this.apiUrl}/${id}`;

  return this.http.delete(
    theUrl,
    httpOptions
    )
  }

  updateStaff(staff: Staff): Observable<Staff> {
    const theUrl = `${this.apiUrl}/${staff.id}`;

    return this.http.put<Staff>(
      theUrl,
      staff,
      httpOptions
    );
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
