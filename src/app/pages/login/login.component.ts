import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  submitAttempted = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  showError(field: 'email' | 'password'): boolean {
    const ctrl = this.form.get(field)!;
    return ctrl.invalid && (ctrl.touched || this.submitAttempted);
  }

  async onSubmit() {
    this.submitAttempted = true;
    if (this.form.invalid) return;

    this.loading = true;
    try {
      await this.auth.login(this.email.value, this.password.value);
      this.router.navigate(['/dashboard']);
    } finally {
      this.loading = false;
    }
  }
}
