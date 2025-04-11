import { inject, Injectable, OnInit } from '@angular/core';
import { Customer } from '../models/customer-model';
import { from, map, Observable, take } from 'rxjs';
import { addDoc, collection, collectionData, doc, docData, DocumentSnapshot, Firestore, getDocs, limit, orderBy, query, QuerySnapshot, startAfter, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnInit {
 
  constructor(private firestore: Firestore) {
    
  }

  ngOnInit(): void {
  }

  getCustomersCount(): Observable<number> {
    const customersRef = collection(this.firestore, 'customers');
    const querySnapshotPromise = getDocs(customersRef);
    return from(querySnapshotPromise).pipe(
      map(querySnapshot => querySnapshot.size)
    );
  }

  getCustomers(pageSize: number, lastVisible?: DocumentSnapshot): Observable<Customer[]> {
    const customersRef = collection(this.firestore, 'customers');
    let customersQuery;
    if(lastVisible) {
      customersQuery = query(
        customersRef,
        orderBy('createdAt'),
        limit(pageSize),
        startAfter(lastVisible)
      );
    }
    else {
      customersQuery = query(
        customersRef,
        orderBy('createdAt'),
        limit(pageSize)
      );
    }

    return collectionData(customersQuery).pipe() as Observable<Customer[]>;
  }

  getCustomer(id: string): Observable<Customer | undefined> {
    const customerDoc = doc(this.firestore, `customers/${id}`);
    return docData(customerDoc) as Observable<Customer | undefined>;
  }

}
