import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employment } from '../models/employment.model';

@Injectable({
  providedIn: 'root'
})
export class EmploymentService {
  private apiUrl = '/api/employments';

  constructor(private http: HttpClient) {}

  getEmployments(): Observable<Employment[]> {
    return this.http.get<Employment[]>(this.apiUrl);
  }

  createEmployment(employment: Employment): Observable<Employment> {
    return this.http.post<Employment>(this.apiUrl, employment);
  }

  updateEmployment(id: string, employment: Employment): Observable<Employment> {
    return this.http.put<Employment>(`${this.apiUrl}/${id}`, employment);
  }

  deleteEmployment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
