import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div class="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="bg-gray-50 border-b px-8 py-6 text-center">
          <h2 class="text-2xl font-bold text-gray-800 uppercase tracking-wider">Create Account</h2>
        </div>
        <div class="p-8">
          <form (ngSubmit)="onRegister()" #regForm="ngForm" class="space-y-4">
            @if (errorMsg()) {
              <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p class="text-red-700 text-sm">{{ errorMsg() }}</p>
              </div>
            }
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" name="firstName" [(ngModel)]="user.firstName" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" name="lastName" [(ngModel)]="user.lastName" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" name="username" [(ngModel)]="user.username" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" [(ngModel)]="user.email" required email #email="ngModel"
                  [class.border-red-500]="email.invalid && (email.dirty || email.touched)"
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                @if (email.invalid && (email.dirty || email.touched)) {
                  <p class="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
                }
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                <input type="text" name="nationalId" [(ngModel)]="user.nationalId" required 
                  pattern="[0-9]{13}" maxlength="13" #nationalId="ngModel"
                  [class.border-red-500]="nationalId.invalid && (nationalId.dirty || nationalId.touched)"
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                @if (nationalId.invalid && (nationalId.dirty || nationalId.touched)) {
                  <p class="text-red-500 text-xs mt-1">National ID must be 13 digits.</p>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" name="phoneNumber" [(ngModel)]="user.phoneNumber" required 
                  pattern="[0-9]{10}" maxlength="10" #phoneNumber="ngModel"
                  [class.border-red-500]="phoneNumber.invalid && (phoneNumber.dirty || phoneNumber.touched)"
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                @if (phoneNumber.invalid && (phoneNumber.dirty || phoneNumber.touched)) {
                  <p class="text-red-500 text-xs mt-1">Phone number must be 10 digits.</p>
                }
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" [(ngModel)]="user.password" required 
                  minlength="8" #password="ngModel"
                  [class.border-red-500]="password.invalid && (password.dirty || password.touched)"
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                @if (password.invalid && (password.dirty || password.touched)) {
                  <p class="text-red-500 text-xs mt-1">Password must be at least 8 characters.</p>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" [(ngModel)]="confirmPassword" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <button type="submit" [disabled]="!regForm.valid || isLoading() || user.password !== confirmPassword"
              class="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
              @if (isLoading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                CREATING ACCOUNT...
              } @else {
                CREATE ACCOUNT
              }
            </button>
          </form>
          <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p class="text-sm text-gray-600">
              Already have an account? <a routerLink="/login" class="font-medium text-blue-600 hover:text-blue-500">Login!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  user = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    nationalId: '',
    phoneNumber: ''
  };
  confirmPassword = '';

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (this.user.password !== this.confirmPassword) {
      this.errorMsg.set('Passwords do not match');
      return;
    }

    const reservedUsernames = ['admin', 'root', 'system'];
    if (reservedUsernames.includes(this.user.username.toLowerCase())) {
      this.errorMsg.set('Username นี้ถูกจองไว้โดยระบบ ไม่สามารถใช้งานได้');
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);
    
    this.authService.register(this.user).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 503 || err.status === 0) {
          this.errorMsg.set('ระบบฐานข้อมูลกำลังพักผ่อน กรุณารอสักครู่ (กำลังปลุก Database)');
        } else {
          // แสดงข้อความ Error จาก Backend หากมี หรือใช้ Default message
          const message = err.error?.message || err.error || 'Registration failed. Please try again.';
          this.errorMsg.set(message);
        }
        console.error('Registration failed', err);
      }
    });
  }
}
