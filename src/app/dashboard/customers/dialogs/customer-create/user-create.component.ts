import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ERole } from '../../../../enums/enums';
import { RegisterDto } from '../../../../Dtos/requests/requestDto';
import { UsersService } from '../../../../services/client/users.service';
import { ApiResponse } from '../../../../models/base-response';
import { Router } from '@angular/router';
import { userRolesFilterValue } from '../../../../utils/utils';
import { DropDownItem } from '../../../../contracts/dropdown-item';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { HttpErrorResponse } from '@angular/common/http';
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
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
        role: [undefined] // Default role
      });
      
      // If editing an existing customer
      if (this.config.data?.customer) {
        this.customerForm.patchValue(this.config.data.customer);
      }
    }
    
    
    ngOnInit(): void {
      
    }
    
    
    onSubmit() {
      
      debugger
      if (this.customerForm.invalid) {
        this.markAllAsTouched();
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
          debugger
          this.loading = false;
          let resp = data as ApiResponse<any>;
          if(resp.statusCode == 200 && resp.isSuccess) {
            this.messageService.add({key: 'global-toast', severity: 'success', summary: 'Success', detail: 'Customer added successfully'});
            this.ref.close(true);   
          }
        },
        error: (err: any) => {
          let errorMessage = 'Failed to register';
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (err?.data) {
            // Handle the specific API error structure
            const duplicateErrors = err.data.filter((error: any) => 
              error.code === 'DuplicateUserName' || error.code === 'DuplicateEmail'
          );
          
          if (duplicateErrors.length > 0) {
            errorMessage = duplicateErrors.map((e: any) => e.description).join(' ');
          } else if (err.message) {
            errorMessage = err.message;
          }
        }
        this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: errorMessage});
        this.loading = false;
      }
    });
  }
  
  markAllAsTouched(): void {
    Object.values(this.customerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  onCancel(): void {
    this.ref.close(false);
  }
}
