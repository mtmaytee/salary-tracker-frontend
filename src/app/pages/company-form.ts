import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../models/company.model';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white shadow-sm rounded-xl border overflow-hidden">
      <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
        <h2 class="font-bold text-slate-800">{{ isEdit ? 'Edit Company' : 'Add New Company' }}</h2>
        <button (click)="onCancel.emit()" class="text-slate-400 hover:text-slate-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="p-6">
        <form (ngSubmit)="onSubmit()" #companyForm="ngForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
              <input type="text" name="name" [(ngModel)]="model.name" required
                     class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                     placeholder="e.g. Acme Corp">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tax ID</label>
              <input type="text" name="taxId" [(ngModel)]="model.taxId"
                     class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                     placeholder="e.g. 01055xxxxxxxx">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</label>
            <input type="text" name="industry" [(ngModel)]="model.industry"
                   class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                     placeholder="e.g. Technology">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Address</label>
            <textarea name="address" [(ngModel)]="model.address" rows="3"
                      class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Street, City, Zip Code"></textarea>
          </div>
          
          <div class="flex items-center justify-end gap-3 pt-6 border-t mt-6">
            <button type="button" (click)="onCancel.emit()"
                    class="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition">
              Cancel
            </button>
            <button type="submit" [disabled]="!companyForm.form.valid || isLoading"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition duration-200 disabled:bg-gray-300 uppercase tracking-widest text-xs flex items-center gap-2">
              @if (isLoading) {
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              } @else {
                {{ isEdit ? 'Update Company' : 'Save Company' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CompanyFormComponent implements OnInit {
  @Input() company: Company | null = null;
  @Output() onSuccess = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  model: Company = { id: '', name: '', industry: '', address: '' };
  isEdit = false;
  isLoading = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    if (this.company) {
      this.model = { ...this.company };
      this.isEdit = true;
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    const action = this.isEdit 
      ? this.companyService.updateCompany(this.model.id, this.model)
      : this.companyService.createCompany(this.model);

    action.subscribe({
      next: () => {
        this.isLoading = false;
        this.onSuccess.emit();
      },
      error: (err) => {
        this.isLoading = false;
        alert('Failed to save company. Please check your connection or backend logs.');
      }
    });
  }
}
