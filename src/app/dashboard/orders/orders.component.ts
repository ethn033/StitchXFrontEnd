// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-orders',
//   imports: [],
//   templateUrl: './orders.component.html',
//   styleUrl: './orders.component.css'
// })
// export class OrdersComponent implements OnInit{
//   ngOnInit(): void {
//     console.log('Orders component initialized');
    
//   }


// }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    AppComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
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