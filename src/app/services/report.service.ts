import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDefinition } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = '/api/reports';

  constructor(private http: HttpClient) {}

  /**
   * ดึงรายชื่อรายงานทั้งหมดสำหรับผู้ใช้ทั่วไป
   */
  getReportsList(): Observable<ReportDefinition[]> {
    return this.http.get<ReportDefinition[]>(`${this.apiUrl}/list`);
  }

  /**
   * ดาวน์โหลดรายงานในรูปแบบ PDF
   * @param reportCode รหัสรายงาน (เช่น MONTHLY_SALARY)
   * @param params parameter เพิ่มเติมที่ต้องการส่งไปให้รายงาน
   */
  downloadReport(reportCode: string, params: any = {}): void {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    this.http.get(`${this.apiUrl}/${reportCode}`, {
      params: httpParams,
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading report:', err);
        alert('เกิดข้อผิดพลาดในการดาวน์โหลดรายงาน');
      }
    });
  }
}
