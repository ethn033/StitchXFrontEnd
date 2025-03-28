import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, CheckboxModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  today = new Date();
  metrics = [
    { title: 'Total Orders', value: '156', trend: 'up', change: '12%' },
    { title: 'Active Customers', value: '89', trend: 'up', change: '8%' },
    { title: 'Pending Orders', value: '34', trend: 'down', change: '3%' },
    { title: 'Revenue', value: '$12,450', trend: 'up', change: '15%' }
  ];

  recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', item: 'Suit (2-piece)', status: 'In Progress', dueDate: 'Mar 15, 2024' },
    { id: 'ORD-002', customer: 'Jane Smith', item: 'Evening Dress', status: 'Completed', dueDate: 'Mar 12, 2024' },
    { id: 'ORD-003', customer: 'Mike Johnson', item: 'Shirts (3)', status: 'New', dueDate: 'Mar 20, 2024' }
  ];

  quickActions = [
    { label: 'New Order', completed: false },
    { label: 'Add Customer', completed: true },
    { label: 'Schedule Fitting', completed: false }
  ];

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch(status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warn';  // Changed from 'warning' to 'warn'
      case 'new': return 'info';
      case 'overdue': return 'danger';
      default: return undefined;
    }
  }
}
