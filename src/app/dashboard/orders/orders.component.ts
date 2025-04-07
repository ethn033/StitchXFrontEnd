import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{
  ngOnInit(): void {
    console.log('Orders component initialized');
    
  }


}
