import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/base-response';
import { Observable } from 'rxjs';
import { ApiService } from '../generics/api.service';
import { Business } from '../../Dtos/requests/requestDto';

@Injectable({
  providedIn: 'root'
})
export class BusinessService extends ApiService {
  
  private readonly endpoint: string = environment.api.business.controller;
  
  createBusiness<T>(request: Business) : Observable<ApiResponse<T>> {
    return this.post(this.endpoint+environment.api.business.enpoints.CreateBusiness, request);
  }
}
