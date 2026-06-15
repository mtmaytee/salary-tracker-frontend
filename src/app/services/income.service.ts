import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomeRecord } from '../models/income-record.model';
import { MonthlySummary } from '../models/monthly-summary.model';
import { InterestCalculationResponse } from '../models/interest-calculation.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl = '/api/income-records';
  private interestApiUrl = '/api/interest';

  constructor(private http: HttpClient) {}

  getIncomeRecords(month?: string): Observable<IncomeRecord[]> {
    let params = new HttpParams();
    if (month) {
      params = params.set('month', month);
    }
    return this.http.get<IncomeRecord[]>(this.apiUrl, { params });
  }

  getMonthlySummary(): Observable<MonthlySummary[]> {
    return this.http.get<MonthlySummary[]>(`${this.apiUrl}/summary`);
  }

  addIncomeRecord(record: IncomeRecord): Observable<IncomeRecord> {
    return this.http.post<IncomeRecord>(this.apiUrl, record);
  }

  updateIncomeRecord(id: string, record: IncomeRecord): Observable<IncomeRecord> {
    return this.http.put<IncomeRecord>(`${this.apiUrl}/${id}`, record);
  }

  deleteIncomeRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  calculateInterest(id: string): Observable<InterestCalculationResponse> {
    return this.http.get<InterestCalculationResponse>(`${this.interestApiUrl}/calculate/${id}`);
  }
}
