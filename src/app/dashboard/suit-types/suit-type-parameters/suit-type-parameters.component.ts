import { EParameterType } from './../../../enums/enums';
import { SuitTypeParameter } from './../../../Dtos/requests/request-dto';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { entityStatuses, getBusinessId, normalizeError, parameterTypeFilterValue} from '../../../utils/utils';
import { LoadingService } from '../../../services/generics/loading.service';
import { ApiResponse } from '../../../models/base-response';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { SuitType, User } from '../../../Dtos/requests/request-dto';
import { TabsModule } from "primeng/tabs";
import { RouterModule } from '@angular/router';
import { TruncatePipe } from "../../../pipe/truncate.pipe";
import { SuitTypeParameterService } from '../../../services/suit-type-parameters/suit-type-parameter.service';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpStatusCode } from '@angular/common/http';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PanelModule } from 'primeng/panel';
import { InputText } from "primeng/inputtext";
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-suit-type-parameters',
  templateUrl: './suit-type-parameters.component.html',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TabsModule, RouterModule, TruncatePipe, ReactiveFormsModule, CheckboxModule, ToggleSwitchModule, InputText, PanelModule, RadioButtonModule],
  providers: [DialogService, ConfirmationService],
  styleUrls: ['./suit-type-parameters.component.css']
})
export class SuitTypeParametersComponent implements OnInit {
  
  ref = inject(DynamicDialogRef); 
  confService = inject(ConfirmationService); 
  config = inject(DynamicDialogConfig);
  sts = inject(SuitTypeParameterService);
  ms = inject(MessageService);
  ls = inject(LoadingService);
  sds = inject(ShareDataService);
  fb: FormBuilder = inject(FormBuilder);
  
  userResponse: User = this.config.data.user as User || null;
  suitType: SuitType = this.config.data.suitType as SuitType || null;
  businessId: number = getBusinessId(this.userResponse) || 0;
  createdByUserId: number = this.userResponse.id || 0; 
  filterStatusValues: DropDownItem[] = entityStatuses();
  selectedStatus: DropDownItem = this.filterStatusValues[0];
  
  // Add these properties
  showAddForm: boolean = false;
  parameterForm: FormGroup;
  parameterTypes = parameterTypeFilterValue();
  
  eParameterType = EParameterType; // Expose enum to template
  constructor() {
    this.parameterTypes
    // Initialize the form
    this.parameterForm = this.fb.group({
      name: ['', Validators.required],
      placeHolder: [''],
      parameterType: [this.parameterTypes[1], Validators.required],
      parameterOptions: [''],
      isRequired: [false],
      suitTypeId: [this.suitType?.id, Validators.required],
      options: this.fb.array([]) // For option values when type is RADIO, CHECKBOX, or SELECT
    });
  }
  
  
  ngOnInit(): void {
    setTimeout(() => {
      this.loadSuitTypeParameters();
    });
    
    // Watch for changes to parameterType to show/hide options field
    this.parameterForm.get('parameterType')?.valueChanges.subscribe(type => {
      this.handleParameterTypeChange(type);
    });
  }
  
  get options(): FormArray {
    return this.parameterForm.get('options') as FormArray;
  }
  
  handleParameterTypeChange(type: any): void {
    const optionsControl = this.parameterForm.get('parameterOptions');
    const optionsArray = this.parameterForm.get('options') as FormArray;
    
    while (optionsArray.length !== 0) {
      optionsArray.removeAt(0);
    }
    
    if (type.id === EParameterType.SINGLE_SELECT_OPTION || type.id === EParameterType.MULTI_SELECT_OPTIONS) {
      this.addOption();
      optionsControl?.setValidators([Validators.required]);
    } else {
      optionsControl?.clearValidators();
    }
    
    optionsControl?.updateValueAndValidity();
  }
  
  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }
  
  removeOption(index: number): void {
    this.options.removeAt(index);
  }
  
  toggleAddForm(): void {
    this.parameterForm.reset({
      parameterType: this.parameterTypes[1],
      isRequired: false,
      suitTypeId: this.suitType?.id
    });
    
    while (this.options.length !== 0) {
      this.options.removeAt(0);
    }
  }
  
  // Submit the form
  onSubmit(): void {
    this.parameterForm.markAllAsTouched();
    let formValue = { ...this.parameterForm.value };
    // For RADIO, CHECKBOX, and SELECT, convert options array to comma-separated string
    if (formValue.parameterType.id === EParameterType.SINGLE_SELECT_OPTION || formValue.parameterType.id === EParameterType.MULTI_SELECT_OPTIONS) {
      formValue.parameterOptions = formValue.options.join(',');
      this.parameterForm.get('parameterOptions')?.setValue(formValue.options.join(','));
      
      if(!formValue.placeHoler) 
        formValue.placeHolder = 'Please select options';
    }
    
    if(!formValue.placeHoler) 
      formValue.placeHolder = 'Please enter ' + formValue.name + ' here';
    
    if(!this.parameterForm.valid){
      this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: 'Please correct the errors in the form before submitting.' });
      return;
    }
    // Remove the options array from the final payload
    delete formValue.options;
    
    formValue = {
      ...formValue,
      parameterType: formValue.parameterType.id,
      isRequired: formValue.isRequired ? formValue.isRequired[0] : false,
    }
    this.sts.createSuitTypeParameter<ApiResponse<any>>(formValue).subscribe({
      next: (response: any) => {
        let resp = response as ApiResponse<SuitTypeParameter>;
        if (resp.isSuccess && resp.statusCode == HttpStatusCode.Created) {
          this.ms.add({ key: 'global-toast', severity: 'success', summary: 'Success', detail: resp.message });
          this.toggleAddForm();
          this.loadSuitTypeParameters();
        }
      },
      error: (err: any) => {
        let er = normalizeError(err);
        this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: er?.message });
      }
    });
    
  }
  
  onValueChange(event: any) {
    this.selectedStatus = event as DropDownItem; 
    this.loadSuitTypeParameters();
  }
  
  loading = false;
  suitTypeParameters: SuitTypeParameter[] = [];
  totalSuitTypeParameters: number = 0;
  loadSuitTypeParameters(event?: TableLazyLoadEvent): void {
    debugger
    this.loading = true;
    let payload = {
      businessId: this.businessId ?? 0,
      suitTypeId: this.suitType?.id,
      status: this.selectedStatus.id ?? 1
    };
    
    this.ls.show();
    this.sts.getSuitTypeParameters<ApiResponse<any>>(payload).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.ls.hide();
        let resp  = data as ApiResponse<any>;
        this.suitTypeParameters = resp.data.suitTypeParameters as SuitTypeParameter[] || [];
        this.totalSuitTypeParameters = this.suitTypeParameters.length;
      },
      error: (error: any) => {
        this.loading = false;
        this.ls.hide();
        this.ms.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: error?.message || 'Failed to load suit type parameters.' });
      },
      complete: () => {
        this.ls.hide();
      }
    });
  }
  
  confirmDelete(stp: SuitTypeParameter): void {
    this.confService.confirm({
      message: `Are you sure you want to delete ${stp.name}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {
        this.sts.deleteSuitTypeParameter<ApiResponse<any>>(stp.id!).subscribe({
          next: (response: any) => {
            let resp = response as ApiResponse<SuitTypeParameter>;
            if(resp.isSuccess && resp.statusCode == 200){
              this.ms.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: resp.message });
              this.loadSuitTypeParameters();
            }
          },
          error: (err: any) => {
            let er = normalizeError(err);
            this.ms.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: er?.message});
          }
        });
      }
    });
  }
  
}
