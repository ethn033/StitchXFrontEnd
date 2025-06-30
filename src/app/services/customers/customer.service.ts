import { inject, Injectable, OnInit } from '@angular/core';
import { Customer } from '../../models/customers/customer-model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../generics/api.service';

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
