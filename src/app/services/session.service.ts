import { Injectable, signal, effect, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription, timer, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // สถานะแจ้งเตือน (Signal)
  showWarning = signal<boolean>(false);
  minutesRemaining = signal<number>(0);
  
  private checkSubscription?: Subscription;
  private readonly WARNING_THRESHOLD_MS = 5 * 60 * 1000; // 5 นาที (ในหน่วย ms)

  constructor() {
    // ตรวจสอบสถานะทุกๆ 30 วินาที
    this.startMonitoring();
  }

  private startMonitoring() {
    this.checkSubscription = interval(30000).subscribe(() => {
      this.checkSession();
    });
    // เช็คทันทีเมื่อเริ่ม
    this.checkSession();
  }

  private checkSession() {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return;

      const expirationDate = payload.exp * 1000;
      const msLeft = expirationDate - Date.now();

      if (msLeft <= 0) {
        // หมดเวลาแล้ว เด้งออกทันที
        this.forceLogout();
      } else if (msLeft <= this.WARNING_THRESHOLD_MS) {
        // เหลือเวลาน้อยกว่า 5 นาที แสดงแจ้งเตือน
        this.minutesRemaining.set(Math.ceil(msLeft / 1000 / 60));
        this.showWarning.set(true);
      } else {
        // ยังมีเวลาเหลือเยอะ ซ่อนแจ้งเตือน (กรณีที่ Login ใหม่)
        this.showWarning.set(false);
      }
    } catch (e) {
      console.error('Session check failed', e);
    }
  }

  private forceLogout() {
    this.showWarning.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.checkSubscription?.unsubscribe();
  }
}
