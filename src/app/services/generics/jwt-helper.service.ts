import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {

 decodeToken<T = any>(token: string): T | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const payload = parts[1];
      const decoded = this.base64UrlDecode(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  private base64UrlDecode(base64Url: string): string {
    // Convert Base64Url to Base64
    let base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    const padLength = (4 - (base64.length % 4)) % 4;
    base64 += '='.repeat(padLength);

    // Modern alternative to deprecated escape/unescape
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new TextDecoder().decode(bytes);
  }

  // Rest of your methods (getRoles, isTokenExpired, etc.) remain the same
  getRoles(decodedToken: any): string[] {
    if (!decodedToken) return [];
    
    // Handle various role claim formats
    return decodedToken.roles || 
           decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
           decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] || 
           [];
  }

  isTokenExpired(decodedToken: any): boolean {
    if (!decodedToken?.exp) return false;
    return (Date.now() / 1000) > decodedToken.exp;
  }
}
