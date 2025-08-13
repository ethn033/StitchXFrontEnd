import { environment } from './../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiService } from '../generics/api.service';
import { ApiResponse } from '../../models/base-response';
import { Login, User } from '../../Dtos/requests/requestDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private readonly endpoint: string = environment.api.auth.controller +environment.api.auth.enpoints.Login;
  private router = inject(Router);

  signIn<T>(request: Login): Observable<ApiResponse<T>> {
    return this.post(this.endpoint, request);
  }

  signUp(request: User): Observable<any> {
      return of(1);
  }

  async signOut() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}