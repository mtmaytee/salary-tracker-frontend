import { Component, Output, EventEmitter, OnInit, signal, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from '../services/income.service';
import { CompanyService } from '../services/company.service';
import { IncomeRecord } from '../models/income-record.model';
import { Company } from '../models/company.model';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white overflow-hidden">
      <div class="px-6 py-4 bg-gray-50/50 border-b flex justify-between items-center">
        <h2 class="font-bold text-slate-800">{{ isEditMode ? 'แก้ไขข้อมูลรายได้' : 'บันทึกรายได้ใหม่' }}</h2>
        <button type="button" (click)="onAddCompany()" 
                class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
          + เพิ่มบริษัท
        </button>
      </div>
      <div class="p-6">
        <form (ngSubmit)="onSubmit(incomeForm)" #incomeForm="ngForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">บริษัท</label>
            <select name="companyId" [(ngModel)]="model.companyId" required
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
              <option value="" disabled selected>เลือกบริษัท...</option>
              <option *ngFor="let company of companies()" [value]="company.id">{{ company.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ประเภทรายได้</label>
            <select name="incomeType" [(ngModel)]="model.incomeType" required
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
              <option value="SALARY">SALARY (เงินเดือน)</option>
              <option value="FREELANCE">FREELANCE (รับจ้างอิสระ)</option>
              <option value="BONUS">BONUS (โบนัส)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">สถานะการจ่ายเงิน</label>
            <select name="paymentStatus" [(ngModel)]="model.paymentStatus" required
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-blue-50/50">
              <option value="PAID">PAID (ได้รับเงินแล้ว)</option>
              <option value="PENDING">PENDING (ค้างจ่าย/ตั้งหนี้)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">งวดเดือน (YYYY-MM)</label>
            <input type="month" name="periodMonth" [(ngModel)]="model.periodMonth" required
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">วันกำหนดจ่าย (Due Date)</label>
            <input type="date" name="dueDate" [(ngModel)]="model.dueDate"
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            <p class="text-[10px] text-slate-400 mt-1">* หากไม่ระบุ ระบบจะใช้ค่าเริ่มต้นจากสัญญาจ้าง</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">รายรับรวม (Gross)</label>
            <input type="number" name="grossIncome" [(ngModel)]="model.grossIncome" required
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                   placeholder="0.00">
          </div>
          
          @if (model.paymentStatus !== 'PENDING') {
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">วันที่จ่าย</label>
              <input type="date" name="paymentDate" [(ngModel)]="model.paymentDate"
                     class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            </div>
          }
        </div>
        
        @if (model.paymentStatus !== 'PENDING') {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">งวดที่</label>
              <input type="number" name="installment" [(ngModel)]="model.installment" min="1"
                     class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            </div>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ภาษีหัก ณ ที่จ่าย</label>
            <input type="number" name="taxDeduction" [(ngModel)]="model.taxDeduction"
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                   placeholder="0.00">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ประกันสังคม</label>
            <input type="number" name="socialSecurity" [(ngModel)]="model.socialSecurity"
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                   placeholder="0.00">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ยอดหักอื่นๆ</label>
            <input type="number" name="otherDeductions" [(ngModel)]="model.otherDeductions"
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                   placeholder="0.00">
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <span class="text-sm font-bold text-blue-800">รายได้สุทธิโดยประมาณ (Net Estimate)</span>
          <span class="text-xl font-black text-blue-700">{{ calculateNet() | currency:'THB':'':'1.2-2' }}</span>
        </div>
        
          <div class="pt-2 flex gap-3">
            @if (isEditMode) {
              <button type="button" (click)="onCancel()"
                      class="w-1/3 flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition duration-200 uppercase tracking-wider">
                ยกเลิก
              </button>
            }
            <button type="submit" [disabled]="!incomeForm.form.valid || isLoading()"
                    class="flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 transition duration-200 uppercase tracking-wider">
              @if (isLoading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังดำเนินการ...
              } @else {
                {{ isEditMode ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddIncomeComponent implements OnInit, OnChanges {
  @Output() recordAdded = new EventEmitter<string>(); // Emit the month string
  @Input() editRecord: IncomeRecord | null = null; // รับข้อมูลมาเพื่อแก้ไข
  @Output() cancelEdit = new EventEmitter<void>();

  companies = signal<Company[]>([]);
  isLoading = signal(false);
  
  model: IncomeRecord = this.getInitialModel();
  isEditMode = false;

  constructor(
    private incomeService: IncomeService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  // ดักจับเมื่อมีการส่ง editRecord เข้ามา
  ngOnChanges(): void {
    if (this.editRecord) {
      // Robustly extract companyId (checking for direct ID or nested company object)
      const rawRecord = this.editRecord as any;
      const targetCompanyId = rawRecord.companyId || rawRecord.company?.id;
      
      this.model = { 
        ...this.editRecord,
        companyId: targetCompanyId ? String(targetCompanyId) : ''
      }; 
      this.isEditMode = true;
    } else {
      this.resetForm();
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => this.companies.set(data),
      error: (err) => console.error('Error loading companies', err)
    });
  }

  onSubmit(form: any): void {
    const savedMonth = this.model.periodMonth;
    // Calculate netIncome before saving
    this.model.netIncome = this.calculateNet();
    
    this.isLoading.set(true);
    
    if (this.isEditMode && this.model.id) {
      this.incomeService.updateIncomeRecord(this.model.id, this.model).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.recordAdded.emit(savedMonth);
          this.resetForm(form);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error updating record', err);
        }
      });
    } else {
      this.incomeService.addIncomeRecord(this.model).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.recordAdded.emit(savedMonth);
          this.resetForm(form);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error adding record', err);
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelEdit.emit();
  }

  onAddCompany(): void {
    this.router.navigate(['/companies']);
  }

  calculateNet(): number {
    return (Number(this.model.grossIncome) || 0) - 
           (Number(this.model.taxDeduction) || 0) - 
           (Number(this.model.socialSecurity) || 0) - 
           (Number(this.model.otherDeductions) || 0);
  }

  private resetForm(form?: any): void {
    this.model = this.getInitialModel();
    this.isEditMode = false;
    this.editRecord = null;
    if (form) {
      form.resetForm(this.model);
    }
  }

  private getInitialModel(): IncomeRecord {
    const today = new Date();
    const month = today.toISOString().substring(0, 7);
    const date = today.toISOString().split('T')[0];
    
    return {
      companyId: '',
      incomeType: 'SALARY',
      periodMonth: month,
      installment: 1,
      grossIncome: 0,
      taxDeduction: 0,
      socialSecurity: 0,
      otherDeductions: 0,
      paymentDate: date,
      paymentStatus: 'PAID'
    };
  }
}
