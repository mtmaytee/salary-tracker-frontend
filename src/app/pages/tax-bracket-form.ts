import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxBracket } from '../models/tax.model';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-tax-bracket-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow-xl rounded-2xl border overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      <div class="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
        <h2 class="font-bold text-slate-800">{{ bracket ? 'แก้ไขขั้นบันไดภาษี' : 'เพิ่มขั้นบันไดภาษีใหม่' }}</h2>
        <button (click)="onCancel.emit()" class="text-slate-400 hover:text-slate-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      
      <div class="p-6">
        <form #f="ngForm" (ngSubmit)="onSubmit(f)" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ลำดับ (Sequence)</label>
              <input type="number" name="sequence" [(ngModel)]="model.sequence" required
                     class="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 transition duration-200">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">อัตราภาษี (%)</label>
              <div class="relative">
                <input type="number" name="taxRate" [(ngModel)]="model.taxRate" required step="0.01"
                       class="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 transition duration-200 pr-10">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รายได้เริ่มต้น (Min Income)</label>
            <input type="number" name="minIncome" [(ngModel)]="model.minIncome" required
                   class="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 transition duration-200">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รายได้สูงสุด (Max Income)</label>
            <input type="number" name="maxIncome" [(ngModel)]="model.maxIncome"
                   placeholder="เว้นว่างไว้หากไม่มีเพดาน"
                   class="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 transition duration-200">
            <p class="text-[10px] text-slate-400 mt-1">* ขั้นสุดท้ายให้เว้นว่างช่องรายได้สูงสุดไว้</p>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" (click)="onCancel.emit()"
                    class="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-gray-50 transition duration-200 uppercase tracking-widest">
              ยกเลิก
            </button>
            <button type="submit" [disabled]="!f.valid"
                    class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition duration-200 uppercase tracking-widest">
              {{ bracket ? 'บันทึกการแก้ไข' : 'เพิ่มข้อมูล' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TaxBracketFormComponent implements OnChanges {
  @Input() bracket: TaxBracket | null = null;
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  model: TaxBracket = this.getDefaultModel();

  constructor(private taxService: TaxService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bracket'] && this.bracket) {
      this.model = { ...this.bracket };
    } else if (!this.bracket) {
      this.model = this.getDefaultModel();
    }
  }

  onSubmit(form: any): void {
    if (this.bracket && this.bracket.id) {
      this.taxService.updateBracket(this.bracket.id, this.model).subscribe({
        next: () => this.onSuccess.emit(),
        error: (err) => alert('Failed to update bracket')
      });
    } else {
      this.taxService.addBracket(this.model).subscribe({
        next: () => this.onSuccess.emit(),
        error: (err) => alert('Failed to add bracket')
      });
    }
  }

  private getDefaultModel(): TaxBracket {
    return {
      minIncome: 0,
      taxRate: 0,
      sequence: 1
    };
  }
}
