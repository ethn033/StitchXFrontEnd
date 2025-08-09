import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../services/generics/loading.service';
import { MessageService } from 'primeng/api';
import { EOrderStatus } from '../../enums/enums';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, BadgeModule, CardModule, ButtonModule, TagModule, CheckboxModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  recentOrdersLimit = 10;
  // homeService = inject(HomeService);
  loadingService = inject(LoadingService);
  messageService = inject(MessageService);
  today = new Date();
  metrics = [
    { title: 'Total Orders', value: '156', trend: 'up', change: '12%' },
    { title: 'Active Customers', value: '89', trend: 'up', change: '8%' },
    { title: 'Pending Orders', value: '34', trend: 'down', change: '3%' },
    { title: 'Revenue', value: '$12,450', trend: 'up', change: '15%' }
  ];
  
  
  quickActions = [
    { label: 'New Order', completed: false },
    { label: 'Add Customer', completed: true },
    { label: 'Schedule Fitting', completed: false }
  ];

  constructor() {
    this.getRecentOrders();
  }
  
  getStatusSeverity(status: number): any {
    switch(status) {
      case EOrderStatus.RECEIVED: return 'info';        // Blue - indicates new order
      case EOrderStatus.IN_PROGRESS: return 'warning';  // Orange/Yellow - in progress
      case EOrderStatus.DELIVERED: return 'success';   // Green - successfully completed
      case EOrderStatus.OVER_DUE: return 'danger';      // Red - urgent/attention needed
      default: return 'contrast';                    // Gray - unknown status
    }
  }
  
  
  recentOrders = [];// generateDummyOrders(); //;
  getRecentOrders() {
    // return this.homeService.getRecentOrders(this.recentOrdersLimit).subscribe({
    //   next: (data: any) => {
        
        
    //     this.recentOrders = data;
    //   },
    //   error: (error: any) => {
    //     this.messageService.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to fetch recent orders.' });
    //   }
    // });
  }
}
