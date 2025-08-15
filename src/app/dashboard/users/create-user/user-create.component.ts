import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { userRolesFilterValue } from '../../../utils/utils';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { UsersService } from '../../../services/client/users.service';
import { ApiResponse } from '../../../models/base-response';
import { HttpStatusCode } from '@angular/common/http';
import { User } from '../../../Dtos/requests/requestDto';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';

@Component({
  selector: 'app-user-create',
  imports: [ButtonModule, ReactiveFormsModule, FormsModule, InputTextModule, PasswordModule, CommonModule, InputNumberModule, SelectModule, DatePickerModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  isUpdateScreen=false;
  userRolesItems: DropDownItem[] = userRolesFilterValue();
  customerForm: FormGroup;
  loading = false;
  us = inject(UsersService);
  ms = inject(MessageService);
  constructor(private fb: FormBuilder, public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {
    
    this.isUpdateScreen = !!this.config.data?.user;
    
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required]],
      address: [''],
      city: [''],
      passwordHash: ['', !this.isUpdateScreen ? [Validators.required, Validators.minLength(8), Validators.maxLength(25)] : []],
      role: [null, Validators.required],
      dateOfBirth: []
    });
    
    if (this.isUpdateScreen) {

      this.config.data.user.dateOfBirth =  moment(this.config.data.user.dateOfBirth).format('DD-MM-YYYY');;
      this.customerForm.patchValue({
        ...this.config.data.user,
        role: this.userRolesItems.find(role => role.id === this.config.data.user.defaultRole),
        dateOfBirth: this.config.data.user.dateOfBirth.toString()
      });
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
    const request: User = {
      id: this.isUpdateScreen ? this.config.data.user.id : 0,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      passwordHash: formValue.passwordHash,
      primaryRole: formValue.role.id,
      address: formValue.address,
      dateOfBirth: moment(formValue.dateOfBirth).toDate()
    };
    
    this.loading = true;  

    // if update screen, call updateUser method instead
    // if (this.isUpdateScreen) {
    const call = this.isUpdateScreen ? this.us.updateUsers(this.config.data.user.id, request) : this.us.createUsers(request);
    call.subscribe({
      next: (data: any) => {
        let resp = data as ApiResponse<any>;
        if(resp.statusCode == HttpStatusCode.Ok && resp.isSuccess) {
          this.messageService.add({key: 'global-toast', severity: 'success', summary: 'Success', detail: resp.message});
          this.ref.close(true);
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.messageService.add({key: 'global-toast', severity: 'error', summary: 'Login Failed', detail: err.message});
        this.loading = false;
      }
    });
  }
  
  onCancel(): void {
    this.ref.close(false);
  }
}
