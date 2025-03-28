import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-home',
  imports: [CommonModule, CardModule, ChartModule, TableModule, ButtonModule, ProgressBarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ordersChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Orders',
        backgroundColor: '#4CAF50',
        data: [65, 59, 80, 81, 56, 55]
      },
      {
        label: 'Pending Orders',
        backgroundColor: '#FFC107',
        data: [28, 48, 40, 19, 86, 27]
      }
    ]
  };

  // Recent Orders
  recentOrders = [
    { id: '#TB-1001', customer: 'Ali Khan', type: 'Sherwani', due: 'Jun 15', status: 'In Progress' },
    { id: '#TB-1002', customer: 'Fatima Ahmed', type: 'Gown', due: 'Jun 18', status: 'Completed' },
    { id: '#TB-1003', customer: 'Rahul Sharma', type: 'Suit', due: 'Jun 20', status: 'Pending' },
    { id: '#TB-1004', customer: 'Priya Patel', type: 'Lehenga', due: 'Jun 22', status: 'In Progress' }
  ];

  // Quick Actions
  quickActions = [
    { icon: 'pi pi-plus', label: 'New Order', route: '/orders/new' },
    { icon: 'pi pi-users', label: 'Add Customer', route: '/customers/new' },
    { icon: 'pi pi-file', label: 'Generate Report', route: '/reports' },
    { icon: 'pi pi-box', label: 'Inventory', route: '/inventory' }
  ];
}
