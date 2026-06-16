import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="bg-gray-50 border-b px-8 py-6">
          <h2 class="text-2xl font-bold text-gray-800 text-center uppercase tracking-wider">Login</h2>
        </div>
        <div class="p-8">
          @if (isDbDown()) {
            <div class="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 class="font-bold text-orange-800">Database is Sleeping</h3>
              </div>
              <p class="text-sm text-orange-700 leading-relaxed">
                ระบบฐานข้อมูลกำลังพักผ่อน (Cold Start) กรุณารอสักครู่แอปกำลังทำการปลุก Database ให้ตื่นขึ้นมาทำงานครับ
              </p>
              <button (click)="checkDatabaseHealth()" class="mt-3 text-xs font-bold text-orange-600 hover:text-orange-800 uppercase tracking-wider flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                ลองตรวจสอบอีกครั้ง
              </button>
            </div>
          }

          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-6">
            @if (errorMsg()) {
              <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p class="text-red-700 text-sm">{{ errorMsg() }}</p>
              </div>
            }
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" name="username" [(ngModel)]="credentials.username" required
                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" [(ngModel)]="credentials.password" required
                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out">
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div class="text-sm">
                <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
              </div>
            </div>
            <button type="submit" [disabled]="!loginForm.valid || isLoading()"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition duration-150 ease-in-out">
              @if (isLoading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PLEASE WAIT...
              } @else {
                LOGIN
              }
            </button>
          </form>
          <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p class="text-sm text-gray-600">
              Need an account? <a routerLink="/register" class="font-medium text-blue-600 hover:text-blue-500">Sign up!</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' };
  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  isDbDown = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkDatabaseHealth();
  }

  checkDatabaseHealth(): void {
    this.authService.checkHealth().subscribe({
      error: (err) => {
        if (err.status === 503 || err.status === 0) {
          this.isDbDown.set(true);
          this.errorMsg.set('ระบบฐานข้อมูลกำลังพักผ่อน กรุณารอสักครู่ (กำลังปลุก Database)');
        }
      }
    });
  }

  onLogin(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.isDbDown.set(false);
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 503 || err.status === 0) {
          this.isDbDown.set(true);
          this.errorMsg.set('ระบบฐานข้อมูลกำลังพักผ่อน กรุณารอสักครู่ (กำลังปลุก Database)');
        } else if (err.status === 401 || err.status === 403) {
          this.errorMsg.set('Invalid username or password');
        } else {
          this.errorMsg.set('Login failed. Please try again.');
        }
      }
    });
  }
}
