import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Authservice } from '../../services/authservice';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: FormGroup;
  submitting: boolean = false;
  serverError: string | null = null;

  constructor(private fb: FormBuilder, private auth: Authservice, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      lastName: ['', [Validators.maxLength(40)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}')]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pw = control.get('password')?.value;
    const cpw = control.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
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

    const payload = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.auth.register(payload).subscribe({
      next: () => {
        // on successful register, navigate to login
        this.submitting = false;
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        if (err.error && err.error.message) {
          this.serverError = err.error.message;
        } else {
          this.serverError = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
