import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomerCreateComponent } from './dialogs/customer-create/customer-create.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CustomerService } from '../../services/customer.service';
import { ViewCustomerComponent } from './dialogs/view-customer/view-customer.component';
import { LoadingService } from '../../services/loading.service';
import { TooltipModule } from 'primeng/tooltip';
import { Customer } from '../../models/customers/customer-model';
@Component({
  selector: 'app-customers',
  imports: [CommonModule, ButtonModule, ConfirmDialogModule, TagModule, TruncatePipe, TableModule, TooltipModule],
  providers: [DialogService, ConfirmationService, TruncatePipe, MessageService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  
  customers: Customer[] = [];

  // Removed invalid instantiation of Customer, as it is only a type
  filterItems: MenuItem[] = [
    { label: 'All Customers', icon: 'pi pi-users', command: () => this.filterCustomers('all') },
    { label: 'With Orders', icon: 'pi pi-shopping-bag', command: () => this.filterCustomers('withOrders') },
    { label: 'Pending Orders', icon: 'pi pi-clock', command: () => this.filterCustomers('pending') },
    { label: 'With Balance', icon: 'pi pi-money-bill', command: () => this.filterCustomers('outstanding') }
  ];
  
  dialogService: DialogService = inject(DialogService);
  customerService: CustomerService = inject(CustomerService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  totalCustomersCount: number = 0;
  loadingService: LoadingService = inject(LoadingService);
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  
  refresh() {
    this.loadCustomers();
  }

  loadCustomers(event?: TableLazyLoadEvent): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.totalCustomersCount = this.customers.length;
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
  
  
  viewCustomer(customer: Customer): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `Customer Details - ${customer.firstName} ${customer.lastName}`,
      width: '90%',
      styleClass: 'customer-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { customer, viewMode: true }
    });
  }
  
  
  editCustomer(customer: Customer): void {
    const ref = this.dialogService.open(CustomerCreateComponent, {
      header: `Edit Customer - ${customer.firstName} ${customer.lastName}`,
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
  
  showNewCustomerDialog(): void {
    const ref = this.dialogService.open(CustomerCreateComponent, {
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
  
  takeOrder(customer: Customer): void {
    this.dialogService.open(ViewCustomerComponent, {
      header: `New Order - ${customer.firstName} ${customer.lastName}`,
      width: '90%',
      styleClass: 'order-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: { customer }
    });
  }
  
  
  confirmDelete(customer: Customer): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.deleteCustomer(customer);
      }
    });
  }
  
}
