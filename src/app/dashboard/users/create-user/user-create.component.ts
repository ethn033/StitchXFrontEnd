import { ProblemDetails } from './../../../models/error-response';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { normalizeError, userRolesFilterValue } from '../../../utils/utils';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { UsersService } from '../../../services/client/users.service';
import { RegisterDto } from '../../../Dtos/requests/requestDto';
import { ApiResponse } from '../../../models/base-response';
import { HttpStatusCode } from '@angular/common/http';
@Component({
  selector: 'app-user-create',
  imports: [ButtonModule, ReactiveFormsModule, FormsModule, InputTextModule, PasswordModule, CommonModule, InputNumberModule, SelectModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  userRolesItems: DropDownItem[] = userRolesFilterValue();
  selectedRole?: DropDownItem = this.userRolesItems[0];
  customerForm: FormGroup;
  loading = false;
  us = inject(UsersService);
  ms = inject(MessageService);
  private router = inject(Router);
  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    // private firestore: AngularFirestore,
    private messageService: MessageService) {
      this.customerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
        phone: ['', [Validators.required]],
        address: [''],
        city: [''],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        role: [null, Validators.required] // Default role
      });
      
      // If editing an existing customer
      if (this.config.data?.customer) {
        this.customerForm.patchValue(this.config.data.customer);
      }
    }
    
    
    ngOnInit(): void {
      
    }
    
    onSubmit() {
      if (this.customerForm.invalid) {
        this.customerForm.markAllAsTouched();
        return;
      }
      const formValue = this.customerForm.value;
      const request: RegisterDto = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        email: formValue.email,
        password: formValue.password,
        role: formValue.role.id,
        address: formValue.address
      };
      
      this.loading = true;  
      this.us.createUsers(request).subscribe({
        next: (data: any) => {
          let resp = data as ApiResponse<any>;
          if(resp.statusCode == HttpStatusCode.Created && resp.isSuccess) {
            let data = resp.data;
            this.messageService.add({key: 'global-toast', severity: 'success', summary: 'Success', detail: resp.message});
            this.ref.close(true);
          }
          this.loading = false;
        },
        error: (err: any) => {
          const normalized = normalizeError(err);
          switch(normalized.errorType) {
            case 'VALIDATION_ERROR':
            const errorMessages = normalized.errors?.map((e: any) => e.description).join('\n');
            this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: normalized?.details});
            break;
            
            case 'API_ERROR':
            this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: normalized.details});
            break;
            
            default:
            this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: normalized.details});
          }
          console.error('Error details:', normalized);
          this.loading = false;
        }
      });
    }
    
    onCancel(): void {
      this.ref.close(false);
    }
  }
  