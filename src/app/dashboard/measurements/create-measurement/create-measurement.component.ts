import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MeasurementService } from '../../../services/measurements/measurement.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SuitType, User } from '../../../Dtos/requests/request-dto';
import { UsersService } from '../../../services/client/users.service';
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { ApiResponse } from '../../../models/base-response';
import { CustomerResponse, UsersResponse } from '../../../Dtos/requests/response-dto';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomersService } from '../../../services/customers/customers.service';

@Component({
  selector: 'app-create-measurement',
  templateUrl: './create-measurement.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectModule, ButtonModule, AutoCompleteModule],
  providers: [MessageService],
  styleUrls: ['./create-measurement.component.css']
})
export class CreateMeasurementComponent implements OnInit {
  mss = inject(MeasurementService);
  ref = inject(DynamicDialogRef); 
  cs = inject(CustomersService);
  sts = inject(SuitTypeService);
  ms = inject(MessageService);
  fb = inject(FormBuilder);
  
  measurementForm: FormGroup;
  loading = false;
  
  filteredUsers: User[] = [];
  filteredSuitTypes : SuitType[] = [];
  
  constructor() {
    this.measurementForm = this.fb.group({
      applicationUserId: ['', Validators.required],
      suitTypeId: ['', Validators.required],
    });
  }
  
  ngOnInit() {
  }
  
  filterUsers(event: any): void {
    const query = event.query;
    this.cs.getCustomers<ApiResponse<CustomerResponse>>({ search: query }).subscribe({
      next: (response: any) => {
        if(response && response.statusCode == HttpStatusCode.Ok) {
          let res = response as ApiResponse<CustomerResponse> || [];
          this.filteredUsers = res.data.customers as User[] || [];
        }
      },
      error: (err) => {
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
  
  filterSuitTypes(event: any): void {
    const query = event.query;
    this.sts.getSuitTypes<ApiResponse<SuitType>>({ search: query }).subscribe({
      next: (response: any) => {
        if(response && response.statusCode == HttpStatusCode.Ok) {
          debugger
          let res = response as ApiResponse<SuitType> || [];
          this.filteredUsers = res.data as SuitType[] || [];
        }
      },
      error: (err) => {
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
  
  selectedUser: User | null = null; 
  onUserSelect(user: any): void {
    this.selectedUser = user.value;
    this.measurementForm.patchValue({
      applicationUserId: user.id
    });
  }
  
  onSuitTypeSelect(suitType: any): void {
    this.measurementForm.patchValue({
      suitTypeId: suitType.id
    });
  }
  
  onCancel(): void {
    this.measurementForm.reset();
    this.ref.close();
  }
  
  onSubmit(): void {
    this.measurementForm.markAllAsTouched();
    if (!this.measurementForm.valid) {
      return;
    }
    
    this.loading = true;
    
    this.mss.createMeasurement<any>(this.measurementForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        
      },
      error: (err) => {
        this.loading = false;
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
  
  
  
}
