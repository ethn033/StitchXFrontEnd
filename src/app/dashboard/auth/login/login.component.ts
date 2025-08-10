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
import { LoginDto } from '../../../Dtos/requests/requestDto';
import { ApiResponse } from '../../../models/base-response';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { ERole, ERoleToString } from '../../../enums/enums';
import { APP_USER, AUTH_TOKEN } from '../../../utils/global-contstants';

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
  private ls = inject(LocalStorageService);
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
    const formData = this.loginForm.value as LoginDto;

    this.authService.signIn(formData).subscribe({
      next: (data: any) => {
        let response = data as ApiResponse<any>;
        if(response.statusCode == 200 && data.isSuccess) {
          if(response.data && response.data.user && response.data.tokenResponse) {
            this.messageService.add({key: 'global-toast', severity: 'success', summary: 'Success', detail: 'Logged in successfully'});
            if(response.data.user.roles.includes(ERoleToString[ERole.SOFT_OWNER]) || response.data.user.roles.includes(ERoleToString[ERole.SHOP_OWNER])) {
              if(response.data.user.roles.includes(ERoleToString[ERole.SHOP_OWNER])) 
                this.router.navigate(['clint-setup/create-branch'], { replaceUrl: true });
              else 
                this.router.navigate(['admin'], { replaceUrl: true  });
            }
            else if(response.data.user.roles.includes(ERoleToString[ERole.TAILOR]) || response.data.user.roles.includes(ERoleToString[ERole.CUTTER])) {
              this.router.navigate(['tailor'], { replaceUrl: true });
            }
            else if(response.data.user.roles.includes(ERoleToString[ERole.CUSTOMER])) {
              this.router.navigate(['shop'], { replaceUrl: true });
            }
            this.ls.setItem(APP_USER, response.data.user, true);
            this.ls.setItem(AUTH_TOKEN, response.data.tokenResponse, true);
          }
          this.isLoading = false;
          this.loginForm.reset();
          return;
        }
        this.messageService.add({
          key: 'global-toast',
          severity: 'error',
          summary: 'Login Failed',
          detail: data.message || 'Failed to login'
        });
        this.isLoading = false;
      },
      error: (error) => {
        debugger
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
