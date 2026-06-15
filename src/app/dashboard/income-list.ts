import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeService } from '../services/income.service';
import { IncomeRecord } from '../models/income-record.model';

@Component({
  selector: 'app-income-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow-sm rounded-xl overflow-hidden border">
      <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
        <h2 class="font-bold text-slate-800">Income History</h2>
        <button class="text-blue-600 hover:text-blue-800 text-sm font-semibold">View All</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">งวดเดือน/ประเภท</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">วันที่จ่าย</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">รายรับ (Gross)</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">รายการหัก</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">รายได้สุทธิ (Net)</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            @for (record of records(); track record.id) {
              <tr class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-slate-900">{{ record.periodMonth }} (งวดที่ {{ record.installment }})</div>
                  <div class="text-xs text-slate-500">{{ record.incomeType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{{ record.paymentDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ record.grossIncome | currency:'THB':'symbol':'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div class="text-[10px] text-red-500" *ngIf="record.taxDeduction">ภาษี: {{ record.taxDeduction | currency:'THB':'symbol':'1.0-0' }}</div>
                  <div class="text-[10px] text-orange-500" *ngIf="record.socialSecurity">ปค.: {{ record.socialSecurity | currency:'THB':'symbol':'1.0-0' }}</div>
                  <div class="text-[10px] text-gray-500" *ngIf="record.otherDeductions">อื่นๆ: {{ record.otherDeductions | currency:'THB':'symbol':'1.0-0' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                  {{ record.netIncome | currency:'THB':'symbol':'1.2-2' }}
                </td>
              </tr>
            }
            @if (records().length === 0) {
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <p class="text-gray-500 font-medium">No records found</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class IncomeListComponent implements OnInit {
  records = signal<IncomeRecord[]>([]);

  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.incomeService.getIncomeRecords().subscribe({
      next: (data) => this.records.set(data),
      error: (err) => console.error('Error fetching records', err)
    });
  }
}
