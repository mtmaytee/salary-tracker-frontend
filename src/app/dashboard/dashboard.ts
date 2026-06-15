import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlySummaryComponent } from './monthly-summary';
import { LanguageService } from '../services/language.service';
import { TtsService } from '../services/tts.service';
import { ReportService } from '../services/report.service';
import { ReportDefinition } from '../models/report.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MonthlySummaryComponent],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">{{ langService.translate('dashboard') }}</h1>
          <nav class="flex text-sm text-slate-500 mt-1">
            <ol class="flex items-center space-x-2">
              <li><a href="#" class="hover:text-blue-600">{{ langService.translate('home') }}</a></li>
              <li><span class="text-slate-400">/</span></li>
              <li class="font-medium text-slate-800">{{ langService.translate('overview') }}</li>
            </ol>
          </nav>
        </div>
        
        <div class="flex gap-3">
          <button (click)="showNotice.set(true)" 
                  class="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ langService.translate('notice_title') }}
          </button>

          <!-- Report Download Dropdown -->
          <div class="relative group">
            <button class="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md shadow-blue-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ langService.translate('download_report') }}
            </button>
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div class="py-1">
                @for (report of availableReports(); track report.id) {
                  <button (click)="downloadReport(report.reportCode)" class="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                    <div class="font-medium">{{ report.name }}</div>
                    <div class="text-[10px] text-slate-400">หมวดหมู่: {{ report.category }}</div>
                  </button>
                }
                @if (availableReports().length === 0) {
                  <div class="px-4 py-3 text-sm text-slate-500 text-center italic">ไม่มีรายงานในระบบ</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Welcome Article -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <h2 class="text-3xl font-bold mb-4">{{ langService.translate('notice_title') }}</h2>
          <p class="text-blue-100 text-lg leading-relaxed mb-6">
            {{ langService.translate('notice_content') }}
          </p>
          <button (click)="toggleSpeech()" 
                  class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-xl font-semibold transition">
            @if (ttsService.isPlaying()) {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Stop Audio
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              Play Audio
            }
          </button>
        </div>
        <div class="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute left-0 bottom-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <!-- Stats Cards (Summary Table) -->
      <div class="grid grid-cols-1 gap-6">
        <app-monthly-summary></app-monthly-summary>
      </div>

      <!-- Notice Dialog -->
      @if (showNotice()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-blue-100">
            <div class="p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-slate-800">{{ langService.translate('notice_title') }}</h3>
                <div class="flex gap-2">
                  <!-- Play/Stop in Dialog -->
                  <button (click)="toggleSpeech()" 
                          class="p-2 hover:bg-slate-100 rounded-full transition text-blue-600">
                    @if (ttsService.isPlaying()) {
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z" />
                      </svg>
                    } @else {
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  </button>
                  
                  <button (click)="ttsService.toggleMute()" 
                          [class.text-blue-600]="!ttsService.isMuted()"
                          [class.text-slate-400]="ttsService.isMuted()"
                          class="p-2 hover:bg-slate-100 rounded-full transition relative group">
                    @if (!ttsService.isMuted()) {
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                      </svg>
                    } @else {
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                      </svg>
                    }
                    <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {{ ttsService.isMuted() ? 'Unmute' : 'Mute' }}
                    </span>
                  </button>
                </div>
              </div>
              
              <div class="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
                <p class="text-slate-700 text-lg leading-relaxed text-center italic font-medium">
                  "{{ langService.translate('notice_content') }}"
                </p>
              </div>
              
              <div class="flex gap-4">
                <button (click)="toggleSpeech()" 
                        class="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98] flex items-center justify-center gap-2">
                  @if (ttsService.isPlaying()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z" />
                    </svg>
                    Stop
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                    </svg>
                    Listen
                  }
                </button>
                <button (click)="closeNotice()" 
                        class="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition">
                  {{ langService.translate('close') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  langService = inject(LanguageService);
  ttsService = inject(TtsService);
  reportService = inject(ReportService);
  
  showNotice = signal(false);
  availableReports = signal<ReportDefinition[]>([]);

  constructor() {
    // Automatically play if not muted when notice is shown
    effect(() => {
      if (this.showNotice() && !this.ttsService.isMuted()) {
        this.speakNotice();
      }
    });
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReportsList().subscribe({
      next: (reports) => {
        // กรองเฉพาะรายงานที่มีหมวดหมู่เกี่ยวข้องกับผู้ใช้ทั่วไป (เช่น INCOME หรือ SALARY)
        // หรือจะโชว์ทั้งหมดก็ได้ ตามที่คุณแจ้งว่าต้องสัมพันธ์กับ income_type
        this.availableReports.set(reports);
      },
      error: (err) => console.error('Error loading reports', err)
    });
  }

  downloadReport(reportCode: string) {
    // ส่ง parameter type เป็น incomeType เพื่อให้สัมพันธ์กับการโหลดรายงานตามโจทย์
    this.reportService.downloadReport(reportCode, { income_type: 'SALARY' });
  }

  toggleSpeech() {
    if (this.ttsService.isPlaying()) {
      this.ttsService.stop();
    } else {
      this.speakNotice();
    }
  }

  speakNotice() {
    const text = this.langService.translate('notice_content');
    this.ttsService.speak(text, this.langService.currentLang());
  }

  closeNotice() {
    this.showNotice.set(false);
    this.ttsService.stop();
  }
}
