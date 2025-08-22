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
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { entityStatuses, getBusinessId, normalizeError, validateCurrentRole } from '../../../utils/utils';
import { LoadingService } from '../../../services/generics/loading.service';
import { ApiResponse } from '../../../models/base-response';
import { ERole } from '../../../enums/enums';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { SuitType, User } from '../../../Dtos/requests/request-dto';
import { TabsModule } from "primeng/tabs";
import { RouterModule } from '@angular/router';
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { TruncatePipe } from "../../../pipe/truncate.pipe";
import { Menu } from "primeng/menu";
import { SuitTypeParameterService } from '../../../services/suit-type-parameters/suit-type-parameter.service';
@Component({
  selector: 'app-suit-type-parameters',
  templateUrl: './suit-type-parameters.component.html',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TabsModule, RouterModule, TruncatePipe, Menu],
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
  
  loading = false;
  userResponse: User = this.config.data?.user as User || null;
  businessId = this.config.data?.businessId || null;
  createdByUserId = this.userResponse.id || null;
  suitType: SuitType = this.config.data?.suitType || null;
  suitTypeParamForm!: FormGroup;

  filterStatusValues = entityStatuses();
  selectedStatus: DropDownItem = this.filterStatusValues[0];


  constructor() { 

  }
  

  items: MenuItem[] = [
    {
      label: 'Options',
      items: [
        {
          label: 'Add Parameters',
          icon: 'pi pi-plus',
          command: () => {
            
          }
        }
      ]
    }
  ];
    
  
  ngOnInit(): void {
    this.loadSuitTypeParameters();
  }
  
  suitTypeParameters: SuitTypeParameter[] = [];
  totalSuitTypeParameters: number = 0;
  loadSuitTypeParameters(event?: TableLazyLoadEvent): void {

    
    debugger
    this.config.data
    
    this.ls.show();
    let payload = {
      businessId: this.businessId ?? 0,
      suitTypeId: this.suitType.id,
    };
    
    this.sts.getSuitTypeParameters<ApiResponse<SuitTypeParameter[]>>(payload).subscribe({
      next: (data: any) => {
        this.ls.hide();
        let resp  = data as ApiResponse<SuitType[]>;
        this.suitTypeParameters = resp.data;
        this.totalSuitTypeParameters = this.suitTypeParameters.length;
      },
      error: (error: any) => {
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
