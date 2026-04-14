import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ user: any }>(
          `${this.API_URL}/login`, 
          { email, password },
          { withCredentials: true } // Enables Cross-Origin HttpOnly cookies
        )
      );
      
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Invalid credentials');
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    // In a real app, also call this.http.post('/auth/logout', {}, { withCredentials: true }) to delete the cookie on the server
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}
