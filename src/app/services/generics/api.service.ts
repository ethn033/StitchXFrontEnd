import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  protected http: HttpClient = inject(HttpClient);
  baseUrl: string = environment.api.baseUrl;
  
  /**
  * Generic GET request
  * @param endpoint - API endpoint (e.g., 'users')
  * @param params - Optional query parameters
  * @param headers - Optional headers
  * @returns Observable of type T or T[]
  */
  protected get<T>(endPoint: string, params?: any, headers?: any) : Observable<ApiResponse<T>> {
   
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
    
    return this.http.get<ApiResponse<T>>(`${this.baseUrl+endPoint}`, options);
  }
  
  /**
  * Generic POST request
  * @param endpoint - API endpoint
  * @param body - Request body
  * @param headers - Optional headers
  * @returns Observable of type T
  */
  protected post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, { headers });
  }
  
  /**
  * Generic PUT request
  * @param endpoint - API endpoint (include ID if needed)
  * @param body - Request body
  * @param headers - Optional headers
  * @returns Observable of type T
  */
  protected put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, { headers });
  }
  
  /**
  * Generic PATCH request
  * @param endpoint - API endpoint (include ID if needed)
  * @param body - Request body
  * @param headers - Optional headers
  * @returns Observable of type T
  */
  protected patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, { headers });
  }
  
  /**
  * Generic DELETE request
  * @param endpoint - API endpoint (include ID if needed)
  * @param headers - Optional headers
  * @returns Observable of any (can be customized to return specific type)
  */
  protected delete<T>(endpoint: string, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { headers });
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
