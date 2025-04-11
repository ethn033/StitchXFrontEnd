import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule]
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  dressTypes: any[];

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      dressType: [null, Validators.required],
      measurements: ['', Validators.required],
      deliveryDate: [null, Validators.required],
    });

    this.dressTypes = [
      { label: 'Dress', value: 'dress' },
      { label: 'Shirt', value: 'shirt' },
      { label: 'Pants', value: 'pants' },
      { label: 'Skirt', value: 'skirt' },
    ];
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.orderForm.valid) {
      console.log('Order Submitted:', this.orderForm.value);
      // Here, you can add the logic to send the order to your backend
      this.orderForm.reset();
    }
  }
}