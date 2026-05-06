import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.html',
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  submitAttempted = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get newPassword() { return this.form.get('newPassword')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  showError(field: 'newPassword' | 'confirmPassword'): boolean {
    const ctrl = this.form.get(field)!;
    return ctrl.invalid && (ctrl.touched || this.submitAttempted);
  }

  async onSubmit() {
    this.submitAttempted = true;
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    try {
      await this.auth.changePassword(this.newPassword.value);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.errorMsg = e.message || 'Failed to change password. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
