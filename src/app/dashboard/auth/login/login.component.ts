import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../../models/LoginRequest';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    CheckboxModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService], // Provide MessageService here
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  
  isLoading = false;
  isPasswordVisible = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.loginForm.value as LoginRequest;

    this.authService.signIn(formData).subscribe({
      next: (data: any) => {
        this.messageService.add({
          key: 'global-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully'
        }); 

        this.isLoading = false;
        this.loginForm.reset();
        this.router.navigate(['admin']);
      },
      error: (error) => {
        this.messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Login Failed',
          detail: error instanceof Error ? error.message : 'Failed to login'
        });
        
        this.isLoading = false;
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
