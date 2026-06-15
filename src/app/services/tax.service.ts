import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxMasterData, TaxBracket, TaxCalculationResult } from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private apiUrl = '/api/tax';

  constructor(private http: HttpClient) {}

  // หมวด A: การคำนวณ
  calculateTax(salary: number): Observable<TaxCalculationResult> {
    return this.http.post<TaxCalculationResult>(`${this.apiUrl}/calculate`, { salary });
  }

  // หมวด B: จัดการกฎภาษี (Master Data)
  getMasterData(): Observable<TaxMasterData> {
    return this.http.get<TaxMasterData>(`${this.apiUrl}/master-data`);
  }

  updateMasterData(id: string, data: TaxMasterData): Observable<TaxMasterData> {
    return this.http.put<TaxMasterData>(`${this.apiUrl}/master-data/${id}`, data);
  }

  // หมวด B: จัดการขั้นบันไดภาษี (Brackets)
  getBrackets(): Observable<TaxBracket[]> {
    return this.http.get<TaxBracket[]>(`${this.apiUrl}/brackets`);
  }

  addBracket(bracket: TaxBracket): Observable<TaxBracket> {
    return this.http.post<TaxBracket>(`${this.apiUrl}/brackets`, bracket);
  }

  updateBracket(id: string, bracket: TaxBracket): Observable<TaxBracket> {
    return this.http.put<TaxBracket>(`${this.apiUrl}/brackets/${id}`, bracket);
  }

  deleteBracket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/brackets/${id}`);
  }
}
