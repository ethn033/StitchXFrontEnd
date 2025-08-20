import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-orderCreate',
  templateUrl: './orderCreate.component.html',
  imports: [CommonModule, DialogModule],
  styleUrls: ['./orderCreate.component.css']
})
export class OrderCreateComponent implements OnInit {
  loading = false;
  private config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  businessId: number = this.config.data?.businessId;
  customerId: number = this.config.data?.customerId;
  branchId: number = this.config.data?.branchId;
  isValidId = false;
  
  constructor() {
    if (!this.businessId || !this.branchId || !this.customerId) {
      this.isValidId = true;
      console.error('Invalid or missing order ID');
    }
  }
  
  ngOnInit() {
  }
  
  onCancel(): void {
    this.ref.close(false);
  }
}
