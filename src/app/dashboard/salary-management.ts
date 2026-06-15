import { Component, ViewChild, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddIncomeComponent } from './add-income';
import { IncomeService } from '../services/income.service';
import { IncomeRecord } from '../models/income-record.model';
import { InterestCalculationResponse, InterestInterval } from '../models/interest-calculation.model';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-salary-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AddIncomeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-800">{{ langService.translate('salary_management_title') }}</h1>
        <div class="flex gap-2">
          <button (click)="openAddForm()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition flex items-center gap-2">
            + บันทึกรายได้ใหม่
          </button>
          <input type="month" [(ngModel)]="selectedMonth" (change)="onMonthChange()"
                 class="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      <!-- ส่วนที่ 1: ตารางแสดงรายการของเดือนนั้นๆ -->
      <div class="bg-white shadow-sm rounded-xl overflow-hidden border">
        <!-- ... (existing table header) ... -->
        <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
          <h2 class="font-bold text-slate-800 text-sm">{{ langService.translate('monthly_records_for') }} {{ selectedMonth }}</h2>
          <span class="text-xs font-medium text-slate-500">{{ currentMonthRecords().length }} {{ langService.translate('items') }}</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- (table content was updated in previous replace) -->
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('income_type') }}</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('due_paid_date') }}</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('status_interest') }}</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('gross_income') }}</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('net_income') }}</th>
                <th class="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('delete') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              @for (record of currentMonthRecords(); track record.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <span class="font-medium">{{ record.incomeType }}</span>
                    @if (record.paymentStatus !== 'PENDING') {
                      <span class="text-xs text-slate-400 ml-1">(งวดที่ {{ record.installment }})</span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-[10px] text-slate-400 uppercase font-bold">Due: {{ record.dueDate || '-' }}</div>
                    <div class="text-sm text-slate-600 font-medium">Paid: {{ record.paymentDate || '-' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="record.paymentStatus === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'"
                          class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                      {{ record.paymentStatus || 'PAID' }}
                    </span>
                    <button (click)="viewInterest(record.id!)" 
                            class="block mt-1 text-[10px] text-blue-600 hover:underline font-bold">
                      {{ langService.translate('check_interest') }}
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ record.grossIncome | currency:'THB':'':'1.2-2' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{{ record.netIncome | currency:'THB':'':'1.2-2' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="onEdit(record)" class="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      {{ langService.translate('edit') }}
                    </button>
                    <button (click)="onDelete(record.id!)" class="text-red-600 hover:text-red-900 inline-flex items-center gap-1 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      {{ langService.translate('delete') }}
                    </button>
                  </td>
                </tr>
              }
              @if (currentMonthRecords().length === 0) {
                <tr>
                  <td colspan="6" class="px-6 py-8 text-center text-gray-400 text-sm italic">
                    {{ langService.translate('no_records_this_month') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Interest Modal -->
      @if (selectedInterest()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-800">{{ langService.translate('interest_details') }}</h3>
                  <p class="text-xs text-slate-400">{{ langService.translate('labor_law_calc') }}</p>
                </div>
                <button (click)="selectedInterest.set(null)" class="text-slate-400 hover:text-slate-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="space-y-4 py-2">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">{{ langService.translate('principal_amount') }}:</span>
                  <span class="font-bold text-slate-800">{{ selectedInterest()?.principal | currency:'THB':'':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">{{ langService.translate('late_days') }}:</span>
                  <span class="font-bold text-orange-600">{{ selectedInterest()?.daysLate }} {{ langService.translate('days') }}</span>
                </div>
                <div class="border-t pt-4 flex justify-between items-end">
                  <div>
                    <span class="text-xs text-slate-500 block">{{ langService.translate('interest_15') }}:</span>
                    <span class="text-xl font-black text-blue-600">{{ selectedInterest()?.interestAmount | currency:'THB':'':'1.2-2' }}</span>
                  </div>
                  @if (selectedInterest()?.penaltyAmount) {
                    <div class="text-right">
                      <span class="text-[10px] text-red-500 font-bold block">{{ langService.translate('penalty_money') }}:</span>
                      <span class="text-lg font-bold text-red-600">+ {{ selectedInterest()?.penaltyAmount | currency:'THB':'':'1.2-2' }}</span>
                    </div>
                  }
                </div>
                
                <div class="bg-blue-50 p-4 rounded-xl">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-blue-800 uppercase">{{ langService.translate('total_additional_received') }}:</span>
                    <span class="text-xl font-black text-blue-700">
                      {{ (selectedInterest()!.interestAmount + (selectedInterest()?.penaltyAmount || 0)) | currency:'THB':'':'1.2-2' }}
                    </span>
                  </div>
                </div>

                <!-- Timeline of Intervals -->
                @if (selectedInterest()?.intervals && selectedInterest()!.intervals!.length > 0) {
                  <div class="mt-4 border-t pt-4">
                    <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Timeline การคำนวณ</h4>
                    <div class="space-y-3">
                      @for (item of selectedInterest()?.intervals; track $index) {
                        <div class="flex gap-3 text-[11px] border-l-2 border-blue-200 pl-3 relative">
                          <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500"></div>
                          <div class="flex-1">
                            <div class="flex justify-between font-bold text-slate-700">
                              <span>{{ item.startDate }} - {{ item.endDate }}</span>
                              <span class="text-blue-600">+ {{ item.interest | currency:'THB':'':'1.2-2' }}</span>
                            </div>
                            <div class="text-slate-400 mt-0.5">
                              เงินต้น: {{ item.principal | currency:'THB':'':'1.2-2' }} ({{ item.days }} วัน)
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <button (click)="selectedInterest.set(null)" 
                      class="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition shadow-lg">
                {{ langService.translate('close_window') }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Add/Edit Income Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative">
            <button (click)="onCancelEdit()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="max-h-[90vh] overflow-y-auto">
              <app-add-income [editRecord]="selectedRecord" (cancelEdit)="onCancelEdit()" (recordAdded)="onRecordAdded($event)"></app-add-income>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class SalaryManagementComponent implements OnInit {
  langService = inject(LanguageService);
  selectedMonth = new Date().toISOString().substring(0, 7);
  currentMonthRecords = signal<IncomeRecord[]>([]);
  selectedRecord: IncomeRecord | null = null;
  selectedInterest = signal<InterestCalculationResponse | null>(null);
  showForm = signal(false);

  @ViewChild('formSection') formSection: any;

  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.loadCurrentMonthRecords();
  }

  onMonthChange(): void {
    this.loadCurrentMonthRecords();
  }

  loadCurrentMonthRecords(): void {
    this.incomeService.getIncomeRecords(this.selectedMonth).subscribe({
      next: (data) => {
        // เรียงลำดับตาม dueDate (จากน้อยไปมาก)
        const sortedData = [...data].sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        });
        this.currentMonthRecords.set(sortedData);
      },
      error: (err) => console.error('Error loading records', err)
    });
  }

  openAddForm(): void {
    this.selectedRecord = null;
    this.showForm.set(true);
  }

  onEdit(record: IncomeRecord): void {
    this.selectedRecord = record;
    this.showForm.set(true);
  }

  viewInterest(id: string): void {
    const targetRecord = this.currentMonthRecords().find(r => r.id === id);
    if (!targetRecord) return;

    // 1. ดึงรายการทั้งหมดที่เป็นประเภทเดียวกัน ในเดือนเดียวกัน และบริษัทเดียวกัน เพื่อคำนวณลดต้นลดดอก
    const relatedRecords = this.currentMonthRecords()
      .filter(r => 
        r.companyId === targetRecord.companyId && 
        r.periodMonth === targetRecord.periodMonth && 
        r.incomeType === targetRecord.incomeType
      )
      .sort((a, b) => {
        const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : Infinity;
        const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : Infinity;
        return dateA - dateB;
      });

    // 2. เริ่มคำนวณทีละช่วง (Intervals)
    const dueDate = targetRecord.dueDate || targetRecord.paymentDate || '';
    if (!dueDate) {
      alert('ไม่สามารถคำนวณได้เนื่องจากไม่มีวันกำหนดจ่าย');
      return;
    }

    const intervals: InterestInterval[] = [];
    let currentPrincipal = relatedRecords.reduce((sum, r) => sum + (r.grossIncome || 0), 0);
    let totalInterest = 0;
    let startDate = new Date(dueDate);
    const today = new Date();
    const rate = 0.15; // 15%

    relatedRecords.forEach(record => {
      if (record.paymentStatus === 'PAID' && record.paymentDate) {
        const endDate = new Date(record.paymentDate);
        if (endDate > startDate) {
          const diffTime = endDate.getTime() - startDate.getTime();
          const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const interest = (currentPrincipal * rate * days) / 365;
          
          intervals.push({
            startDate: startDate.toISOString().split('T')[0],
            endDate: record.paymentDate,
            days,
            principal: currentPrincipal,
            interest
          });
          
          totalInterest += interest;
        }
        // ลดเงินต้นลงตามยอดที่จ่ายมาแล้ว
        currentPrincipal -= (record.grossIncome || 0);
        startDate = endDate;
      }
    });

    // 3. ช่วงสุดท้าย: ถ้ายังมีเงินต้นเหลือ (PENDING) ให้คิดถึงวันปัจจุบัน
    if (currentPrincipal > 0.01) {
      const diffTime = today.getTime() - startDate.getTime();
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (days > 0) {
        const interest = (currentPrincipal * rate * days) / 365;
        intervals.push({
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
          days,
          principal: currentPrincipal,
          interest
        });
        totalInterest += interest;
      }
    }

    // 4. แสดงผล
    this.selectedInterest.set({
      incomeRecordId: id,
      principal: currentPrincipal,
      dueDate,
      paymentDate: targetRecord.paymentDate || null,
      daysLate: intervals.reduce((sum, i) => sum + i.days, 0),
      interestRate: rate,
      interestAmount: totalInterest,
      totalAmount: currentPrincipal + totalInterest,
      status: currentPrincipal > 0.01 ? 'PENDING' : 'PAID',
      intervals: intervals
    });
  }

  onDelete(id: string): void {
    if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่? การลบไม่สามารถกู้คืนได้')) {
      this.incomeService.deleteIncomeRecord(id).subscribe({
        next: () => this.loadCurrentMonthRecords(),
        error: (err) => console.error('Error deleting record', err)
      });
    }
  }

  onCancelEdit(): void {
    this.selectedRecord = null;
    this.showForm.set(false);
  }

  onRecordAdded(month: string): void {
    this.selectedRecord = null; // Clear edit mode
    this.showForm.set(false);
    this.selectedMonth = month; 
    this.loadCurrentMonthRecords();
  }
}
