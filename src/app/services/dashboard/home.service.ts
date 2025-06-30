import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customers/customer-model';
import { ApiService } from '../generics/api.service';
import { Order } from '../../models/orders/order-model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  endPoint = environment.api.home;
  apiService: ApiService = inject(ApiService);

  getRecentOrders(limit: number = 10) : Observable<Order[]> {
    return this.apiService.get(this.endPoint.getRecentOrders, { limit });
  }
}
