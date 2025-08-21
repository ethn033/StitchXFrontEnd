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
import { SuitTypeService } from '../../../services/suit-type/suit-type.service';
import { TruncatePipe } from "../../../pipe/truncate.pipe";
import { Menu } from "primeng/menu";
@Component({
  selector: 'app-suit-type-parameters',
  templateUrl: './suit-type-parameters.component.html',
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TabsModule, RouterModule, TruncatePipe, Menu],
  providers: [DialogService, ConfirmationService],
  styleUrls: ['./suit-type-parameters.component.css']
})
export class SuitTypeParametersComponent implements OnInit {
  private sds = inject(ShareDataService);
  dialogService: DialogService = inject(DialogService);
  sts: SuitTypeService = inject(SuitTypeService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  messageService: MessageService = inject(MessageService);
  loadingService: LoadingService = inject(LoadingService);
  
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
    this.loadSuitTypeParameters();
  }
  
  loadSuitTypeParameters(event?: TableLazyLoadEvent): void {
    
    this.loadingService.show();
    
    let payload = {
      businessId: this.businessId ?? 0,
      status: this.selectedStatus.id
    };
    
    this.sts.getSuitTypes<ApiResponse<SuitType[]>>(payload).subscribe({
      next: (data: any) => {
        this.loadingService.hide();
        let resp  = data as ApiResponse<SuitType[]>;
        this.suitTypes = resp.data;
        this.totalSuitTypes = this.suitTypes.length;
      },
      error: (error: any) => {
        this.loadingService.hide();
        this.messageService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load suit types.' });
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
              this.loadSuitTypeParameters();
            }
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
