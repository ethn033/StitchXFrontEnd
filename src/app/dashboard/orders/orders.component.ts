import { Order } from '../../models/orders/order-model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OrdersService } from '../../services/orders.service';
import { LoadingService } from '../../services/loading.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ViewOrderComponent } from './dialogs/view-order/view-order.component';
import { CreateOrderComponent } from './dialogs/create-order/create-order.component';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, ButtonModule, ConfirmDialogModule, TagModule, TruncatePipe, TableModule, TooltipModule],
  providers: [DialogService, ConfirmationService, TruncatePipe, MessageService],
})
export class OrderComponent implements OnInit {
    
  orders: Order[] = [];
  dialogService: DialogService = inject(DialogService);
  orderService: OrdersService = inject(OrdersService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  totalOrdersCount: number = 0;
  loadingService: LoadingService = inject(LoadingService);
  
  ngOnInit(): void {
    this.refresh();
  }
  
  refresh() {
    this.loadOrders();
  }

  loadOrders(event?: TableLazyLoadEvent): void {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.totalOrdersCount = this.orders.length;
    });
  }
  
  deleteCustomer(id: string): void {
    // this.customerService.deleteCustomer(id).then(() => {
    //   this.loadCustomers();
    // });
  }
  
  
  
  filterCustomers(type: string): void {
    // Implement your filtering logic here
    // This would filter the customers array based on the selected filter
  }
  
  
  viewCustomer(order: Order): void {
    this.dialogService.open(ViewOrderComponent, {
      header: `Customer Details - ${order.customerId} ${order.amountPaid}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { order, viewMode: true }
    });
  }
  
  
  editCustomer(order: Order): void {
    const ref = this.dialogService.open(CreateOrderComponent, {
      header: `Edit Customer - ${order.customerId} ${order.amountPaid}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      closeOnEscape: true,
      data: { order }
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        // this.loadCustomers();
      }
    });
  }
  
  showNewCustomerDialog(): void {
    const ref = this.dialogService.open(CreateOrderComponent, {
      header: 'Add New Customer',
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      closeOnEscape: true,
      data: {}
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        // Refresh customer list or show success message
      }
    });
  }
  
  takeOrder(order: Order): void {
    this.dialogService.open(CreateOrderComponent, {
      header: `New Order - ${order.amountPaid} ${order.amountPaid}`,
      width: '90%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { order }
    });
  }
  
  
  confirmDelete(order: Order): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${order.amountPaid} ${order.amountPaid}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.deleteCustomer(customer);
      }
    });
  }
}