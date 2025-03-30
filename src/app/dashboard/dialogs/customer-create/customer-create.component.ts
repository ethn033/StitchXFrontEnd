import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MessageService } from 'primeng/api';
import { Customer } from '../../../models/customer-model';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-customer-create',
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, InputNumberModule],
  providers: [MessageService],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})
export class CustomerCreateComponent {
  customerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    // private firestore: AngularFirestore,
    private messageService: MessageService) {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.email]],
      address: ['', [Validators.maxLength(200)]],
      age: ['', [Validators.min(12), Validators.max(120)]],
      chest: [''],
      waist: [''],
      hips: [''],
      sleeveLength: [''],
      inseam: [''],
      notes: ['']
    });

    // If editing an existing customer
    if (this.config.data?.customer) {
      this.customerForm.patchValue(this.config.data.customer);
    }
  }


  ngOnInit(): void {
    
  }


  async onSubmit(): Promise<void> {
    if (this.customerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const formValue = this.customerForm.value;
      const customerData: Customer = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone || undefined,
        email: formValue.email || undefined,
        address: formValue.address || undefined,
        age: formValue.age ? Number(formValue.age) : undefined,
        measurements: {
          chest: formValue.chest ? Number(formValue.chest) : undefined,
          waist: formValue.waist ? Number(formValue.waist) : undefined,
          hips: formValue.hips ? Number(formValue.hips) : undefined,
          sleeveLength: formValue.sleeveLength ? Number(formValue.sleeveLength) : undefined,
          inseam: formValue.inseam ? Number(formValue.inseam) : undefined
        },
        notes: formValue.notes || undefined,
        createdAt: this.config.data?.customer?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (this.config.data?.customer?.id) {
        // Update existing customer
        // await this.firestore.collection('customers').doc(this.config.data.customer.id).update(customerData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer updated successfully'
        });
      } else {
        // Add new customer
        // await this.firestore.collection('customers').add(customerData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer added successfully'
        });
      }

      this.ref.close(true);
    } catch (error) {
      console.error('Error saving customer:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save customer'
      });
    } finally {
      this.loading = false;
    }
  }

  markAllAsTouched(): void {
    Object.values(this.customerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.ref.close(false);
  }
}
