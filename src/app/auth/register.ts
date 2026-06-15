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
                <input type="email" name="email" [(ngModel)]="user.email" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                <input type="text" name="nationalId" [(ngModel)]="user.nationalId" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" name="phoneNumber" [(ngModel)]="user.phoneNumber" required
                  class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" [(ngModel)]="user.password" required
                class="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <button type="submit" [disabled]="!regForm.valid || isLoading()"
              class="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
              {{ isLoading() ? 'CREATING...' : 'CREATE ACCOUNT' }}
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

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
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
        // แสดงข้อความ Error จาก Backend หากมี หรือใช้ Default message
        const message = err.error?.message || err.error || 'Registration failed. Please try again.';
        this.errorMsg.set(message);
        console.error('Registration failed', err);
      }
    });
  }
}
