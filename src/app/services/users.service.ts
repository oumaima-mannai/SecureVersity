import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface UserDTO {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  async getUsers(): Promise<UserDTO[]> {
    return lastValueFrom(
      this.http.get<UserDTO[]>(this.API_URL, { withCredentials: true })
    );
  }

  async createUser(payload: any): Promise<UserDTO> {
    return lastValueFrom(
      this.http.post<UserDTO>(this.API_URL, payload, { withCredentials: true })
    );
  }
}
