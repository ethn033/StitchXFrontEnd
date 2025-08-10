import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {
  constructor() {}

  /**
   * Decodes a JWT token and returns the payload
   * @param token The JWT token to decode
   * @returns The decoded payload or null if decoding fails
   */
  isTokenExpired(decodedToken: any): boolean {
    if (!decodedToken?.exp) return false;
    return (Date.now() / 1000) > decodedToken.exp;
  }
}
