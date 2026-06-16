import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EmploymentService } from '../services/employment.service';
import { CompanyService } from '../services/company.service';
import { TaxService } from '../services/tax.service';
import { Employment } from '../models/employment.model';
import { Company } from '../models/company.model';

@Component({
  selector: 'app-employment-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-800">จัดการสัญญาจ้าง</h1>
        <button (click)="openAddForm()" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition flex items-center gap-2">
          + เพิ่มสัญญาจ้าง
        </button>
      </div>

      <!-- รายการสัญญาจ้าง -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        @if (isLoading() && !showForm()) {
          <div class="col-span-full py-20 flex flex-col items-center justify-center gap-3">
            <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-medium text-slate-500">กำลังโหลดข้อมูลสัญญาจ้าง...</span>
          </div>
        } @else {
          @for (emp of employments(); track emp.id) {
            <!-- ... existing employment card ... -->
            <div class="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-bold text-slate-800">{{ emp.companyName || 'ไม่ระบุบริษัท' }}</h3>
                  <span class="text-xs text-slate-400">ID: {{ emp.id }}</span>
                </div>
                <div class="flex gap-1">
                  <button (click)="onEdit(emp)" class="text-blue-400 hover:text-blue-600 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button (click)="onDelete(emp.id!)" class="text-red-400 hover:text-red-600 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">เงินเดือนพื้นฐาน:</span>
                  <span class="font-bold text-slate-700">{{ emp.baseSalary | currency:'THB':'':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-slate-500">ประกันสังคม:</span>
                  <span class="text-orange-600">{{ emp.expectedSso | currency:'THB':'':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-slate-500">ภาษีโดยประมาณ:</span>
                  <span class="text-red-500">{{ emp.expectedTax | currency:'THB':'':'1.2-2' }}</span>
                </div>
              </div>
            </div>
          }
          @if (employments().length === 0 && !isLoading()) {
            <div class="col-span-full py-20 text-center text-slate-400 italic">ยังไม่มีข้อมูลสัญญาจ้าง</div>
          }
        }
      </div>

      <!-- ฟอร์มเพิ่ม/แก้ไข (Overlay) -->
      @if (showForm()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            @if (isLoading()) {
              <div class="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            }
            <div class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 class="font-bold text-slate-800">ข้อมูลสัญญาจ้าง</h2>
              <button (click)="showForm.set(false)" class="text-slate-400 hover:text-slate-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form (ngSubmit)="onSubmit()" class="p-6 space-y-4">
              <!-- ... existing form fields ... -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">บริษัท</label>
                <select [(ngModel)]="model.companyId" name="companyId" required
                        class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="" disabled>เลือกบริษัท...</option>
                  @for (c of companies(); track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">เงินเดือนตามสัญญา (Base Salary)</label>
                <input type="number" [(ngModel)]="model.baseSalary" name="baseSalary" required (input)="triggerCalculation()"
                       class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">วันกำหนดจ่ายเงินเดือน (1-31)</label>
                <input type="number" [(ngModel)]="model.salaryPaymentDay" name="salaryPaymentDay" min="1" max="31"
                       class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="ระบุวันที่ 1-31">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">ประกันสังคม</label>
                  <input type="number" [(ngModel)]="model.expectedSso" name="expectedSso"
                         class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">ภาษี</label>
                  <div class="relative">
                    <input type="number" [(ngModel)]="model.expectedTax" name="expectedTax"
                           class="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none pr-12">
                    @if (isCalculating()) {
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 font-bold animate-pulse">AUTO</span>
                    }
                  </div>
                </div>
              </div>
              <div class="pt-4">
                <button type="submit" [disabled]="isLoading()"
                        class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  @if (isLoading()) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังบันทึก...
                  } @else {
                    บันทึกสัญญาจ้าง
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class EmploymentManagementComponent implements OnInit {
  employments = signal<Employment[]>([]);
  companies = signal<Company[]>([]);
  showForm = signal(false);
  isCalculating = signal(false);
  isLoading = signal(false);
  
  model: Employment = this.getEmptyModel();

  constructor(
    private employmentService: EmploymentService,
    private companyService: CompanyService,
    private taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  triggerCalculation(): void {
    if (this.model.baseSalary && this.model.baseSalary > 0) {
      this.isCalculating.set(true);
      this.taxService.calculateTax(this.model.baseSalary).subscribe({
        next: (res) => {
          this.model.expectedTax = res.monthlyWithholdingTax;
          // Standard SSO is usually 5% up to 750
          this.model.expectedSso = Math.min(this.model.baseSalary * 0.05, 750);
          this.isCalculating.set(false);
        },
        error: () => this.isCalculating.set(false)
      });
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    forkJoin({
      employments: this.employmentService.getEmployments(),
      companies: this.companyService.getCompanies()
    }).subscribe({
      next: (res: any) => {
        // Handle potential wrapped responses (e.g., { data: [...] })
        const companiesList = Array.isArray(res.companies) ? res.companies : (res.companies.data || []);
        const employmentsList = Array.isArray(res.employments) ? res.employments : (res.employments.data || []);
        
        this.companies.set(companiesList);
        
        const mapped = employmentsList.map((emp: any) => {
          // Find company by ID, checking both direct companyId and nested company object
          const targetId = emp.companyId || emp.company?.id;
          const company = companiesList.find((c: any) => String(c.id) === String(targetId));
          
          return {
            ...emp,
            companyId: targetId ? String(targetId) : '',
            companyName: company?.name || emp.company?.name || 'ไม่ระบุบริษัท'
          };
        });
        
        this.employments.set(mapped);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading employment data', err);
        this.isLoading.set(false);
      }
    });
  }

  openAddForm(): void {
    this.model = this.getEmptyModel();
    this.showForm.set(true);
  }

  onEdit(emp: Employment): void {
    this.model = { ...emp };
    this.showForm.set(true);
  }

  onSubmit(): void {
    this.isLoading.set(true);
    const action = this.model.id 
      ? this.employmentService.updateEmployment(this.model.id, this.model)
      : this.employmentService.createEmployment(this.model);

    action.subscribe({
      next: () => {
        this.loadData();
        this.showForm.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error saving employment', err);
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('ยืนยันการลบสัญญาจ้างนี้?')) {
      this.isLoading.set(true);
      this.employmentService.deleteEmployment(id).subscribe({
        next: () => this.loadData(),
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error deleting employment', err);
        }
      });
    }
  }

  private getEmptyModel(): Employment {
    return { companyId: '', baseSalary: 0, expectedSso: 0, expectedTax: 0, salaryPaymentDay: 31 };
  }
}
