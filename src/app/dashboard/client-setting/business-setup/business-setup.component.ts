import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { ApiResponse } from '../../../models/base-response';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { APP_USER } from '../../../utils/global-contstants';
import { BusinessService } from '../../../services/business/business.service';
import { MessageService } from 'primeng/api';
import { Business, User } from '../../../Dtos/requests/request-dto';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-business-setup',
  imports: [CommonModule, ReactiveFormsModule, Button, Card],
  templateUrl: './business-setup.component.html',
  styleUrl: './business-setup.component.css'
})
export class BusinessSetupComponent {
 @Input() businessOwnerId: number | null = null;

  isLoading = false;
  private ms = inject(MessageService);
  fb = inject(FormBuilder);
  private readonly bs = inject(BusinessService);
  private readonly sds = inject(ShareDataService);
  private router = inject(Router);
  private ls = inject(LocalStorageService);
  businessForm!: FormGroup;
  userResponse? : User;
  route = inject(ActivatedRoute);


  constructor() {

    
    this.userResponse = this.ls.getItem(APP_USER, true) as User;
    if(!this.userResponse) {
      this.router.navigate(['auth'], { replaceUrl: true });
      return;
    }
    this.sds.setUserResponse(this.userResponse);

    // if input shop owner id is null, assign route owner if there
    this.route.params.subscribe((params: any) => {
      const businessOwnerIdParam = params?.['businessOwnerId?'] || null;
      
      if(!this.businessOwnerId && businessOwnerIdParam) {
        this.businessOwnerId = Number(businessOwnerIdParam);
      }

      if(!this.businessOwnerId) {
        this.businessOwnerId = this.sds.currentUserId();
      }

      if(this.sds.isBusinessExists()) {
        this.router.navigate(['clint-setup/create-branch'], { replaceUrl: true });
      }
      this.initForm();

    });

  }
  
  initForm() {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.maxLength(100)]],
      applicationUserId: [this.businessOwnerId, Validators.required],
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
    let request: Business = {
      ...this.businessForm.value
    };
    
    this.isLoading = true;
    this.bs.createBusiness(request).subscribe({
      next: (data: any) => {
        debugger
        let resp = data as ApiResponse<any>;
        if(resp.statusCode == HttpStatusCode.Created && resp.isSuccess) {
          let userData = this.sds.currentUser as User;

          if(userData) {
            userData.business = resp.data as Business;
            this.ls.setItem(APP_USER, userData, true);
          }
          this.router.navigate(['clint-setup', 'create-branch', userData.business?.id], { replaceUrl: true });
        }
        this.isLoading = false;
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
