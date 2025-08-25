import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { environment } from '../../../environments/environment';
import { Order } from '../../Dtos/requests/request-dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService{
  private endpoint = environment.api.order.controller;

  createOrder<T>(payload: Order): Observable<ApiResponse<T>> {
    return this.post(this.endpoint + environment.api.order.enpoints.GetAllOrders, payload);
  }

  updateOrderStatus<T>(id: number, payload: Order): Observable<ApiResponse<T>> {
    return this.put(this.endpoint + environment.api.auth.enpoints.UpdateUser+'/'+ id, payload);
  }

  getOrders<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.order.enpoints.GetAllOrders, payload);
  }

  deleteOrder<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.endpoint + environment.api.auth.enpoints.DeleteUser+'/'+id);
  }
}
