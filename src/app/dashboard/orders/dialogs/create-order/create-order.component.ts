import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-create-order',
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, InputNumberModule],
  providers: [MessageService],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {
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
      // const customerData: CreateOrderRequestDto = {
      //   firstName: formValue.firstName,
      //   lastName: formValue.lastName,
      //   phoneNumber: formValue.phone || undefined,
      //   email: formValue.email || undefined,
      //   address: formValue.address || undefined,
      //   city: formValue.city || undefined,
      // };

      if (this.config.data?.customer?.customerId) {
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
