import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../../models/orders/order-model';
import { ApiService } from '../generics/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  endPoint = environment.api.orders;
  apiService: ApiService = inject(ApiService);

  getOrders() : Observable<Order[]> {
    return this.apiService.get(this.endPoint.endpoint);
  }
  
  deleteOrder(orderId: string) : Observable<Order[]> {
    return this.apiService.delete(`${this.endPoint.endpoint}/${orderId}`);
  }
}
