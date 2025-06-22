import { inject, Injectable, OnInit } from '@angular/core';
import { Customer } from '../models/customers/customer-model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  endPoint = environment.api.customer;
  apiService: ApiService = inject(ApiService);

  getCustomers() : Observable<Customer[]> {
    return this.apiService.get(this.endPoint.enpoint);
  }

}
