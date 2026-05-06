import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ user: any }>(
          `${this.API_URL}/login`, 
          { email, password },
          { withCredentials: true } 
        )
      );
      
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        if ((response as any).firebase_token) {
          localStorage.setItem('firebase_token', (response as any).firebase_token);
        }
        return { success: true, mustChangePassword: response.user.mustChangePassword };
      }
      return { success: false };
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Invalid credentials');
    }
  }

  async changePassword(newPassword: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ user: any }>(
          `${this.API_URL}/change-password`, 
          { newPassword },
          { withCredentials: true } 
        )
      );
      if (response && response.user) {
        // Update user in local storage to remove mustChangePassword flag
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Change password failed', error);
      throw new Error('Failed to change password');
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  isAdmin(): boolean {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.role === 'ADMIN_SYSTEM';
    } catch {
      return false;
    }
  }

  userEmail(): string | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.email;
    } catch {
      return null;
    }
  }

  currentUserRole(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 'Guest';
    try {
      const user = JSON.parse(userStr);
      return user.role?.replace('_', ' ') || 'User';
    } catch {
      return 'User';
    }
  }

  currentUserRoleRaw(): string | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.role || null;
    } catch {
      return null;
    }
  }

  currentUserId(): string | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  }
}

