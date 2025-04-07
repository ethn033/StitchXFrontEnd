import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  User, 
  signInWithEmailAndPassword,
  signOut, 
  authState,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { LoginRequest } from '../models/LoginRequest';
import { SignUpRequest } from '../models/SignUpRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  authState$ = authState(this.auth);

  constructor() {
    
  }

  signIn({ email, password }: LoginRequest): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Sign up with email/password
  async signUp(request: SignUpRequest): Promise<void> {
      const credential = await createUserWithEmailAndPassword(this.auth, request.email, request.password);
      if (this.auth.currentUser) {
        // await updateProfile(this.auth.currentUser, { displayName: name });
      }
  }

  // Sign out
  async signOut(): Promise<void> {
    await signOut(this.auth);
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return this.authState$;
  }

}