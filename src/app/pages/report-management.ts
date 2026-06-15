import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { LanguageService } from '../services/language.service';
import { ReportDefinition } from '../models/report.model';

@Component({
  selector: 'app-report-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ langService.translate('report_management') }}</h1>
          <p class="text-gray-500 text-sm">จัดการไฟล์รายงาน (JasperReports) และ Metadata</p>
        </div>
        <button (click)="openUploadModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition">
          + อัปโหลดรายงาน
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">รหัสรายงาน (Code)</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ชื่อรายงาน</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ไฟล์</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (report of reports(); track report.id) {
                <tr class="hover:bg-gray-50/50 transition">
                  <td class="px-6 py-4">
                    <span class="font-bold text-slate-700">{{ report.reportCode }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-slate-900">{{ report.name }}</div>
                    <div class="text-xs text-slate-500">{{ report.description || '-' }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{{ report.category }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ report.fileName }}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="deleteReport(report.id!)" class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </td>
                </tr>
              }
              @if (reports().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-500">ไม่พบข้อมูลรายงานในระบบ</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Upload Modal -->
      @if (showUploadModal()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="px-6 py-4 border-b flex justify-between items-center">
              <h3 class="font-bold text-lg text-slate-800">อัปโหลดรายงานใหม่ (.jasper)</h3>
              <button (click)="closeUploadModal()" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-6">
              <form (ngSubmit)="onUpload()" #uploadForm="ngForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">รหัสรายงาน (Report Code) *</label>
                  <input type="text" name="reportCode" [(ngModel)]="uploadData.reportCode" required
                         placeholder="เช่น MONTHLY_SALARY"
                         class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อรายงาน *</label>
                  <input type="text" name="name" [(ngModel)]="uploadData.name" required
                         class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่ (Category) *</label>
                  <select name="category" [(ngModel)]="uploadData.category" required
                          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="INCOME">INCOME (รายได้)</option>
                    <option value="SALARY">SALARY (เงินเดือน)</option>
                    <option value="TAX">TAX (ภาษี)</option>
                    <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">คำอธิบาย</label>
                  <textarea name="description" [(ngModel)]="uploadData.description" rows="2"
                            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">ไฟล์ .jasper *</label>
                  <input type="file" accept=".jasper" (change)="onFileSelected($event)" required
                         class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
                </div>
                
                <div class="mt-6 flex justify-end gap-3 pt-4 border-t">
                  <button type="button" (click)="closeUploadModal()" class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">ยกเลิก</button>
                  <button type="submit" [disabled]="!uploadForm.form.valid || !selectedFile || isUploading()"
                          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50">
                    {{ isUploading() ? 'กำลังอัปโหลด...' : 'บันทึก' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ReportManagementComponent implements OnInit {
  adminService = inject(AdminService);
  langService = inject(LanguageService);
  
  reports = signal<ReportDefinition[]>([]);
  showUploadModal = signal(false);
  isUploading = signal(false);
  
  selectedFile: File | null = null;
  uploadData = {
    reportCode: '',
    name: '',
    category: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.adminService.getAllReports().subscribe({
      next: (data) => this.reports.set(data),
      error: (err) => console.error('Error loading reports:', err)
    });
  }

  openUploadModal(): void {
    this.uploadData = { reportCode: '', name: '', category: '', description: '' };
    this.selectedFile = null;
    this.showUploadModal.set(true);
  }

  closeUploadModal(): void {
    this.showUploadModal.set(false);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.jasper')) {
      this.selectedFile = file;
    } else {
      alert('กรุณาเลือกไฟล์นามสกุล .jasper เท่านั้น');
      this.selectedFile = null;
      event.target.value = '';
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('reportCode', this.uploadData.reportCode);
    formData.append('name', this.uploadData.name);
    formData.append('category', this.uploadData.category);
    if (this.uploadData.description) {
      formData.append('description', this.uploadData.description);
    }

    this.adminService.uploadReport(formData).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.closeUploadModal();
        this.loadReports();
      },
      error: (err) => {
        this.isUploading.set(false);
        alert('เกิดข้อผิดพลาดในการอัปโหลดรายงาน');
        console.error(err);
      }
    });
  }

  deleteReport(id: string): void {
    if (confirm('คุณต้องการลบรายงานนี้ใช่หรือไม่? ไฟล์และข้อมูลจะถูกลบออกจากระบบ')) {
      this.adminService.deleteReport(id).subscribe({
        next: () => this.loadReports(),
        error: (err) => {
          alert('เกิดข้อผิดพลาดในการลบรายงาน');
          console.error(err);
        }
      });
    }
  }
}
