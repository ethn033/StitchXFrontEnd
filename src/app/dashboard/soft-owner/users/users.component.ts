import { UserDto } from './../../../Dtos/responses/UsersResponse';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { dateFilterValues, userRolesFilterValue, userStatusesFilterValues } from '../../../utils/utils';
import { LoadingService } from '../../../services/generics/loading.service';
import { LoginResponse } from '../../../Dtos/responses/loginResponseDto';
import { ViewCustomerComponent } from '../../customers/dialogs/view-customer/view-customer.component';
import { UserCreateComponent } from '../../customers/dialogs/customer-create/user-create.component';
import { TruncatePipe } from '../../../pipe/truncate.pipe';
import { UsersResponse } from '../../../Dtos/responses/UsersResponse';
import { UsersService } from '../../../services/client/users.service';
import { ApiResponse } from '../../../models/base-response';
import { ERole } from '../../../enums/enums';
@Component({
  selector: 'app-users',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TruncatePipe],
  providers: [DialogService, ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  users: UserDto[] = [];
  userStatuses: DropDownItem[] = userStatusesFilterValues();
  selectedCustomerStatus: DropDownItem = this.userStatuses[0];
  userRolesItems: DropDownItem[] = userRolesFilterValue();
  selectedRole?: DropDownItem = this.userRolesItems[0];
  dateRange: Date[] = [moment().subtract(1, 'month').toDate(), moment().toDate()]; // Default to last week
  dateRanges = dateFilterValues();
  selectedDateFilter: DropDownItem = this.dateRanges[1]; // Default to 'This Week'
  
  // Removed invalid instantiation of Customer, as it is only a type
  filterItems: MenuItem[] = [
    { label: 'All Customers', icon: 'pi pi-users', command: () => this.filterCustomers('all') },
    { label: 'With Orders', icon: 'pi pi-shopping-bag', command: () => this.filterCustomers('withOrders') },
    { label: 'Pending Orders', icon: 'pi pi-clock', command: () => this.filterCustomers('pending') },
    { label: 'With Balance', icon: 'pi pi-money-bill', command: () => this.filterCustomers('outstanding') }
  ];
  
  dialogService: DialogService = inject(DialogService);
  us: UsersService = inject(UsersService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  totalCustomersCount: number = 0;
  loadingService: LoadingService = inject(LoadingService);
  
  ngOnInit(): void {

  }
  
  loadUsers(event?: TableLazyLoadEvent): void {
    this.loadingService.show();

    let payload = {
      page: 1,
      pageSize: 20,
      search: "",
      status: this.selectedCustomerStatus.id == 1 ? true : false,
      role: this.selectedRole?.id ?? ERole.ALL,
      startDate: moment(this.dateRange[0]).format('YYYY-MM-DD'),
      endDate: moment(this.dateRange[1]).format('YYYY-MM-DD'),
    };

    debugger
    this.us.getUsers<ApiResponse<UsersResponse>>(payload).subscribe({
      next: (data: any) => {
        this.loadingService.hide();
        let usersResp = data as ApiResponse<UsersResponse>;
        this.users = usersResp.data.users;
        this.totalCustomersCount = this.users.length;
      },
      error: (error: any) => {
        this.loadingService.hide();
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load customers.' });
      }
    });
  }
  
  showCustomDateRangeDialog: boolean = false;
  onDateFilterChanged($event: any) {
    if (this.selectedDateFilter.id === 7) {
      this.showCustomDateRangeDialog = true;
    } else {
      const todayDate = moment().toDate();
      switch (this.selectedDateFilter.id) {
        case 1: // This Week
        this.dateRange = [moment().startOf('week').toDate(), todayDate];
        break;
        case 2: // This Month
        this.dateRange = [moment().startOf('month').toDate(), todayDate];
        break;
        case 3: // Last Month
        this.dateRange = [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()];
        break;
        case 4: // This Year
        this.dateRange = [moment().startOf('year').toDate(), todayDate];
        break;
        case 5: // Last Year
        this.dateRange = [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()];
        break;
        case 6: // All Time
        this.dateRange = [];
        break;
      }
    }

    this.loadUsers();
  }
  
  deleteCustomer(id: number): void {
    this.us.deleteUser<ApiResponse<any>>(id).subscribe({
      next: (response: any) => {
        let resp = response as ApiResponse<any>;
        if(resp.isSuccess && resp.statusCode == 200){
          this.messageService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: 'User has been deleted suc.' });
        }
      },
      error: (err: any) => {
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to delete user.'});
      }
    });
  }
  
  
  
  filterCustomers(type: string): void {
    // Implement your filtering logic here
    // This would filter the customers array based on the selected filter
  }
  
  
  viewCustomer(customer: LoginResponse): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `Customer Details - ${customer.user.firstName} ${customer.user.lastName}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { customer, viewMode: true }
    });
  }
  
  
  editCustomer(customer: LoginResponse): void {
    const ref = this.dialogService.open(UserCreateComponent, {
      header: `Edit Customer - ${customer.user.firstName} ${customer.user.lastName}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      closeOnEscape: true,
      data: { customer }
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        // this.loadCustomers();
      }
    });
  }
  
  addUserDialog(): void {
    const ref = this.dialogService.open(UserCreateComponent, {
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
  
  takeOrder(customer: LoginResponse): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `New Order - ${customer.user.firstName} ${customer.user.lastName}`,
      width: '90%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { customer }
    });
  }
  
  
  confirmDelete(customer: LoginResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.user.firstName} ${customer.user.lastName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.deleteCustomer(customer);
      }
    });
  }
  
}