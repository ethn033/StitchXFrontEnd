import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from "primeng/tabs";
import { RouterModule } from '@angular/router';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { DropDownItem } from '../../contracts/dropdown-item';
import { Order, User } from '../../Dtos/requests/request-dto';
import { ERole } from '../../enums/enums';
import { ApiResponse } from '../../models/base-response';
import { ShareDataService } from '../../services/shared/share-data.service';
import { validateCurrentRole, valdiateRoles, dateFilterValues, normalizeError, orderStatusFilterValue } from '../../utils/utils';
import { LoadingService } from '../../services/generics/loading.service';
import { OrdersResponse } from '../../Dtos/requests/response-dto';
import { ViewCustomerComponent } from '../users/view-user/view-user.component';
import { OrderService } from '../../services/orders/order.service';
import { OrderCreateComponent } from './dialogs/orderCreate/orderCreate.component';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TruncatePipe, TabsModule, RouterModule],
  providers: [DialogService, ConfirmationService],
})
export class OrderComponent implements OnInit {
  private sds = inject(ShareDataService);
  userResponse?: User | null;
  roles = ERole;
  currentRole?: ERole | null;
  users: Order[] = [];
  orderStatuses: DropDownItem[] = orderStatusFilterValue();
  selectedCustomerStatus: DropDownItem = this.orderStatuses[0];
  dateRange: Date[] = [moment().subtract(1, 'month').toDate(), moment().toDate()]; // Default to last week
  dateRanges = dateFilterValues();
  selectedDateFilter: DropDownItem = this.dateRanges[1]; // Default to 'This Week'
  
  dialogService: DialogService = inject(DialogService);
  os: OrderService = inject(OrderService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  totalOrdersCount: number = 0;
  loadingService: LoadingService = inject(LoadingService);
  
  
  constructor() {
    this.sds.userData.subscribe(userData => {
      this.userResponse = userData as User;
      this.currentRole = validateCurrentRole(this.userResponse.roles!);
    });
  }
  
  ngOnInit(): void {
  }
  
  searchStr: string = '';
  first: number= 0;
  rows: number= 10;
  pageNumber: number = 0;
  pageSize: number = 10;
  loadOrders(event?: TableLazyLoadEvent): void {
    
    this.loadingService.show();
    this.first = event?.first ?? this.first;
    this.rows = event?.rows ?? this.rows;
    
    this.pageNumber = Math.floor(this.first / this.rows);
    this.pageSize = this.rows;
    
    let payload = {
      page: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchStr,
      status: this.selectedCustomerStatus.id,
      startDate: this.dateRange.length > 0 ? moment(this.dateRange[0]).toISOString() : '',
      endDate: (this.dateRange.length > 0 && this.dateRange[1] != null) ? moment(this.dateRange[1]).toISOString() : '',
      customerId: 0 // populate this for customer
    };
    
    this.os.getOrders<ApiResponse<OrdersResponse>>(payload).subscribe({
      next: (data: any) => {
        
        this.loadingService.hide();
        let usersResp = data as ApiResponse<OrdersResponse>;
        this.users = usersResp.data.users;
        this.totalOrdersCount = usersResp.data.totalCount;
      },
      error: (error: any) => {
        this.loadingService.hide();
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load customers.' });
      }
    });
  }
  
  showCustomDateRangeDialog: boolean = false;
  onDateFilterChanged($event: any) {
    if (this.selectedDateFilter.id === 8) {
      this.showCustomDateRangeDialog = true;
    } else {
      const todayDate = moment().toDate();
      switch (this.selectedDateFilter.id) {
        case 1: // Today
        this.dateRange = [moment().startOf('day').toDate(), todayDate];
        break;
        case 2: // This Week
        this.dateRange = [moment().startOf('week').toDate(), todayDate];
        break;
        case 3: // Last Week
        this.dateRange = [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()];
        break;
        case 4: // This Month
        this.dateRange = [moment().startOf('month').toDate(), todayDate];
        break;
        case 5: // Last Month
        this.dateRange = [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()];
        break;
        case 6: // This Year
        this.dateRange = [moment().startOf('year').toDate(), todayDate];
        break;
        case 7: // Last Year
        this.dateRange = [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()];
        break;
        case 9: // All Time
        this.dateRange = [];
        break;
      }
    }
    
    this.loadOrders();
  }
  
  
  
  filterCustomers(type: string): void {
    // Implement your filtering logic here
    // This would filter the customers array based on the selected filter
  }
  
  
  viewOrder(order: Order): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `Customer Details - ${order} ${order}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { order, viewMode: true }
    });
  }
  
  addUpdateOrderDialog(user?: User): void {
    const ref = this.dialogService.open(OrderCreateComponent, {
      header: 'Add New Order',
      width: '70%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      draggable: true,
      closable: true,
      closeOnEscape: false,
      data: {user: user },
      
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadOrders();
      }
    });
  }
  
  takeOrder(order: Order): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `New Order - ${order} ${order}`,
      width: '90%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { order }
    });
  }
  
  
  confirmDelete(order: Order): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${order} ${order}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.os.deleteOrder<ApiResponse<any>>(order.id!).subscribe({
          next: (response: any) => {
            let resp = response as ApiResponse<any>;
            if(resp.isSuccess && resp.statusCode == 200){
              this.messageService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: resp.message });
              this.loadOrders();
            }
          },
          error: (err: any) => {
            let er = normalizeError(err);
            this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: er.message});
          }
        });
      }
    });
  }
}