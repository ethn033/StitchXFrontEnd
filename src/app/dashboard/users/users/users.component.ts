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
import { dateFilterValues, entityStatuses, normalizeError, userRolesFilterValue, valdiateRoles, validateCurrentRole } from '../../../utils/utils';
import { LoadingService } from '../../../services/generics/loading.service';
import { ViewCustomerComponent } from '../view-user/view-user.component';
import { TruncatePipe } from '../../../pipe/truncate.pipe';
import { UsersService } from '../../../services/client/users.service';
import { ApiResponse } from '../../../models/base-response';
import { ERole } from '../../../enums/enums';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { UserCreateComponent } from '../create-user/user-create.component';
import { User } from '../../../Dtos/requests/request-dto';
import { UsersResponse } from '../../../Dtos/requests/response-dto';
import { TabsModule } from "primeng/tabs";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-users',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TruncatePipe, TabsModule, RouterModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private sds = inject(ShareDataService);
  userResponse?: User | null;
  roles = ERole;
  currentRole?: ERole | null;
  users: User[] = [];
  userStatuses: DropDownItem[] = entityStatuses();
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
  totalUsersCount: number = 0;
  loadingService: LoadingService = inject(LoadingService);
  
  
  constructor() {
    this.sds.userData.subscribe(userData => {
      this.userResponse = userData as User;
      this.currentRole = validateCurrentRole(this.userResponse.roles!);
      this.userRolesItems = valdiateRoles(this.userRolesItems, this.currentRole);
    });
  }
  
  ngOnInit(): void {
  }
  
  searchStr: string = '';
  first: number= 0;
  rows: number= 10;
  pageNumber: number = 0;
  pageSize: number = 10;
  loadUsers(event?: TableLazyLoadEvent): void {
    
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
      role: this.selectedRole?.id ?? ERole.ALL,
      startDate: this.dateRange.length > 0 ? moment(this.dateRange[0]).toISOString() : '',
      endDate: (this.dateRange.length > 0 && this.dateRange[1] != null) ? moment(this.dateRange[1]).toISOString() : '',
    };
    
    this.us.getUsers<ApiResponse<UsersResponse>>(payload).subscribe({
      next: (data: any) => {
        
        this.loadingService.hide();
        let usersResp = data as ApiResponse<UsersResponse>;
        this.users = usersResp.data.users;
        this.totalUsersCount = usersResp.data.totalCount;
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
    
    this.loadUsers();
  }
  
  
  
  filterCustomers(type: string): void {
    // Implement your filtering logic here
    // This would filter the customers array based on the selected filter
  }
  
  
  viewCustomer(user: User): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `Customer Details - ${user.firstName} ${user.lastName}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { user, viewMode: true }
    });
  }
  
  addUpdateUserDialog(user?: User): void {
    const ref = this.dialogService.open(UserCreateComponent, {
      header: 'Register User',
      width: '70%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      closeOnEscape: false,
      data: {user: user }
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }
  
  takeOrder(user: User): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `New Order - ${user?.firstName} ${user.lastName}`,
      width: '90%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { user }
    });
  }
  
  
  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user?.lastName}?`,
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
        this.us.deleteUser<ApiResponse<any>>(user.id!).subscribe({
          next: (response: any) => {
            let resp = response as ApiResponse<any>;
            if(resp.isSuccess && resp.statusCode == 200){
              this.messageService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: 'User has been deleted.' });
              this.loadUsers();
            }
          },
          error: (err: any) => {
            let er = normalizeError(err);
            this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: er?.message});
          }
        });
      }
    });
  }
  
}