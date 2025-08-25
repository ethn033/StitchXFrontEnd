import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
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
import { CreateSuitTypeComponent } from '../create-suit-type/create-suit-type.component';
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { TruncatePipe } from "../../../pipe/truncate.pipe";
import { Menu } from "primeng/menu";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { HttpStatusCode } from '@angular/common/http';
import { SuitTypeParametersComponent } from '../suit-type-parameters/suit-type-parameters.component';
import { ViewCustomerComponent } from '../../users/view-user/view-user.component';
@Component({
  selector: 'app-suit-types',
  templateUrl: './suit-types.component.html',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TabsModule, RouterModule, TruncatePipe, Menu, ToggleSwitchModule],
  providers: [DialogService, ConfirmationService],
  styleUrls: ['./suit-types.component.css']
})
export class SuitTypesComponent implements OnInit {
  abc() {
    console.log(this.selectedStatus.id);
  }
  
  private sds = inject(ShareDataService);
  dialogService: DialogService = inject(DialogService);
  sts: SuitTypeService = inject(SuitTypeService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  ls: LoadingService = inject(LoadingService);
  
  
  suitType!: SuitType; // for paramters, will be passed to the component
  items: MenuItem[] = [
    {
      label: 'Add Parameters',
      icon: 'pi pi-plus',
      command: () => {
        this.showSuitTypeParameters(this.suitType);
      }
    }
  ];
  
  stRestoreId: number | null = null;
  itemsDelete: MenuItem[] = [
    {
      label: 'Restore Suit Type',
      icon: 'pi pi-undo',
      command: (event: any) => {
        this.restoreDeletedSuitType(event);
      }
    }
  ];
  
  userResponse?: User | null;
  roles = ERole;
  currentRole?: ERole | null;
  suitTypes: SuitType[] = [];
  filterStatusValues: DropDownItem[] = entityStatuses();
  selectedStatus: DropDownItem = this.filterStatusValues[0];
  
  totalSuitTypes: number = 0;
  
  businessId?: number | null;
  constructor() {
    this.sds.userData.subscribe(userData => {
      this.userResponse = userData as User;
      this.currentRole = validateCurrentRole(this.userResponse.roles!);
      if(this.userResponse && this.userResponse.business && this.userResponse.business.branches) {
        this.businessId = getBusinessId(this.userResponse);
      }
    });
  }
  
  ngOnInit(): void {
    this.loadSuitTypes();
  }
  
  toggleSuitTypeStatus(st: any) {
    this.ls.show();
    this.sts.updateSuitTypeStatus<ApiResponse<any>>(st.id, st.isActive).subscribe({
      next: (response: any) => {
        this.ls.hide();
        if(response.isSuccess && response.statusCode == 200) {
          this.messageService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: response.message });
          let index = this.suitTypes.findIndex(s => s.id === st.id);
          
          if (index !== -1) {
            this.suitTypes.splice(index, 1);
            this.suitTypes = [...this.suitTypes]; // Refresh the array reference
          }
          return;
        }
        st.isActive = !st.isActive; // revert the change if failed
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: response.message });
      },
      error: (err: any) => {
        st.isActive = !st.isActive; // revert the change if failed
        this.ls.hide();
        let er = normalizeError(err);
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: er?.message});
      },
      complete: () => {
        this.ls.hide();
      }
    });
  }
  
  restoreDeletedSuitType(st: any) {
    if(!this.stRestoreId) {
      this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'No suit type selected for restoration.' });
      return;
    }
    this.ls.show();
    this.sts.restoreDeletedSuitType<ApiResponse<any>>(this.stRestoreId).subscribe({
      next: (response: any) => {
        this.ls.hide();
        if(response.isSuccess && response.statusCode == HttpStatusCode.Ok) {
          this.messageService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: response.message });
          let index = this.suitTypes.findIndex(s => s.id === this.stRestoreId);
          
          if (index !== -1) {
            this.suitTypes.splice(index, 1);
            this.suitTypes = [...this.suitTypes]; // Refresh the array reference
          }
          return;
        }
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: response.message });
      },
      error: (err: any) => {
        let er = normalizeError(err);
        this.ls.hide();
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: er?.message});
      }
    });
  }
  
  showSuitTypeParameters(st?: SuitType) {
    
    const ref = this.dialogService.open(SuitTypeParametersComponent, {
      header: 'Suit Type Parameters : ' + (st?.name?.toUpperCase() || ''),
      width: '90%',
      height: '80%',
      styleClass: 'suit-type-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      closeOnEscape: false,
      data: {
        userId: this.userResponse?.id, 
        businessId: this.businessId,
        suitTypeId: st?.id
      }
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadSuitTypes();
      }
    });
  }
  
  
  loadSuitTypes(event?: TableLazyLoadEvent): void {
    
    let payload = {
      businessId: this.businessId ?? 0,
      status: this.selectedStatus.id
    };
    
    this.ls.show();
    this.sts.getSuitTypes<ApiResponse<SuitType[]>>(payload).subscribe({
      next: (data: any) => {
        this.ls.hide();
        let resp  = data as ApiResponse<SuitType[]>;
        this.suitTypes = resp.data;
        this.totalSuitTypes = this.suitTypes.length;
      },
      error: (error: any) => {
        this.ls.hide();
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load suit types.' });
      }
    });
  }
  
  
  addUpdateSuitTypeDialog(st?: SuitType): void {
    const ref = this.dialogService.open(CreateSuitTypeComponent, {
      header: st ? 'Update Suite Type' : 'Add New Suit Type',
      width: '60%',
      styleClass: 'suit-type-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      closeOnEscape: false,
      data: {
        user: this.userResponse, 
        businessId: this.businessId,
        suitType: st
      }
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadSuitTypes();
      }
    });
  }
  
  
  confirmDelete(st: SuitType): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${st.name}?`,
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
        this.sts.deleteSuitType<ApiResponse<any>>(st.id!).subscribe({
          next: (response: any) => {
            let resp = response as ApiResponse<any>;
            if(resp.isSuccess && resp.statusCode == 200){
              this.messageService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: resp.message });
              this.loadSuitTypes();
              return;
            }
            this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: resp.message });
          },
          error: (err: any) => {
            let er = normalizeError(err);
            this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: er?.message});
          }
        });
      }
    });
  }
  
}
