import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeService } from '../services/income.service';
import { EmploymentService } from '../services/employment.service';
import { MonthlySummary } from '../models/monthly-summary.model';
import { Employment } from '../models/employment.model';
import { LanguageService } from '../services/language.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- ข้อมูลสรุปรายเดือน -->
      <div class="bg-white shadow-sm rounded-xl overflow-hidden border">
        <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
          <h2 class="font-bold text-slate-800">{{ langService.translate('monthly_summary_title') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('month') }}</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('contract_salary') }}</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('pending_amount') }}</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{{ langService.translate('net_income') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              @for (item of summary(); track item.periodMonth) {
                <tr class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{{ item.periodMonth }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {{ totalBaseSalary() | currency:'THB':'':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold" 
                      [ngClass]="getPending(item) > 0 ? 'text-orange-500' : 'text-green-600'">
                    {{ getPending(item) | currency:'THB':'':'1.2-2' }}
                    @if (getPending(item) > 0) {
                      <span class="text-[10px] block font-normal">{{ langService.translate('pending_payment') }}</span>
                    } @else {
                      <span class="text-[10px] block font-normal">{{ langService.translate('complete_payment') }}</span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    {{ getNet(item) | currency:'THB':'':'1.2-2' }}
                  </td>
                </tr>
              }
              
              <!-- Summary Row -->
              @if (summary().length > 0) {
                <tr class="bg-slate-50 font-bold border-t-2 border-slate-200">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{{ langService.translate('total_summary') }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {{ totals().contract | currency:'THB':'':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" [ngClass]="totals().pending > 0 ? 'text-orange-600' : 'text-green-700'">
                    {{ totals().pending | currency:'THB':'':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                    {{ totals().net | currency:'THB':'':'1.2-2' }}
                  </td>
                </tr>
              }

              @if (summary().length === 0) {
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500 italic">
                    {{ langService.translate('no_data') }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class MonthlySummaryComponent implements OnInit {
  langService = inject(LanguageService);
  summary = signal<MonthlySummary[]>([]);
  employments = signal<Employment[]>([]);
  
  // คำนวณเงินเดือนรวมจากทุกสัญญาที่ Active
  totalBaseSalary = computed(() => {
    return this.employments().reduce((sum, emp) => sum + (Number(emp.baseSalary) || 0), 0);
  });

  // คำนวณยอดรวมทั้งหมด
  totals = computed(() => {
    const data = this.summary();
    const contractMonth = this.totalBaseSalary();
    
    return data.reduce((acc, item) => {
      acc.contract += contractMonth;
      acc.gross += this.getGross(item);
      acc.pending += this.getPending(item);
      acc.netAfterSSTax += this.getNetAfterSSTax(item);
      acc.net += this.getNet(item);
      return acc;
    }, { contract: 0, gross: 0, pending: 0, netAfterSSTax: 0, net: 0 });
  });

  constructor(
    private incomeService: IncomeService,
    private employmentService: EmploymentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      summary: this.incomeService.getMonthlySummary(),
      employments: this.employmentService.getEmployments()
    }).subscribe({
      next: (res: any) => {
        // Handle wrapped responses if backend uses something like { data: [...] }
        const summaryList = Array.isArray(res.summary) ? res.summary : (res.summary?.data || []);
        const employmentsList = Array.isArray(res.employments) ? res.employments : (res.employments?.data || []);

        this.summary.set(summaryList);
        this.employments.set(employmentsList);
      },
      error: (err) => console.error('Error loading summary data', err)
    });
  }

  loadSummary(): void {
    this.loadData();
  }

  getGross(item: any): number {
    return Number(item.totalGrossIncome ?? item.grossIncome ?? item.totalGross ?? 0);
  }

  getNet(item: any): number {
    return Number(item.totalNetIncome ?? item.netIncome ?? item.totalNet ?? 0);
  }

  getNetAfterSSTax(item: any): number {
    const gross = this.getGross(item);
    const tax = Number(item.totalTaxDeduction ?? item.taxDeduction ?? 0);
    const ss = Number(item.totalSocialSecurity ?? item.socialSecurity ?? 0);
    return gross - tax - ss;
  }

  getPending(item: any): number {
    const gross = this.getGross(item);
    const outstanding = this.totalBaseSalary() - gross;
    return outstanding > 0.01 ? outstanding : 0;
  }
}
