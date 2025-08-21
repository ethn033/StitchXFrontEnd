import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../../models/base-response';
import { SuitType } from '../../../Dtos/requests/request-dto';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-create-suit-type',
  templateUrl: './create-suit-type.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, InputText, InputNumberModule],
  styleUrls: ['./create-suit-type.component.css']
})
export class CreateSuitTypeComponent implements OnInit {
  private ref = inject(DynamicDialogRef); 
  private config = inject(DynamicDialogConfig);
  private sts = inject(SuitTypeService);
  private ms = inject(MessageService);
  fb: FormBuilder = inject(FormBuilder);
  productForm!: FormGroup;
  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required], // optional
      description: ['', [Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0.01)]]
    });


    debugger 
    this.config.data = this.config.data || {};
   }
 
  ngOnInit() {
    
  }
  
  businessId?: number | null = this.config.data?.businessId || null;
  createdByUserId = this.config.data?.user?.id || null;
  loading = false;
  onSubmit() {
    debugger
    this.productForm.markAllAsTouched();
    if (!this.productForm.valid) {
      return;
    }
   
    let request = {
      businessId: this.businessId,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      createdByUserId: this.createdByUserId
    }

    this.loading = true;
    this.sts.createSuitType<ApiResponse<SuitType>>(request).subscribe({
      next: (response) => {
        debugger
        this.loading = false;
        if(response.statusCode == HttpStatusCode.Ok && response.isSuccess) {
          
          this.ms.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.ref.close(response);
        }
      },
      error: (error) => {
        this.loading = false;
        this.ms.add({ severity: 'error', summary: 'Error', detail: 'Failed to create suit type.' });
        console.error('Error creating suit type:', error);
      }
    });
  }
  
  onCancel() {
    this.productForm.reset();
    this.ref.close(null);
  }
  
}
