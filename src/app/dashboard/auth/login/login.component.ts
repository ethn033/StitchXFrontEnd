import { ShareDataService } from './../../../services/shared/share-data.service';
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
import { ApiResponse } from '../../../models/base-response';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { ERole } from '../../../enums/enums';
import { APP_REMEMBER_ME, APP_USER, AUTH_TOKEN } from '../../../utils/global-contstants';
import { LoadingService } from '../../../services/generics/loading.service';
import { Login, User } from '../../../Dtos/requests/request-dto';
import { ERoleToString } from '../../../utils/utils';
import { UserResponse } from '../../../Dtos/requests/response-dto';

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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private ls = inject(LocalStorageService);
  private authService = inject(AuthService);
  private sds = inject(ShareDataService);
  private router = inject(Router);
  
  isLoading = false;
  isPasswordVisible = false;
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });
  
  
  constructor(private messageService: MessageService) {
    
  }
  
  rememberMe: boolean = false;
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    const formData = this.loginForm.value as Login;
    this.rememberMe = formData.rememberMe ?? false;
    this.authService.signIn(formData).subscribe({
      next: (data: any) => {
        let response = data as ApiResponse<UserResponse> ;
        if(response.statusCode == 200 && data.isSuccess) {
          if(response.data && response.data.user && response.data.tokenResponse) {
            this.ls.setItem(APP_REMEMBER_ME, this.rememberMe, true);
            this.ls.setItem(APP_USER, response.data.user, true);
            this.ls.setItem(AUTH_TOKEN, response.data.tokenResponse, true);
            
            const user = this.ls.getItem(APP_USER, true) as User;         
            this.sds.setUserResponse(user);
            
            if(this.sds.isSoftOwner()) {
              this.router.navigate(['admin'], { replaceUrl: true  });
            }
            else if(this.sds.isShopOwner()) {
              
              if(!this.sds.isBusinessExists()) {
                this.router.navigate(['clint-setup', 'create-business', this.sds.currentUserId()], { replaceUrl: true });
              }
              else if(!this.sds.isBranchExists()) {
                this.router.navigate(['clint-setup/create-branch'], { replaceUrl: true });
              }
              else 
                this.router.navigate(['admin'], { replaceUrl: true  });
            }
            else if(this.sds.isTailor() || this.sds.isCutter()) {
              this.router.navigate(['tailor'], { replaceUrl: true });
            }
            else {
              this.router.navigate(['shop'], { replaceUrl: true });
            }
          }
          this.isLoading = false;
          this.loginForm.reset();
          return;
        }
        this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: data.message || 'Failed to login'});
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: error instanceof Error ? error.message : 'Failed to login'
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
