import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer-model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private firestore: Firestore = inject(Firestore);
  private customersCollection = collection(this.firestore, 'customers');

  constructor() {
    // Add a test customer
    const testCustomer: Customer = {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      measurements: {
        chest: 40,
        waist: 32,
        hips: 38
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addDoc(this.customersCollection, testCustomer)
      .then(docRef => {
        console.log('Test customer added with ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error adding test customer: ', error);
      });
  }

  getCustomers(): Observable<Customer[]> {
    return collectionData(this.customersCollection, { idField: 'id' }) as Observable<Customer[]>;
  }
}
