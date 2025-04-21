import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// In your Angular service:
@Injectable({
    providedIn: 'root'
  })
  export class SchedulerService {
    private baseUrl = 'http://localhost:8000/api';
  
    constructor(private http: HttpClient) {}
  
    getOccupancySchedule(): Observable<any> {
      return this.http.get(`${this.baseUrl}/schedule/occupancy`);
    }
  
    getNormalSchedule(): Observable<any> {
      return this.http.get(`${this.baseUrl}/schedule/normal`);
    }

  }