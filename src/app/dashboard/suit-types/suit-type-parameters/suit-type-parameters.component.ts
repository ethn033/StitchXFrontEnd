import { RemoveUnderscoresPipe } from './../../../pipe/remove-underscores.pipe';
import { EParameterType } from './../../../enums/enums';
import { SuitTypeParameter } from './../../../Dtos/requests/request-dto';
import { Component, inject, Input, input, OnInit } from '@angular/core';
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
import { entityStatuses, EParameterTypeToString, getBusinessId, normalizeError, parameterTypeFilterValue} from '../../../utils/utils';
import { LoadingService } from '../../../services/generics/loading.service';
import { ApiResponse } from '../../../models/base-response';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { TabsModule } from "primeng/tabs";
import { RouterModule } from '@angular/router';
import { TruncatePipe } from "../../../pipe/truncate.pipe";
import { SuitTypeParameterService } from '../../../services/suit-type-parameters/suit-type-parameter.service';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PanelModule } from 'primeng/panel';
import { InputText } from "primeng/inputtext";
import { RadioButtonModule } from 'primeng/radiobutton';
import { LoadingComponent } from "../../../components/shared/loading/loading.component";
@Component({
  selector: 'app-suit-type-parameters',
  templateUrl: './suit-type-parameters.component.html',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TabsModule, RouterModule, TruncatePipe, ReactiveFormsModule, CheckboxModule, ToggleSwitchModule, RemoveUnderscoresPipe, InputText, PanelModule, RadioButtonModule, LoadingComponent],
  providers: [DialogService, ConfirmationService],
  styleUrls: ['./suit-type-parameters.component.css']
})
export class SuitTypeParametersComponent implements OnInit {
  isCollapsed = true;
  @Input() uIdInput?: number;
  @Input() stIdInput?: number;
  @Input() cByIdInput?: number;
  @Input() bidInput?: number;
  ref = inject(DynamicDialogRef); 
  confService = inject(ConfirmationService); 
  config = inject(DynamicDialogConfig);
  sts = inject(SuitTypeParameterService);
  ms = inject(MessageService);
  ls = inject(LoadingService);
  sds = inject(ShareDataService);
  fb: FormBuilder = inject(FormBuilder);
  userId: number = this.config.data.userId as number || this.uIdInput || 0;
  suitTypeId?: number = this.config.data.suitTypeId as number || this.stIdInput || 0;
  businessId: number = this.config.data.businessId as number || this.bidInput || 0;
  createdByUserId: number = this.config.data.userId || this.cByIdInput || 0; 
  filterStatusValues: DropDownItem[] = entityStatuses();
  selectedStatus: DropDownItem = this.filterStatusValues[0];
  
  parameterForm: FormGroup;
  parameterTypes = parameterTypeFilterValue();
  
  eParameterType = EParameterType; // Expose enum to template
  constructor() {
    // Initialize the form
    this.parameterForm = this.fb.group({
      name: ['', Validators.required],
      placeHolder: [''],
      parameterType: [this.parameterTypes[1], Validators.required],
      parameterOptions: [''],
      isRequired: [false],
      suitTypeId: [this.suitTypeId, Validators.required],
      options: this.fb.array([]) // For option values when type is RADIO, CHECKBOX, or SELECT
    });
  }
  
