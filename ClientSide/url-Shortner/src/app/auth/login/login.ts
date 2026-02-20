import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Authservice } from '../../services/authservice';
import { TokenService } from '../../services/token-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;
  submitting: boolean = false;
  serverError: string | null = null;

  constructor(private fb: FormBuilder, private auth: Authservice, private token: TokenService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.form.controls; }

  submit() {
    this.serverError = null;
    this.submitting = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitting = false;
      return;
    }

    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        // store token if returned
        if (res && res.token) {
          this.token.token = res.token;
        }
        this.submitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        if (err.error && err.error.message) this.serverError = err.error.message;
        else this.serverError = 'Login failed. Please check credentials.';
      }
    });
  }
}
