import { BranchCreateUpdateDto, BusinessCreateUpdateDto } from './../../../Dtos/requests/requestDto';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { InputNumber } from 'primeng/inputnumber';
import { ApiResponse } from '../../../models/base-response';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { APP_USER } from '../../../utils/global-contstants';
import { UserResponse } from '../../../Dtos/responses/loginResponseDto';
import { BusinessService } from '../../../services/business/business.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-business-setup',
  imports: [CommonModule, ReactiveFormsModule, Button, Card, InputNumber],
  templateUrl: './business-setup.component.html',
  styleUrl: './business-setup.component.css'
})
export class BusinessSetupComponent {
  
  isLoading = false;
  private ms = inject(MessageService);
  private readonly bs = inject(BusinessService);
  private router = inject(Router);
  private ls = inject(LocalStorageService);
  businessForm!: FormGroup;
  userResponse? : UserResponse;
  
  constructor(private fb: FormBuilder) {
    debugger
    this.userResponse = this.ls.getItem(APP_USER, true) as UserResponse;
    if(!this.userResponse) {
      this.router.navigate(['auth'], { replaceUrl: true });
      return;
    }
    this.initForm();
    
  }
  
  initForm() {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.maxLength(100)]],
      ownerId: [this.userResponse?.id],
      description: ['', Validators.maxLength(500)],
      website: ['']
    });
  }
  
  onSubmit() {
    debugger
    this.businessForm?.markAllAsTouched();
    if (!this.businessForm?.valid)
      return;
    
    // Create the request object using the form value
    let request: BusinessCreateUpdateDto = {
      ...this.businessForm.value // Default value if not set
    };
    
    this.isLoading = true;
    this.bs.createBusiness(request).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        let resp = data as ApiResponse<any>;
        if(resp.statusCode == 200 && resp.isSuccess) {
          this.router.navigate(['admin'], { replaceUrl: true  });
        }
      },
      error: (err: any) => {
        this.ms.add({
          key: 'auth-toast',
          severity: 'error',
          summary: 'Login Failed',
          detail: err instanceof Error ? err.message : 'Failed to login'
        });
        
        this.isLoading = false;
      }
    });
  }
}
