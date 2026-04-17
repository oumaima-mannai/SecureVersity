import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService, UserDTO } from '../../../services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  usersService = inject(UsersService);
  users: UserDTO[] = [];

  async ngOnInit() {
    try {
      this.users = await this.usersService.getUsers();
    } catch(e) {
      console.error("Failed to fetch users");
    }
  }
}
