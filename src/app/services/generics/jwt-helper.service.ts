import { inject, Injectable } from '@angular/core';
import { TokenResponse } from '../../Dtos/requests/response-dto';
import { AUTH_TOKEN } from '../../utils/global-contstants';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {
  private ls: LocalStorageService = inject(LocalStorageService);
  constructor() {}


   /**
   * Get token from local storage
   */
  getToken(): string | null {
    let token = this.ls.getItem(AUTH_TOKEN, true) as TokenResponse;
    return token.accessToken;
  }

   /**
   * Decode JWT token without verification
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

 /**
   * Check if token is expired
   */
  isTokenExpired(token?: string): boolean {
    const authToken = token || this.getToken();
    
    if (!authToken) {
      return true; // No token means expired
    }

    const decodedToken = this.decodeToken(authToken);
    
    if (!decodedToken?.exp) {
      return true; // Token without expiration is considered expired
    }

    // Convert expiration time from seconds to milliseconds and compare
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    return currentTime > expirationTime;
  }

  /**
   * Get time remaining until token expires (in milliseconds)
   */
  getTimeUntilExpiration(token?: string): number | null {
    const expirationDate = this.getTokenExpiration(token);
    
    if (!expirationDate) {
      return null;
    }

    return expirationDate.getTime() - Date.now();
  }

  /**
   * Check if token will expire within a certain time frame
   */
  willTokenExpireSoon(thresholdMinutes: number = 5, token?: string): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    
    if (timeUntilExpiration === null) {
      return true;
    }

    const thresholdMs = thresholdMinutes * 60 * 1000;
    return timeUntilExpiration <= thresholdMs;
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(token?: string): Date | null {
    const authToken = token || this.getToken();
    
    if (!authToken) {
      return null;
    }

    const decodedToken = this.decodeToken(authToken);
    
    if (!decodedToken?.exp) {
      return null;
    }

    return new Date(decodedToken.exp * 1000);
  }

  /**
   * Get user information from token
   */
  getUserInfo(): any {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    const decodedToken = this.decodeToken(token);
    return decodedToken || null;
  }

  /**
   * Get user ID from token
   */
  getUserId(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo?.sub || userInfo?.userId || userInfo?.id || null;
  }

  /**
   * Get user roles from token
   */
  getUserRoles(): string[] {
    const userInfo = this.getUserInfo();
    return userInfo?.roles || userInfo?.role || [];
  }
}
