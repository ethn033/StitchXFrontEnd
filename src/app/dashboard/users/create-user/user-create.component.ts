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
import { userRolesFilterValue, valdiateRoles, validateCurrentRole } from '../../../utils/utils';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { UsersService } from '../../../services/client/users.service';
import { ApiResponse } from '../../../models/base-response';
import { HttpStatusCode } from '@angular/common/http';
import { User } from '../../../Dtos/requests/request-dto';
import { DatePickerModule } from 'primeng/datepicker';
import moment from 'moment';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { ERole } from '../../../enums/enums';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-user-create',
  imports: [ButtonModule, ReactiveFormsModule, FormsModule, InputTextModule, PasswordModule, CommonModule, InputNumberModule, SelectModule, DatePickerModule, FieldsetModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  isUpdateScreen = false;
  customerForm: FormGroup;
  loading = false;
  us = inject(UsersService);
  ms = inject(MessageService);
  
  userRolesItems: DropDownItem[] = userRolesFilterValue();
  selectedRole?: DropDownItem = this.userRolesItems[0];
  private sds = inject(ShareDataService);
  private fb = inject(FormBuilder);
  userResponse?: User | null;
  currentRole?: ERole | null;
  roles = ERole;
  
  constructor(private ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {
    this.sds.userData.subscribe(userData => {
      this.userResponse = userData as User;
      this.currentRole = validateCurrentRole(this.userResponse.roles!);
      this.userRolesItems = valdiateRoles(this.userRolesItems, this.currentRole);
    });
    
    this.isUpdateScreen = !!this.config.data?.user;
    
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required]],
      address: [''],
      city: [''],
      passwordHash: ['', !this.isUpdateScreen ? [Validators.required, Validators.minLength(8), Validators.maxLength(25)] : []],
      role: [null, !this.isUpdateScreen ? Validators.required : []],
      dateOfBirth: []
    });
    
    if (this.isUpdateScreen) {
      if(this.config.data.user.dateOfBirth)
        this.config.data.user.dateOfBirth =  new Date(this.config.data.user.dateOfBirth);
      this.customerForm.patchValue({
        ...this.config.data.user,
        role: this.userRolesItems.find(role => role.id === this.config.data.user.primaryRole),
        dateOfBirth: this.config.data.user.dateOfBirth ? this.config.data.user.dateOfBirth : null
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
    
    const request: User = !this.isUpdateScreen ? {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      passwordHash: formValue.passwordHash,
      city: formValue.city,
      primaryRole: formValue.role.id,
      address: formValue.address,
      dateOfBirth: formValue.dateOfBirth ? moment(formValue.dateOfBirth).format("YYYY-MM-DD") : null
    } : 
    {
      id: this.config.data.user.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      city: formValue.city,
      address: formValue.address,
      dateOfBirth: formValue.dateOfBirth ? moment(formValue.dateOfBirth).format("YYYY-MM-DD") : null
    };
    
    this.loading = true;  
    const call = this.isUpdateScreen ? this.us.updateUsers(this.config.data.user.id, request) : this.us.createUsers(request);
    call.subscribe({
      next: (data: any) => {
        let resp = data as ApiResponse<any>;
        if(resp.statusCode == HttpStatusCode.Created && resp.isSuccess) {
          this.messageService.add({key: 'global-toast', severity: 'success', summary: 'Success', detail: resp.message});
          this.ref.close(true);
        }
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
  
  
  measurementFormExpanded = false;
  measurementForm: FormGroup = this.fb.group({
    suitTypeId: [null, Validators.required],
    chest: [null, [Validators.required, Validators.min(20), Validators.max(60)]],
    waist: [null, [Validators.required, Validators.min(20), Validators.max(60)]],
    hip: [null, [Validators.min(20), Validators.max(60)]],
    sleeveLength: [null, [Validators.required, Validators.min(10), Validators.max(40)]],
    shoulderWidth: [null, [Validators.min(10), Validators.max(30)]],
    neckSize: [null, [Validators.required, Validators.min(10), Validators.max(20)]],
    shirtLength: [null, [Validators.min(20), Validators.max(40)]],
    pantLength: [null, [Validators.required, Validators.min(20), Validators.max(50)]],
    notes: [null]
  });

  suitTypes = [
    { id: 1, name: 'Business Suit' },
    { id: 2, name: 'Tuxedo' },
    { id: 3, name: 'Casual Blazer' },
    { id: 4, name: 'Wedding Suit' }
  ];
  
  onSuitTypeChange(event: any) {
    
  }
  
  initMeasurementForm() {
    
  }
  
  saveMeasurements() {
    if (this.measurementForm.valid) {
      console.log('Measurements to save:', this.measurementForm.value);
      // Implement your save logic here
    }
  }
  
  clearMeasurements() {
    this.measurementForm.reset();
  }
  
  toggleMeasurementForm() {
    this.measurementFormExpanded = !this.measurementFormExpanded;
  }
}
