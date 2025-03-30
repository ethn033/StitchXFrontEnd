import { inject, Injectable } from '@angular/core';
import { Customer } from '../models/customer-model';
import { from, map, Observable } from 'rxjs';
import { collection, collectionData, doc, docData, Firestore, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  firestore: Firestore = inject(Firestore);
  customersRef = collection(this.firestore, 'customers');

  constructor() {}

  getCustomers(): Observable<Customer[]> {
    const customersRef = collection(this.firestore, 'customers');
    return collectionData(customersRef, { idField: 'id' }) as Observable<Customer[]>;
  }

  getCustomer(id: string): Observable<Customer | undefined> {
    const customerDoc = doc(this.firestore, `customers/${id}`);
    return docData(customerDoc) as Observable<Customer | undefined>;
  }

}
