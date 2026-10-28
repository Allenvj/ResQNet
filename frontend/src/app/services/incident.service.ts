import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly apiUrl = 'http://localhost:8081/api/v1/incidents';
  private token = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzkzMTk0NjIzLCJleHAiOjE3OTMxOTU1MjN9.BJLr3-qNR3D0kIQib_hHUpOP_7kv7_l3GMhcXa0Xqa_Cd4dbG-9lO1IpUerKPjvT';

  constructor(private http: HttpClient) {}

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
    });
  }

  reportIncident(incident: Partial<Incident> | any): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incident, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
    });
  }
}
