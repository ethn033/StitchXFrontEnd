import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MeasurementService } from '../../../services/measurements/measurement.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Measurement, MeasurementDetails, SuitType, SuitTypeParameter, User } from '../../../Dtos/requests/request-dto';
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { ApiResponse } from '../../../models/base-response';
import { CustomerResponse, UsersResponse } from '../../../Dtos/requests/response-dto';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomersService } from '../../../services/customers/customers.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { SuitTypeParameterService } from '../../../services/suit-type-parameters/suit-type-parameter.service';
import { LoadingService } from '../../../services/generics/loading.service';
import { EParameterType } from '../../../enums/enums';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MeasurementDetailsService } from '../../../services/measurement-details/measurement-details.service';
import { splitStrBySep } from '../../../utils/utils';

@Component({
  selector: 'app-create-measurement',
  templateUrl: './create-measurement.component.html',
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, FormsModule,RadioButtonModule,DropdownModule, InputTextModule, CheckboxModule,  SelectModule, ButtonModule, AutoCompleteModule],
  styleUrls: ['./create-measurement.component.css']
})
export class CreateMeasurementComponent implements OnInit {
  
  @Input() mObjInput?: Measurement;
  @Input() bIdInput?: number;
  config = inject(DynamicDialogConfig);
  mss = inject(MeasurementService);
  ref = inject(DynamicDialogRef); 
  cs = inject(CustomersService);
  sts = inject(SuitTypeService);
  ms = inject(MessageService);
  ls = inject(LoadingService);
  stps = inject(SuitTypeParameterService);
  fb = inject(FormBuilder);
  mds = inject(MeasurementDetailsService);
  
  measurement: Measurement = this.config?.data?.measurement as Measurement || this.mObjInput || null;
  businessId: number = this.config.data?.businessId as number || this.bIdInput || 0;
  
  isUpdateScreen: boolean = !!this.measurement;
  
  measurementForm: FormGroup;
  loading = false;
  
  filteredUsers: User[] = [];
  filteredSuitTypes : SuitType[] = [];
  
  constructor() {
    this.measurementForm = this.fb.group({
      applicationUserId: [null, Validators.required],
      suitTypeId: [null, Validators.required],
    });
  }
  
  ngOnInit() { 
    this.getSuitTypes();
    if(this.isUpdateScreen)
      this.filterUsers({ query: this.measurement.applicationUserId || 0});
  }
  
