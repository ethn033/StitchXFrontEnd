import { SuitType } from './../../../Dtos/requests/request-dto';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../../models/base-response';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { LoadingService } from '../../../services/generics/loading.service';

@Component({
  selector: 'app-create-suit-type',
  templateUrl: './create-suit-type.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, InputText, InputNumberModule],
  providers: [],
  styleUrls: ['./create-suit-type.component.css']
})
export class CreateSuitTypeComponent implements OnInit {
  ref = inject(DynamicDialogRef); 
  config = inject(DynamicDialogConfig);
  sts = inject(SuitTypeService);
  ms = inject(MessageService);
  ls = inject(LoadingService);
  fb: FormBuilder = inject(FormBuilder);
  
  businessId = this.config.data?.businessId || null;
  createdByUserId = this.config.data?.user?.id || null;
  suitType: SuitType = this.config.data.suitType || null;
  isUpdateScreen = !!this.suitType;
  loading = false;
  productForm!: FormGroup;
  

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required], // optional
      description: ['', [Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0.01)]]
    });

    if(this.isUpdateScreen) {
      this.productForm.patchValue({
        ...this.suitType
      });
    }
      
  }
  
  ngOnInit() {
    
  }
  
  
  
  onSubmit() {
    
    this.productForm.markAllAsTouched();
    if (!this.productForm.valid) {
      return;
    }
    
    const request: SuitType =  !this.isUpdateScreen ? {
      businessId: this.businessId,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      createdByUserId: this.createdByUserId
    } : {
      id: this.suitType.id,
      businessId: this.businessId,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
    }
    
    this.ls.setLoading(true);
    this.loading = true;

    const call = this.isUpdateScreen ? this.sts.updateSuitType<ApiResponse<SuitType>>(this.suitType.id!, request) : this.sts.createSuitType<ApiResponse<SuitType>>(request);
    
    call.subscribe({
      next: (response) => {
        this.loading = false;
        if(response.statusCode == HttpStatusCode.Created || response.statusCode == HttpStatusCode.Ok && response.isSuccess) {
          this.ms.add({ key: 'global-toast', severity: 'success', summary: 'Success', detail: response.message });
          this.ref.close(response);
          return;
        }        
        this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: response.message });
      },
      error: (error) => {
        this.loading = false;
        if(error instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: error.error.message });
        }
      },
      complete: () => {
        this.ls.setLoading(false);
      }
    });
  }
  
  onCancel() {
    this.productForm.reset();
    this.ref.close(null);
  }
  
}
