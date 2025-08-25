import { BranchCreateUpdateDto } from '../../../Dtos/requests/request-dto';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { InputNumber } from 'primeng/inputnumber';
import { BranchService } from '../../../services/branch/branch.service';
import { ApiResponse } from '../../../models/base-response';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { APP_USER } from '../../../utils/global-contstants';
import { UserResponse } from '../../../Dtos/responses/loginResponseDto';

@Component({
  selector: 'app-branch-setup',
  imports: [CommonModule, ReactiveFormsModule, Button, Card, InputNumber],
  templateUrl: './branch-setup.component.html',
  styleUrl: './branch-setup.component.css'
})
export class BranchSetupComponent {
  private readonly as = inject(BranchService);
  private router = inject(Router);
  private ls = inject(LocalStorageService);
  businessForm!: FormGroup;
  userResponse? : UserResponse;
  
  constructor(private fb: FormBuilder) {
    this.initForm();
    this.userResponse = this.ls.getItem(APP_USER, true) as UserResponse;
    if(!this.userResponse) {
      this.router.navigate(['auth'], { replaceUrl: true });
      return;
    }
    
  }
  
  
  initForm() {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.maxLength(100)]],
      latitude:  [undefined],
      longitude: [undefined],
    });
  }
  
  onSubmit() {
    this.businessForm?.markAllAsTouched();
    if (!this.businessForm?.valid)
      return;
    
    let request: BranchCreateUpdateDto = new {
      ...this.businessForm.value,
      applicationUserId: this.userResponse?.id,
      businessId: this.userResponse?.business.id,
      isActive: true,
      ownerId: this.userResponse?.id
    };

    this.as.createBranch(request).subscribe({
      next: (data: any) => {
        let resp = data as ApiResponse<any>;
        if(resp.statusCode == 200 && resp.isSuccess) {
          this.router.navigate(['admin'], { replaceUrl: true  });
        }
      },
      error: (err: any) => {
        
      }
    });
  }
}
