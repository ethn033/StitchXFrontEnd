import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingService } from '../../services/generics/loading.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ViewOrderComponent } from './dialogs/view-order/view-order.component';
import { CreateOrderComponent } from './dialogs/create-order/create-order.component';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';
import { DropDownItem } from '../../contracts/dropdown-item';
import { dateFilterValues } from '../../utils/utils';
import { DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { OrderHistoryItemResponseDto, OrderHistoryResponseDto } from '../../Dtos/responses/orderResponseDto';


interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, FormsModule, StepperModule, DialogModule, DatePickerModule, ButtonModule, ConfirmDialogModule, DropdownModule, SelectModule, TagModule, ToolbarModule, CardModule, TableModule, TooltipModule],
  providers: [DialogService, ConfirmationService, TruncatePipe],
})

export class OrderComponent implements OnInit {
  
  orders: OrderHistoryResponseDto[] = [];
  dialogService: DialogService = inject(DialogService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  totalOrdersCount: number = 0;
  loadingService: LoadingService = inject(LoadingService);
  
  // orderStatuses: DropDownItem[] = [
  //   ...Object.keys(OrderStatus)
  //   .filter(key => isNaN(Number(key)))
  //   .map(key => ({
  //     id: OrderStatus[key as keyof typeof OrderStatus],
  //     value: key
  //   }))
  // ];
  
  // selectedOrderStatus: DropDownItem = this.orderStatuses[0]; // Default to 'All Statuses'
  dateRange: Date[] = [moment().subtract(1, 'week').toDate(), moment().toDate()]; // Default to last week
  dateRanges = dateFilterValues();
  selectedDateFilter: DropDownItem = this.dateRanges[0]; // Default to 'This Week'
  
  constructor() {
    
  }
  
  ngOnInit(): void {
    this.refresh();
  }
  
  showCustomDateRangeDialog: boolean = false;
  onDateFilterChanged($event: any) {
    debugger
    if (this.selectedDateFilter.id === 7) { // Custom Range
      this.showCustomDateRangeDialog = true;
    } else {
      const todayDate = moment().toDate();
      switch (this.selectedDateFilter.id) {
        case 1: // This Week
        this.dateRange = [moment().startOf('week').toDate(), todayDate];
        break;
        case 3: // This Month
        this.dateRange = [moment().startOf('month').toDate(), todayDate];
        break;
        case 4: // Last Month
        this.dateRange = [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()];
        break;
        case 5: // This Year
        this.dateRange = [moment().startOf('year').toDate(), todayDate];
        break;
        case 6: // Last Year
        this.dateRange = [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()];
        break;
        case 8: // All Time
        this.dateRange = [];
        break;
      }
      
      this.refresh();
    }
  }
  
  
  refresh() {
    this.loadOrders();
  }
  
  loadOrders(event?: TableLazyLoadEvent): void {
    
    
    // send this.dateRange to the backend if needed
    this.loadingService.show();
    // this.orderService.getOrders().subscribe({
    //   next: (orders: any) => {
    //     this.orders = [...orders, ...orders];
    //     this.totalOrdersCount = this.orders.length;
    //     this.loadingService.hide();
    //   },
    //   error: (error: any) => {
    //     this.loadingService.hide();
    //     this.messageService.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load orders' });
    //   }
    // });
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
  
  
  viewCustomer(order: OrderHistoryItemResponseDto): void {
    this.dialogService.open(ViewOrderComponent, {
      header: `Customer Details - ${order.customerId} ${order.customerId}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { order, viewMode: true }
    });
  }
  
  
  editCustomer(order: OrderHistoryItemResponseDto): void {
    const ref = this.dialogService.open(CreateOrderComponent, {
      header: `Edit Customer - ${order.customerId} ${order.paidAmount}`,
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
  
  takeOrder(order: OrderHistoryItemResponseDto): void {
    this.dialogService.open(CreateOrderComponent, {
      header: `New Order - ${order.paidAmount} ${order.paidAmount}`,
      width: '90%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { order }
    });
  }
  
  
  confirmDelete(order: OrderHistoryItemResponseDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${order.paidAmount} ${order.paidAmount}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingService.show();
        // this.orderService.deleteOrder(order.orderId+'dad').subscribe({
        //   next: () => {
        //     this.loadingService.hide();
        //     this.loadOrders();
        //     this.messageService.add({ key: 'global-toast', severity: 'success', summary: 'Success', detail: 'Order deleted successfully' });
        //   },
        //   error: (error: any) => {
        //     this.loadingService.hide();
        //     this.messageService.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to delete order' });
        //   }
        // });
      },
      reject: () => {
        
      }
    });
  }
}