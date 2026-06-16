import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-800">My Profile</h1>
        <p class="text-slate-500 text-sm mt-1">Manage your personal information and account settings.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar / Photo -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div class="w-32 h-32 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md mb-4">
              {{ (user().firstName?.[0] || 'U') + (user().lastName?.[0] || '') }}
            </div>
            <h2 class="text-lg font-bold text-slate-800">{{ user().firstName }} {{ user().lastName }}</h2>
            <p class="text-slate-500 text-sm italic">{{ user().email }}</p>
            <div class="mt-6 pt-6 border-t">
              <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Active Account</span>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="md:col-span-2 relative">
          @if (isLoading() && !user().id) {
            <div class="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          }
          <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="px-6 py-4 bg-gray-50/50 border-b">
              <h3 class="font-bold text-slate-800">Account Details</h3>
            </div>
            <div class="p-6">
              <form (ngSubmit)="onUpdateProfile()" class="space-y-6">
                <!-- ... existing form fields ... -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
                    <input type="text" name="firstName" [(ngModel)]="user().firstName"
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
                    <input type="text" name="lastName" [(ngModel)]="user().lastName"
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input type="email" name="email" [(ngModel)]="user().email" readonly
                         class="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-slate-500 cursor-not-allowed">
                  <p class="text-[10px] text-slate-400 mt-1 italic">Email address cannot be changed.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">National ID</label>
                    <input type="text" name="nationalId" [(ngModel)]="user().nationalId"
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input type="text" name="phoneNumber" [(ngModel)]="user().phoneNumber"
                           class="block w-full border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                  </div>
                </div>

                <div class="pt-6 border-t flex justify-end">
                  <button type="submit" [disabled]="isLoading()"
                          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition duration-200 uppercase tracking-widest text-xs flex items-center gap-2">
                    @if (isLoading()) {
                      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    } @else {
                      Save Changes
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user = signal<User>({ id: '', username: '', email: '' });
  isLoading = signal(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.isLoading.set(false);
      }
    });
  }

  onUpdateProfile(): void {
    this.isLoading.set(true);
    this.userService.updateProfile(this.user()).subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false);
        alert('Profile updated successfully!');
      },
      error: (err) => {
        this.isLoading.set(false);
        alert('Failed to update profile.');
      }
    });
  }
}
