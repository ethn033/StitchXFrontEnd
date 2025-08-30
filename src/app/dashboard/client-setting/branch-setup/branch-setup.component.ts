import { Business } from './../../../Dtos/requests/request-dto';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { InputNumber } from 'primeng/inputnumber';
import { BranchService } from '../../../services/branch/branch.service';
import { ApiResponse } from '../../../models/base-response';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { APP_USER } from '../../../utils/global-contstants';
import { Branch, User } from '../../../Dtos/requests/request-dto';
import { MessageService } from 'primeng/api';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-branch-setup',
  imports: [CommonModule, ReactiveFormsModule, Button, Card, InputNumber],
  templateUrl: './branch-setup.component.html',
  styleUrl: './branch-setup.component.css'
})
export class BranchSetupComponent {
  brs = inject(BranchService);
  branchForm!: FormGroup;
  userResponse? : User;
  
  @Input() businessId: number | null = null;
  
  isLoading = false;
  ms = inject(MessageService);
  fb = inject(FormBuilder);
  sds = inject(ShareDataService);
  router = inject(Router);
  ls = inject(LocalStorageService);
  route = inject(ActivatedRoute);
  
  
  constructor() {
    this.userResponse = this.ls.getItem(APP_USER, true) as User;
    if(!this.userResponse) {
      this.router.navigate(['auth'], { replaceUrl: true });
      return;
    }
    this.sds.setUserResponse(this.userResponse);
    this.route.params.subscribe((params: any) => {
      const bId = params?.['businessId?'] || null;
      
      if(!this.businessId && bId) {
        this.businessId = Number(bId);
      }
      
      if(!this.businessId || Number.isNaN(this.businessId) && this.sds.isBranchExists()) {
        this.businessId = this.sds.getCurrentUserBusinessId();
      }

      this.initForm();      
    });
    
  }
  
  
  initForm() {
    let req = Validators.required;
    this.branchForm = this.fb.group({
      name: ['', [req, Validators.maxLength(100)]],
      address: ['', [req, Validators.maxLength(200)]],
      phone: ['', [Validators.maxLength(100)]],
      businessId: [this.businessId, req],
      latitude:  [undefined],
      longitude: [undefined],
    });
  }
  
  onSubmit() {
    this.branchForm?.markAllAsTouched();
    if (!this.branchForm?.valid)
      return;
    
    let request: Branch = this.branchForm.value;
    
    this.brs.createBranch(request).subscribe({
      next: (data: any) => {
        let resp = data as ApiResponse<any>;
        if(resp.statusCode == HttpStatusCode.Created && resp.isSuccess) {

          let branch = resp.data as Branch;
          let user = this.sds.currentUser;

          if(user.business && branch) {
            if(user.business.branches) 
              user.business.branches.push(branch);
            else {
              user.business.branches = [];
              user.business.branches.push(branch);
            }
          }
          
          this.ls.setItem(APP_USER, user, true);

          this.router.navigate(['admin'], { replaceUrl: true  });
          this.ms.add({key: 'global-toast', severity: 'success', summary: 'Success', detail: resp.message});
          return;
        }

        this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: resp.message });
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
}
