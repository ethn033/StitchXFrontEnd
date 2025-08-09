import { environment } from './../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginDto, RegisterDto } from '../../Dtos/requests/requestDto';
import { ApiService } from '../generics/api.service';
import { ApiResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private readonly endpoint: string = environment.api.auth.controller +environment.api.auth.enpoints.Login;
  private router = inject(Router);

  signIn<T>(request: LoginDto): Observable<ApiResponse<T>> {
    return this.post(this.endpoint, request);
  }

  signUp(request: RegisterDto): Observable<any> {
      return of(1);
  }

  async signOut() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}