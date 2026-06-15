import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  
  // ตรวจสอบว่ามี Token และยังไม่หมดอายุ
  if (token && !authService.isTokenExpired()) {
    return true;
  }

  // ถ้าไม่มี Token หรือหมดอายุแล้ว ให้ล้างค่าและกลับไปหน้า Login
  authService.logout();
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
