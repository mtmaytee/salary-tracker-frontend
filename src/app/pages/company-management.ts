import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company.model';
import { CompanyFormComponent } from './company-form';

@Component({
  selector: 'app-company-management',
  standalone: true,
  imports: [CommonModule, CompanyFormComponent],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Company Management</h1>
          <p class="text-slate-500 text-sm mt-1">Efficiently manage your associated companies.</p>
        </div>
        @if (!showForm()) {
          <button (click)="openCreateForm()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition duration-200 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add New Company
          </button>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main List Section -->
        <div [class]="showForm() ? 'lg:col-span-7' : 'lg:col-span-12'" class="transition-all duration-300">
          <div class="bg-white shadow-sm rounded-xl overflow-hidden border">
            <div class="px-6 py-4 bg-gray-50/50 border-b flex items-center justify-between">
              <h2 class="font-bold text-slate-800">Company Directory</h2>
              <span class="text-xs font-medium text-slate-400">{{ companies().length }} Total</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50/50">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Address</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  @if (isLoading()) {
                    <tr>
                      <td colspan="4" class="px-6 py-20 text-center">
                        <div class="flex flex-col items-center justify-center gap-3">
                          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span class="text-sm font-medium text-slate-500">Loading companies...</span>
                        </div>
                      </td>
                    </tr>
                  } @else {
                    @for (company of companies(); track company.id) {
                      <tr class="hover:bg-gray-50 transition duration-150 group">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{{ company.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wider">{{ company.industry || 'N/A' }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 hidden md:table-cell truncate max-w-xs">{{ company.address || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                          <button (click)="openEditForm(company)" class="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          </button>
                          <button (click)="deleteCompany(company.id)" class="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </td>
                      </tr>
                    }
                    @if (companies().length === 0) {
                      <tr>
                        <td colspan="4" class="px-6 py-20 text-center">
                          <div class="flex flex-col items-center opacity-40">
                            <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            <p class="font-medium">No companies registered yet</p>
                          </div>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sticky Form Section -->
        @if (showForm()) {
          <div class="lg:col-span-5 h-fit sticky top-8">
            <app-company-form 
              [company]="selectedCompany()" 
              (onSuccess)="handleSuccess()" 
              (onCancel)="closeForm()">
            </app-company-form>
          </div>
        }
      </div>
    </div>
  `
})
export class CompanyManagementComponent implements OnInit {
  companies = signal<Company[]>([]);
  showForm = signal<boolean>(false);
  selectedCompany = signal<Company | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error fetching companies', err);
        if (err.status !== 404) {
          alert('Failed to load companies. Check backend server.');
        }
      }
    });
  }

  openCreateForm(): void {
    this.selectedCompany.set(null);
    this.showForm.set(true);
  }

  openEditForm(company: Company): void {
    this.selectedCompany.set(company);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.selectedCompany.set(null);
  }

  handleSuccess(): void {
    this.loadCompanies();
    this.closeForm();
  }

  deleteCompany(id: string): void {
    if (confirm('Delete this company? This action cannot be undone.')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => this.loadCompanies(),
        error: (err) => alert('Delete failed. Company might be linked to other records.')
      });
    }
  }
}
