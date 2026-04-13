import { Injectable } from '@angular/core';

/**
 * AuthService — Placeholder for future backend integration.
 * Replace the stub methods with real HTTP calls when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated = false;

  /**
   * Simulate login — replace with: return this.http.post('/api/auth/login', credentials)
   */
  login(email: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        // TODO: validate against real API
        this._authenticated = true;
        resolve(true);
      }, 600);
    });
  }

  logout(): void {
    this._authenticated = false;
  }

  isAuthenticated(): boolean {
    return this._authenticated;
  }
}
