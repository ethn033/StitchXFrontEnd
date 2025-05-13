import { inject, Injectable, OnInit } from '@angular/core';
import { Customer } from '../models/customer-model';
import { from, map, Observable, take } from 'rxjs';
import { addDoc, collection, collectionData, doc, docData, DocumentSnapshot, Firestore, getDocs, limit, orderBy, query, QuerySnapshot, startAfter, Timestamp } from '@angular/fire/firestore';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  endPoint = environment.api.customer;
  apiService: ApiService = inject(ApiService);

  getCustomers() : Observable<Customer[]> {
    return this.apiService.get(this.endPoint.getAll);
  }

}
