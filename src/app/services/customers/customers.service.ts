import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/base-response';
import { Observable } from 'rxjs';
import { User } from '../../Dtos/requests/request-dto';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends ApiService {
  private endpoint = environment.api.customer.controller;
  
  constructor() {
    super();
  }
  
  
  createCustomer<T>(payload: User): Observable<ApiResponse<T>> {
    return this.post(this.endpoint + environment.api.customer.enpoints.GetCustomerById, payload);
  }

  getUserById<T>(id: number): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.customer.enpoints.GetCustomerById+'/'+id);
  }
  
  updateUsers<T>(id: number, payload: User): Observable<ApiResponse<T>> {
    return this.put(this.endpoint + environment.api.auth.enpoints.UpdateUser+'/'+ id, payload);
  }
  
  getCustomers<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.customer.enpoints.GetCustomers, payload);
  }
  
  deleteUser<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.endpoint + environment.api.auth.enpoints.DeleteUser+'/'+id);
  }
  
}
