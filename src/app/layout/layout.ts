import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionWarningComponent } from './session-warning';
import { SessionService } from '../services/session.service';
import { LanguageService, Language } from '../services/language.service';
import { FontService, FontSize } from '../services/font.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SessionWarningComponent],
  template: `
    <div class="flex h-screen bg-gray-100 overflow-hidden">
      <!-- Session Warning Modal -->
      <app-session-warning></app-session-warning>

      <!-- Sidebar -->
      <aside class="w-64 bg-slate-800 text-white flex-shrink-0 flex flex-col shadow-xl z-20">
        <div class="p-6 bg-slate-900 flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">S</div>
          <span class="text-xl font-bold tracking-tight">SALARY TRACK</span>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 pb-2">Interface</div>
          
          <a routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span class="font-medium">{{ langService.translate('dashboard') }}</span>
          </a>

          <a routerLink="/salary" routerLinkActive="bg-blue-600 text-white" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.63 1m-4.63-1c.55-.593 1.52-1 2.63-1m0 0V7m0 1v1m0 0h1m-1 0h-1m1 0v1m0 1V10m0 0h1m-1 0h-1m1 0V9"/></svg>
            <span class="font-medium">{{ langService.translate('salary_record') }}</span>
          </a>

          <a routerLink="/employments" routerLinkActive="bg-blue-600 text-white" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span class="font-medium">{{ langService.translate('employment_contract') }}</span>
          </a>

          <a routerLink="/companies" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <span class="font-medium">{{ langService.translate('companies') }}</span>
          </a>

          <div class="pt-6 text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 pb-2">Account</div>
          
          <a routerLink="/profile" routerLinkActive="bg-blue-600 text-white"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span class="font-medium">{{ langService.translate('profile') }}</span>
          </a>

          <!-- Admin Section -->
          <ng-container *ngIf="isAdmin()">
            <div class="pt-6 text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 pb-2">{{ langService.translate('admin_panel') }}</div>
            
            <a routerLink="/admin/users" routerLinkActive="bg-purple-600 text-white"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 15.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <span class="font-medium">{{ langService.translate('user_management') }}</span>
            </a>

            <a routerLink="/admin/reports" routerLinkActive="bg-purple-600 text-white"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span class="font-medium">{{ langService.translate('report_management') }}</span>
            </a>

            <a routerLink="/tax-settings" routerLinkActive="bg-purple-600 text-white"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span class="font-medium">{{ langService.translate('tax_settings') }}</span>
            </a>
          </ng-container>
        </nav>

        <div class="p-4 bg-slate-900/50">
          <div class="bg-slate-700 rounded-lg p-3 text-center">
            <p class="text-xs text-slate-400">{{ langService.translate('logged_in_as') }}</p>
            <p class="text-sm font-semibold truncate">Administrator</p>
          </div>
        </div>
      </aside>

      <!-- Main Content Container -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Topbar -->
        <header class="h-16 bg-white border-b flex items-center justify-between px-6 z-10 shadow-sm">
          <div class="flex items-center flex-1">
            <div class="relative w-full max-w-md hidden md:block">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input type="text" [placeholder]="langService.translate('search_placeholder')" 
                     class="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200">
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Font Size Dropdown -->
            <div class="relative group">
              <button class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition duration-200 border border-transparent hover:border-gray-300">
                <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span class="text-xs font-bold uppercase text-slate-700">{{ fontService.currentSize() }}</span>
              </button>
              
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div class="py-1">
                  <button (click)="changeFontSize('small')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition" [class.bg-blue-50]="fontService.currentSize() === 'small'">
                    <span class="text-xs font-medium">{{ langService.translate('font_small') }}</span>
                  </button>
                  <button (click)="changeFontSize('medium')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition" [class.bg-blue-50]="fontService.currentSize() === 'medium'">
                    <span class="text-base font-medium">{{ langService.translate('font_medium') }}</span>
                  </button>
                  <button (click)="changeFontSize('large')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition" [class.bg-blue-50]="fontService.currentSize() === 'large'">
                    <span class="text-lg font-medium">{{ langService.translate('font_large') }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Language Dropdown -->
            <div class="relative group">
              <button class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition duration-200 border border-transparent hover:border-gray-300">
                <span [class]="'fi fi-' + getFlagCode(langService.currentLang())"></span>
                <span class="text-xs font-bold uppercase text-slate-700">{{ langService.currentLang() }}</span>
                <svg class="w-4 h-4 text-gray-500 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div class="py-1">
                  <button (click)="changeLang('th')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    <span class="fi fi-th"></span>
                    <span class="font-medium">ภาษาไทย</span>
                  </button>
                  <button (click)="changeLang('en')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    <span class="fi fi-us"></span>
                    <span class="font-medium">English</span>
                  </button>
                  <button (click)="changeLang('zh')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    <span class="fi fi-cn"></span>
                    <span class="font-medium">中文 (简体)</span>
                  </button>
                  <button (click)="changeLang('ja')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    <span class="fi fi-jp"></span>
                    <span class="font-medium">日本語</span>
                  </button>
                  <button (click)="changeLang('ko')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    <span class="fi fi-kr"></span>
                    <span class="font-medium">한국어</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 cursor-pointer" (click)="onLogout()">
              <span class="hidden sm:block text-sm font-semibold text-gray-700">{{ langService.translate('logout') }}</span>
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">AD</div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  langService = inject(LanguageService);
  fontService = inject(FontService);
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeLang(lang: string): void {
    this.langService.setLanguage(lang as Language);
  }

  changeFontSize(size: string): void {
    this.fontService.setFontSize(size as FontSize);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getFlagCode(lang: Language): string {
    switch(lang) {
      case 'th': return 'th';
      case 'en': return 'us';
      case 'zh': return 'cn';
      case 'ja': return 'jp';
      case 'ko': return 'kr';
      default: return 'th';
    }
  }
}
