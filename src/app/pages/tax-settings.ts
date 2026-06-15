import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxService } from '../services/tax.service';
import { TaxMasterData, TaxBracket } from '../models/tax.model';
import { TaxBracketFormComponent } from './tax-bracket-form';

@Component({
  selector: 'app-tax-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TaxBracketFormComponent],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Master Setting: กฎการคำนวณภาษี</h1>
          <p class="text-slate-500 text-sm mt-1">ตั้งค่าค่าลดหย่อนและขั้นบันไดภาษีสำหรับระบบคำนวณเงินเดือนอัตโนมัติ</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Master Data Section -->
        <div class="lg:col-span-12">
          <div class="bg-white shadow-sm rounded-xl border overflow-hidden">
            <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
              <h2 class="font-bold text-slate-800">ค่าลดหย่อนมาตรฐาน (Master Data)</h2>
              @if (masterData()) {
                <span class="px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase tracking-wider">ACTIVE</span>
              }
            </div>
            <div class="p-6">
              @if (masterData(); as master) {
                <form (ngSubmit)="saveMasterData()" #masterForm="ngForm" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ค่าใช้จ่ายส่วนตัวสูงสุด (Personal Expenses)</label>
                    <input type="number" name="maxPersonalExpenses" [(ngModel)]="master.maxPersonalExpenses" required
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ลดหย่อนส่วนตัว (Personal Allowance)</label>
                    <input type="number" name="personalAllowance" [(ngModel)]="master.personalAllowance" required
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">เพดานประกันสังคม (Max Social Security)</label>
                    <input type="number" name="maxSocialSecurity" [(ngModel)]="master.maxSocialSecurity" required
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                  <div class="md:col-span-3 flex justify-end pt-2">
                    <button type="submit" [disabled]="!masterForm.form.valid"
                            class="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition duration-200 text-xs uppercase tracking-widest">
                      บันทึกการตั้งค่าหลัก
                    </button>
                  </div>
                </form>
              } @else {
                <div class="py-10 text-center text-slate-400">Loading master data...</div>
              }
            </div>
          </div>
        </div>

        <!-- Brackets Table Section -->
        <div [class]="showBracketForm() ? 'lg:col-span-7' : 'lg:col-span-12'" class="transition-all duration-300">
          <div class="bg-white shadow-sm rounded-xl overflow-hidden border">
            <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
              <h2 class="font-bold text-slate-800">ตารางขั้นบันไดภาษี (Tax Brackets)</h2>
              <button (click)="openCreateBracket()" 
                      class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
                + เพิ่มขั้นบันได
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50/50">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ลำดับ</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ช่วงรายได้</th>
                    <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">อัตราภาษี (%)</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  @for (bracket of brackets(); track bracket.id) {
                    <tr class="hover:bg-gray-50 transition duration-150">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">#{{ bracket.sequence }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                        {{ bracket.minIncome | number }} - {{ bracket.maxIncome ? (bracket.maxIncome | number) : 'ขึ้นไป' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">
                        {{ bracket.taxRate | number:'1.2-2' }}%
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                        <button (click)="openEditBracket(bracket)" class="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button (click)="deleteBracket(bracket.id!)" class="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                  @if (brackets().length === 0) {
                    <tr>
                      <td colspan="4" class="px-6 py-10 text-center text-slate-400 italic">No brackets defined.</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sticky Form Section -->
        @if (showBracketForm()) {
          <div class="lg:col-span-5 h-fit sticky top-8">
            <app-tax-bracket-form 
              [bracket]="selectedBracket()" 
              (onSuccess)="handleBracketSuccess()" 
              (onCancel)="closeBracketForm()">
            </app-tax-bracket-form>
          </div>
        }
      </div>
    </div>
  `
})
export class TaxSettingsComponent implements OnInit {
  masterData = signal<TaxMasterData | null>(null);
  brackets = signal<TaxBracket[]>([]);
  showBracketForm = signal<boolean>(false);
  selectedBracket = signal<TaxBracket | null>(null);

  constructor(private taxService: TaxService) {}

  ngOnInit(): void {
    this.loadMasterData();
    this.loadBrackets();
  }

  loadMasterData(): void {
    this.taxService.getMasterData().subscribe({
      next: (data) => this.masterData.set(data),
      error: (err) => console.error('Error fetching master data', err)
    });
  }

  loadBrackets(): void {
    this.taxService.getBrackets().subscribe({
      next: (data) => {
        // Sort by sequence
        this.brackets.set(data.sort((a, b) => a.sequence - b.sequence));
      },
      error: (err) => console.error('Error fetching brackets', err)
    });
  }

  saveMasterData(): void {
    const data = this.masterData();
    if (data && data.id) {
      this.taxService.updateMasterData(data.id, data).subscribe({
        next: () => alert('บันทึกค่าลดหย่อนมาตรฐานเรียบร้อยแล้ว'),
        error: (err) => alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      });
    }
  }

  openCreateBracket(): void {
    this.selectedBracket.set(null);
    this.showBracketForm.set(true);
  }

  openEditBracket(bracket: TaxBracket): void {
    this.selectedBracket.set(bracket);
    this.showBracketForm.set(true);
  }

  closeBracketForm(): void {
    this.showBracketForm.set(false);
    this.selectedBracket.set(null);
  }

  handleBracketSuccess(): void {
    this.loadBrackets();
    this.closeBracketForm();
  }

  deleteBracket(id: string): void {
    if (confirm('ยืนยันการลบขั้นบันไดภาษีนี้?')) {
      this.taxService.deleteBracket(id).subscribe({
        next: () => this.loadBrackets(),
        error: (err) => alert('ไม่สามารถลบข้อมูลได้')
      });
    }
  }
}
