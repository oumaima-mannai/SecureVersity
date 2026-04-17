import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  fb = inject(FormBuilder);
  usersService = inject(UsersService);
  router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  userForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['RSSI', Validators.required]
  });

  async onSubmit() {
    if (this.userForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      await this.usersService.createUser(this.userForm.value);
      this.router.navigate(['/admin']);
    } catch (e: any) {
      if (e.status === 409) {
         this.errorMessage = 'An account with this email already exists.';
      } else {
         this.errorMessage = 'Failed to create user. Please verify backend connection and permissions.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}
