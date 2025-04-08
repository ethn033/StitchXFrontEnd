import { Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomerCreateComponent } from '../dialogs/customer-create/customer-create.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TruncatePipe } from '../../pipe/truncate.pipe';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Customer } from '../../models/customer-model';
import { CustomerService } from '../../services/customer.service';
import { ViewCustomerComponent } from '../dialogs/view-customer/view-customer.component';
import { TakeOrderComponent } from '../dialogs/take-order/take-order.component';
import { Menu } from 'primeng/menu';
import { addDoc, DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
@Component({
  selector: 'app-customers',
  imports: [CommonModule, ButtonModule, ConfirmDialogModule, TagModule, TruncatePipe, TableModule],
  providers: [DialogService, ConfirmationService, TruncatePipe, MessageService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  @ViewChild('dt') dt!: Table;
  
  customers: Customer[] = [];
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
 
  constructor( ) {
    this.customerService.getCustomersCount().subscribe(count => {
      this.totalCustomersCount = count;
    });
  }

  ngOnInit(): void {

  }

  lastVisible: DocumentSnapshot<DocumentData, DocumentData> | undefined = undefined;
  loadCustomers(event: TableLazyLoadEvent): void {
    
    const first = event.first ?? 0;
    let rows = first + (event.rows ?? 0);
    this.customerService.getCustomers(2, this.lastVisible).subscribe(customers => {
      this.customers = customers;
      if(this.customers.length > 0) {
        // this.lastVisible = customers[customers.length - 1];
      } 
      else {
        this.lastVisible = undefined;
      }
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
    this.dialogService.open(TakeOrderComponent, {
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