  filterUsers(event: any): void {
    const query = event.query;
    const isInteger = /^\d+$/.test(query);
    const isUsrId = /^USR-\d+$/.test(query);    
    this.selectedUser = null;
    if (!isInteger && !isUsrId && query.trim().length < 2) {
      this.filteredUsers = [];
      return;
    }
    
    this.cs.getCustomers<ApiResponse<CustomerResponse>>({ search: query }).subscribe({
      next: (response: any) => {
        if(response && response.statusCode == HttpStatusCode.Ok) {
          let res = response as ApiResponse<CustomerResponse>;
          this.filteredUsers = res.data.customers as User[] || [];
          this.filteredUsers = this.filteredUsers.map(u => ({ ...u, name: u.firstName + ' ' + u.lastName }) );
          
          if(this.isUpdateScreen) {
            this.selectedUser = this.filteredUsers[0];
            this.measurementForm.get("applicationUserId")?.setValue(this.selectedUser.id);
          }
        }
      },
      error: (err) => {
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
  
  selectedSuitType: SuitType | null = null;
  suitTypes: SuitType[] = [];
  getSuitTypes(): void {
    let payload = {
      businessId: this.businessId,
      suitTypeId: this.measurement ? this.measurement.suitTypeId || 0 : 0
    };
    
    this.sts.getSuitTypes<ApiResponse<SuitType>>(payload).subscribe({
      next: (response: any) => {
        if(response && response.statusCode == HttpStatusCode.Ok) {
          this.suitTypes = [];
          if(response.data)
            this.suitTypes = response.data as SuitType[] || [];
          if(this.isUpdateScreen)
            this.selectedSuitType = this.suitTypes[0] || null;
          if(this.selectedSuitType) {
            this.measurementForm.get("suitTypeId")?.setValue(this.selectedSuitType.id);
            this.loadSuitTypeParameters();
          }
        }
      },
      error: (err: any) => {
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
  
  isLoading = false;
  suitTypeParameters: SuitTypeParameter[] = [];
  totalSuitTypeParameters: number = 0;
  loadSuitTypeParameters(event?: TableLazyLoadEvent): void {
    let payload = {
      suitTypeId: this.selectedSuitType?.id ?? 0,
    };
    
    this.ls.show();
    this.stps.getSuitTypeParameters<ApiResponse<any>>(payload).subscribe({
      next: (data: any) => {
        this.ls.hide();
        let resp  = data as ApiResponse<any>;
        this.suitTypeParameters = resp.data.suitTypeParameters as SuitTypeParameter[] || [];
        this.totalSuitTypeParameters = this.suitTypeParameters.length;
        
        if(this.totalSuitTypeParameters > 0) {
          this.createFormControls();
          if(this.isUpdateScreen)
            this.loadMeasurementDetails(this.measurement?.id);
        } else {
          this.ms.add({ key: 'global-toast', severity: 'info', summary: 'Info', detail: 'No parameters found for the selected suit type.' });
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.ls.hide();
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      },
      complete: () => {
        this.ls.hide();
      }
    });
  }
  
  measurementDetails: MeasurementDetails[]  = [];
  loadMeasurementDetails(mId: number | null = 0) {
    if(!mId) return;
    let payload = {
      measurementId : mId
    };
    this.ls.show();
    this.mds.getMeasurementDetails(payload).subscribe({
      next: (res) => {
        this.ls.hide();
        if(res && res.statusCode == HttpStatusCode.Ok) {
          let mds = res.data as MeasurementDetails[] || [];
          if(mds.length > 0) {
            this.measurementDetails = mds;
            this.populateMds();
            return;
          }
        }
        
        this.ms.add({ key: 'global-toast', severity: 'info', summary: 'Info', detail: 'No parameters found for the selected suit type.' });
        this.isLoading = false;
      },
      error: (err) => {
        this.loading = false;
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
  
  parameterTypes = EParameterType;
  createFormControls() {
    this.suitTypeParameters.forEach(param => {
      let validators = [];
      if (param.isRequired) {
        validators.push(Validators.required);
      }
      
      const controlId = param.id?.toString() || '';
      switch (param.parameterType) {
        case EParameterType.INPUT_TEXT:
        this.measurementForm.addControl(controlId, this.fb.control('', validators));
        break;
        case EParameterType.INPUT_NUMBER:
        this.measurementForm.addControl(controlId, this.fb.control(null, validators));
        break;
        case EParameterType.SINGLE_SELECT_OPTION:
        this.measurementForm.addControl(controlId, this.fb.control([], validators));
        break;
        case EParameterType.MULTI_SELECT_OPTIONS:
        this.measurementForm.addControl(controlId, this.fb.control([], validators));
        break;
        default:
        this.measurementForm.addControl(controlId, this.fb.control('', validators));
        break;
      }
    });
  }
  
  populateMds() {
    this.measurementDetails.forEach((md: MeasurementDetails) => {
      const stParamId = md.suitTypeParameterId!.toString();
      let control = this.measurementForm.get(stParamId) || null;
      if(control) {
        if (this.isMultiOptions(md.suitTypeParameterId!)) {
          const values = splitStrBySep((md.value || ''), ',');
          control.patchValue(values);
        }
        else {
          control.setValue(md.value);
        }
      }
    });
  }
  
  isMultiOptions(paramId: number): boolean {
    const param = this.suitTypeParameters.find(p => p.id === paramId);
    return (param?.parameterType === EParameterType.MULTI_SELECT_OPTIONS || param?.parameterType === EParameterType.SINGLE_SELECT_OPTION);
  }
  
  filterSuitTypes(event: any): void {
    const query = event.query;
    this.measurementForm.patchValue({
      applicationUserId: this.selectedUser?.id || null,
    });
    
    this.selectedSuitType = null;
    this.suitTypeParameters = [];
    
    if(query.trim().length < 1) {
      this.filteredSuitTypes = [];
      return;
    }
    
    this.filteredSuitTypes = this.suitTypes.filter(suitType => suitType.name?.toLowerCase().startsWith(query.toLowerCase()));
    
  }
  
  selectedUser: User | null = null; 
  onUserSelect(user: any): void {
    this.selectedUser = user.value;
    this.measurementForm.patchValue({
      applicationUserId: this.selectedUser?.id
    });
  }
  
  onSuitTypeSelect(suitType: any): void {
    this.selectedSuitType = suitType.value;
    this.measurementForm.patchValue({
      suitTypeId: this.selectedSuitType?.id
    });
    
    this.loadSuitTypeParameters();
  }
  
  onCancel(): void {
    this.measurementForm.reset();
    this.ref.close();
  }
  
  onSubmit(): void {
    this.measurementForm.markAllAsTouched();
    if (!this.measurementForm.valid) {
      return;
    }
    
    let payload = this.measurementForm.value;
    
    const measurement: Measurement = {
      id: this.measurement ? this.measurement.id || 0 : 0,
      applicationUserId: this.selectedUser?.id || 0,
      businessId: this.businessId,
      suitTypeId: this.selectedSuitType?.id || 0
    };
    
    measurement.measurementDetails = [];
    for (const key in payload) {
      if (!['applicationUserId', 'suitTypeId'].includes(key)) {
        measurement.measurementDetails?.push({
          suitTypeParameterId: Number(key),
          value: Array.isArray(payload[key]) ? payload[key].join(',') : payload[key]
        });
      }
    }
    

    Object.keys(this.measurementForm.controls).forEach(key => {
      const control = this.measurementForm.get(key);
      console.log(`Control: ${key}, Value:`, control?.value);
    });

  debugger
    this.loading = true;
    const call = this.isUpdateScreen ? this.mds.updateMeasurementDetails<any>(this.measurement.id!, measurement) : this.mss.createMeasurement<any>(measurement);
    call.subscribe({
      next: (res) => {
        this.loading = false;
        if(res && res.statusCode == HttpStatusCode.Created || res.statusCode == HttpStatusCode.Ok) {
          this.ms.add({ key: 'global-toast', severity: 'success', summary: 'Success', detail: res.message});
          this.ref.close(true);
          return;
        }
        this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: res.message || 'An error occurred while creating the measurement.' });
      },
      error: (err) => {
        this.loading = false;
        if(err instanceof HttpErrorResponse) {
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      }
    });
  }
}