  getParameterTypeString(parameterType: EParameterType): string {
    return EParameterTypeToString[parameterType] || 'UNKNOWN';
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.loadSuitTypeParameters();
    });
  }
  
  get options(): FormArray {
    return this.parameterForm.get('options') as FormArray;
  }
  
  
  paramTypeChanged(event: any): void {
    this.handleParameterTypeChange(event.value);
  }
  
  
  onChangeActivateStatus(stp: any, removeitem? : boolean) {
    
    this.confService.confirm({
      message: `Are you sure you want to activate this parameter?`,
      header: 'Confirm Restore',
      icon: 'pi pi-exclamation-triangle',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: stp.isActive ? 'Activate Parameter' : 'Deactivate Parameter',
        severity: stp.isActive ? 'primary' : 'danger'
      },
      accept: () => {
        this.proceedActivate(stp, removeitem);
      },
      reject: () => {
        stp.isActive = !stp.isActive;
        
      }
    });
  } 
  
  proceedActivate(stp: any, removeitem? : boolean) {
    this.ls.show();
    this.sts.updateSuitTypeParameterStatus<ApiResponse<any>>(stp.id, stp).subscribe({
      next: (response: any) => {
        this.ls.hide();
        if(response.isSuccess && response.statusCode == 200) {
          this.ms.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: response.message });
          
          if(!removeitem) return;
          
          let index = this.suitTypeParameters.findIndex(s => s.id === stp.id);
          if (index !== -1) {
            this.suitTypeParameters.splice(index, 1);
            this.suitTypeParameters = [...this.suitTypeParameters];
          }
          return;
        }
        stp.isActive = !stp.isActive;
        this.ms.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: response.message });
      },
      error: (err: any) => {
        stp.isActive = !stp.isActive;
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
  
  addOption(val? : any): void {
    this.options.push(this.fb.control(val || '', Validators.required));
  }
  
  removeOption(index: number): void {
    this.options.removeAt(index);
  }
  
  toggleAddForm(): void {
    this.isCollapsed = !this.isCollapsed;
    this.parameterForm.reset({
      parameterType: this.parameterTypes[1],
      isRequired: false,
      suitTypeId: this.suitTypeId
    });
    
    while (this.options.length !== 0) {
      this.options.removeAt(0);
    }
  }
  
  editParam(param: SuitTypeParameter) {

    this.isCollapsed = false;
    
    // Reset form with the parameter values
    this.parameterForm.reset({
      name: param.name,
      placeHolder: param.placeHolder || '',
      parameterType: this.parameterTypes.find(pt => pt.id === param.parameterType) || this.parameterTypes[1],
      parameterOptions: param.parameterOptions || '',
      isRequired: param.isRequired || false,
      suitTypeId: param.suitTypeId || this.suitTypeId
    });
    
    // Clear existing options
    while (this.options.length !== 0) {
      this.options.removeAt(0);
    }
    
    if (param.parameterType === EParameterType.MULTI_SELECT_OPTIONS) {
        const optionsArray = param.parameterOptions?.split(',') || [];
        optionsArray.forEach(option => {
          if (option.trim()) {
            this.addOption(option.trim());
          }
        });
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
          this.isCollapsed = !this.isCollapsed;
          if(response.statusCode == HttpStatusCode.Created || response.statusCode == HttpStatusCode.Ok && response.isSuccess) {
            this.ms.add({ key: 'global-toast', severity: 'success', summary: 'Success', detail: response.message });
            this.toggleAddForm();
            this.loadSuitTypeParameters();
            return;
          }        
          this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: response.message });
        },
        error: (err: any) => {
          if(err instanceof HttpErrorResponse) {
            this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
          }
        }
      });
      
    }
    
    onValueChange(event: any) {
      this.selectedStatus = event as DropDownItem; 
      this.loadSuitTypeParameters();
    }
    
    isLoading = false;
    suitTypeParameters: SuitTypeParameter[] = [];
    totalSuitTypeParameters: number = 0;
    loadSuitTypeParameters(event?: TableLazyLoadEvent): void {
      let payload = {
        businessId: this.businessId ?? 0,
        suitTypeId: this.suitTypeId,
        status: this.selectedStatus.id ?? 1
      };
      
      this.ls.show();
      this.sts.getSuitTypeParameters<ApiResponse<any>>(payload).subscribe({
        next: (data: any) => {
          this.ls.hide();
          let resp  = data as ApiResponse<any>;
          this.suitTypeParameters = resp.data.suitTypeParameters as SuitTypeParameter[] || [];
          this.totalSuitTypeParameters = this.suitTypeParameters.length;
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
    
    
    
    
    restoreParameter(param: SuitTypeParameter) {
      this.confService.confirm({
        message: `Are you sure you want to restore this parameter?`,
        header: 'Confirm Restore',
        icon: 'pi pi-exclamation-triangle',
        closable: true,
        closeOnEscape: true,
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Restore',
          severity: 'danger'
        },
        accept: () => {
          this.sts.restoreDeletedSuitTypeParameter<ApiResponse<any>>(param.id!).subscribe({
            next: (response: any) => {
              let resp = response as ApiResponse<SuitTypeParameter>;
              if(resp.isSuccess && resp.statusCode == 200){
                this.ms.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: resp.message });
                this.loadSuitTypeParameters();
              }
            },
            error: (err: any) => {
              if(err instanceof HttpErrorResponse) {
                this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
              }
            }
          });
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
        acceptButtonProps: {
          label: 'Delete',
          severity: 'danger'
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
              if(err instanceof HttpErrorResponse) {
                this.ms.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
              }
            }
          });
        }
      });
    }
    
    
    
    
    
    first = 0;
    
    rows = 10;
    // paging 
    next() {
      this.first = this.first + this.rows;
    }
    
    prev() {
      this.first = this.first - this.rows;
    }
    
    reset() {
      this.first = 0;
    }
    
    pageChange(event: any) {
      this.first = event.first;
      this.rows = event.rows;
    }
    
    isLastPage(): boolean {
      return this.suitTypeParameters ? this.first + this.rows >= this.suitTypeParameters.length : true;
    }
    
    isFirstPage(): boolean {
      return this.suitTypeParameters ? this.first === 0 : true;
    }
  }
  