import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  
  // Signals to track auth state
  isAuthenticated = signal<boolean>(!!this.getToken());
  userRole = signal<string | null>(this.getRole());

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<{token: string, role: string}> {
    return this.http.post<{token: string, role: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setRole(response.role);
        this.isAuthenticated.set(true);
        this.userRole.set(response.role);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isAuthenticated.set(false);
    this.userRole.set(null);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isAdmin(): boolean {
    return this.getRole() === 'ROLE_ADMIN';
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        // Not a standard JWT, could be a mock token. 
        // We'll trust it's not expired if it exists and isn't a JWT.
        return false;
      }

      // Base64URL decode
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      if (!payload.exp) return false;

      const expirationDate = payload.exp * 1000;
      return Date.now() > expirationDate;
    } catch (e) {
      console.error('Token expiration check failed', e);
      return false; // Don't force logout if we can't be sure it's expired
    }
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify/${token}`);
  }
}
