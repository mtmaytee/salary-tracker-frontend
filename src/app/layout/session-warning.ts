import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-warning',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (sessionService.showWarning()) {
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-orange-100">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">เซสชันกำลังจะหมดอายุ!</h3>
            <p class="text-slate-500 mb-6">
              คุณจะถูกให้ออกจากระบบในอีกประมาณ <br>
              <span class="text-2xl font-black text-orange-500">{{ sessionService.minutesRemaining() }} นาที</span>
            </p>
            
            <div class="space-y-3">
              <button (click)="reLogin()" 
                      class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition active:scale-95">
                ตกลง, เข้าสู่ระบบใหม่
              </button>
              <button (click)="close()" 
                      class="w-full text-slate-400 py-2 text-sm font-medium hover:text-slate-600 transition">
                รับทราบ
              </button>
            </div>
          </div>
          <div class="h-1 bg-orange-200 w-full overflow-hidden">
            <div class="h-full bg-orange-500 animate-progress"></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
    .animate-progress {
      animation: progress 300s linear infinite;
    }
  `]
})
export class SessionWarningComponent {
  sessionService = inject(SessionService);
  private router = inject(Router);

  reLogin() {
    this.sessionService.showWarning.set(false);
    this.router.navigate(['/login']);
  }

  close() {
    this.sessionService.showWarning.set(false);
  }
}
