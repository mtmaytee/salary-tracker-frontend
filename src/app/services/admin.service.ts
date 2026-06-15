import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ReportDefinition } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  /**
   * ดึงรายชื่อผู้ใช้ทั้งหมด
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * เปลี่ยนสิทธิ์ผู้ใช้
   * @param userId ID ของผู้ใช้
   * @param role Role ใหม่ (ROLE_USER, ROLE_ADMIN)
   */
  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, null, {
      params: { role }
    });
  }

  /**
   * เปิด/ปิด การใช้งานบัญชีผู้ใช้
   * @param userId ID ของผู้ใช้
   * @param active สถานะที่ต้องการตั้ง (true = active, false = inactive)
   */
  updateUserStatus(userId: string, active: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/status`, null, {
      params: { active: active.toString() }
    });
  }

  /**
   * ดึงรายชื่อรายงานทั้งหมด (Admin)
   */
  getAllReports(): Observable<ReportDefinition[]> {
    return this.http.get<ReportDefinition[]>(`${this.apiUrl}/reports`);
  }

  /**
   * อัปโหลด/เพิ่มรายงานใหม่
   */
  uploadReport(formData: FormData): Observable<ReportDefinition> {
    return this.http.post<ReportDefinition>(`${this.apiUrl}/reports/upload`, formData);
  }

  /**
   * ลบรายงาน
   */
  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${id}`);
  }
}
