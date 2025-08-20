import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderService } from '../../../../services/orders/order.service';
import { CustomersService } from '../../../../services/customers/customers.service';
import { ApiResponse } from '../../../../models/base-response';
import { User } from '../../../../Dtos/requests/request-dto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-orderCreate',
  templateUrl: './orderCreate.component.html',
  imports: [CommonModule, DialogModule],
  styleUrls: ['./orderCreate.component.css']
})
export class OrderCreateComponent implements OnInit {
  loading = false;
  private config = inject(DynamicDialogConfig);
  private os = inject(OrderService);
  ms: MessageService = inject(MessageService);
  private cs = inject(CustomersService);
  ref = inject(DynamicDialogRef);
  businessId: number = this.config.data?.data?.businessId;
  customerId: number = this.config.data?.data?.customerId;
  branchId: number = this.config.data?.data?.branchId;
  isValidId = false;
  
  constructor() {

    debugger
    let d = this.config.data
    if (!this.businessId || !this.branchId) {
      this.isValidId = true;
      console.error('Invalid or missing order ID');
    }
    
    if(this.customerId) {
      console.log('get customer by id = '+this.customerId);
    }
  }
  
  ngOnInit() { }
  
  customer?: User | null;
  getCustomerById() {
    if(!this.customerId) return;
    this.loading = true;
    this.cs.getUserById<ApiResponse<User>>(this.customerId).subscribe({
      next: (data: any) => {
        this.loading = false;
        let usersResp = data as ApiResponse<User>;
        this.customer = usersResp.data;
      },
      error: (err: any) => {
        this.loading = false;
        this.ms.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load customer.' });
      }
    });
  }
  
  onCancel(): void {
    this.ref.close(false);
  }
}
