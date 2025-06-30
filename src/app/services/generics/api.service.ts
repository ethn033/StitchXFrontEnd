import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  http: HttpClient = inject(HttpClient);
  baseUrl: string = environment.api.baseUrl;
  
  /**
  * Generic GET request
  * @param endpoint - API endpoint (e.g., 'users')
  * @param params - Optional query parameters
  * @param headers - Optional headers
  * @returns Observable of type T or T[]
  */
  get(endPoint: string, params?: any, headers?: any) : Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
    
    const options = {
      params: httpParams,
      headers: headers
    }
    
    return this.http.get<any>(`${this.baseUrl+endPoint}`, options);
  }
  
  /**
  * Generic POST request
  * @param endpoint - API endpoint
  * @param body - Request body
  * @param headers - Optional headers
  * @returns Observable of type T
  */
  
  post(endpoint: string, body: any, headers?: HttpHeaders): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }
  
  /**
  * Generic PUT request
  * @param endpoint - API endpoint (include ID if needed)
  * @param body - Request body
  * @param headers - Optional headers
  * @returns Observable of type T
  */
  put(endpoint: string, body: any, headers?: HttpHeaders): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }
  
  /**
  * Generic PATCH request
  * @param endpoint - API endpoint (include ID if needed)
  * @param body - Request body
  * @param headers - Optional headers
  * @returns Observable of type T
  */
  patch(endpoint: string, body: any, headers?: HttpHeaders): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }
  
  /**
  * Generic DELETE request
  * @param endpoint - API endpoint (include ID if needed)
  * @param headers - Optional headers
  * @returns Observable of any (can be customized to return specific type)
  */
  delete(endpoint: string, headers?: HttpHeaders): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers });
  }
  
  /**
  * Generic GET request with full response (including headers, status, etc.)
  * @param endpoint - API endpoint
  * @param params - Optional query parameters
  * @param headers - Optional headers
  * @returns Observable of full HttpResponse<T>
  */
  getWithFullResponse(endpoint: string, params?: any, headers?: HttpHeaders): Observable<HttpResponse<any>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    
    const options = {
      params: httpParams,
      headers: headers,
      observe: 'response' as const
    };
    
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`, options);
  }
}
