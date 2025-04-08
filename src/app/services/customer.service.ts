import { inject, Injectable } from '@angular/core';
import { Customer } from '../models/customer-model';
import { from, map, Observable } from 'rxjs';
import { addDoc, collection, collectionData, doc, docData, DocumentSnapshot, Firestore, getDocs, limit, orderBy, query, startAfter, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
 
  
  private customersRef: any;
  constructor(private firestore: Firestore) {
    this.customersRef = collection(this.firestore, 'customers');
  }

  getCustomersCount(): Observable<number> {
    const querySnapshotPromise = getDocs(this.customersRef);
    return from(querySnapshotPromise).pipe(
      map(querySnapshot => querySnapshot.size)
    );
  }

  getCustomers(pageSize: number, lastVisible?: DocumentSnapshot): Observable<Customer[]> {
    let customersQuery;
    if(lastVisible) {
      customersQuery = query(
        this.customersRef,
        orderBy('createdAt'),
        limit(pageSize),
        startAfter(lastVisible)
      );
    }
    else {
      customersQuery = query(
        this.customersRef,
        orderBy('createdAt'),
        limit(pageSize)
      );
    }

    return collectionData(customersQuery) as Observable<Customer[]>;
  }

  getCustomer(id: string): Observable<Customer | undefined> {
    const customerDoc = doc(this.firestore, `customers/${id}`);
    return docData(customerDoc) as Observable<Customer | undefined>;
  }

}
