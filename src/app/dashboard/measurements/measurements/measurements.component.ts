import { Measurement } from './../../../Dtos/requests/request-dto';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from "primeng/tabs";
import { Router, RouterModule } from '@angular/router';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { Branch, User } from '../../../Dtos/requests/request-dto';
import { ERole } from '../../../enums/enums';
import { dateFilterValues, entityStatuses } from '../../../utils/utils';
import { DropDownItem } from '../../../contracts/dropdown-item';
import { MeasurementService } from '../../../services/measurements/measurement.service';
import { LoadingService } from '../../../services/generics/loading.service';
import { APP_SELECTED_BRANCH } from '../../../utils/global-contstants';
import { ApiResponse } from '../../../models/base-response';
import { MeasurementResponse } from '../../../Dtos/responses/orderResponseDto';
import { CreateMeasurementComponent } from '../create-measurement/create-measurement.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css'],
  imports: [CommonModule, DialogModule, DatePickerModule, FormsModule, ButtonModule, SelectModule, ConfirmDialogModule, TagModule, TableModule, TooltipModule, TabsModule, RouterModule, ToggleSwitchModule],
  providers: [DialogService, ConfirmationService],
})
export class MeasurementsComponent implements OnInit {
  
  private sds = inject(ShareDataService);
  private lss = inject(LocalStorageService);
  userResponse?: User | null;
  measurements: Measurement[] = [];
  dateRange: Date[] = [moment().subtract(1, 'week').toDate(), moment().add(1, 'day').toDate()]; // Default to last week
  dateRanges = dateFilterValues();
  selectedDateFilter: DropDownItem = this.dateRanges[1]; // Default to 'This Week'
  dialogService: DialogService = inject(DialogService);
  ms: MeasurementService = inject(MeasurementService);
  cs: ConfirmationService = inject(ConfirmationService);
  messService: MessageService = inject(MessageService);
  totalOrdersCount: number = 0;
  ls: LoadingService = inject(LoadingService);
  router = inject(Router);
  statuses = entityStatuses();
  selectedStatus: DropDownItem = this.statuses[0];
  
  branches: Branch[] = [];
  selectedBranch?: Branch | null;
  businessId: number | null = 0;
  constructor() {
    this.userResponse = this.sds.currentUser as User;
    this.branches = this.sds.getCurrentBranches() as Branch[];
    this.businessId = this.sds.getCurrentUserBusinessId();
    let selected = this.lss.getItem(APP_SELECTED_BRANCH, true) as Branch;
    if(selected)
      this.selectedBranch = selected;
    else {
      this.selectedBranch = this.branches[0];
      this.lss.setItem(APP_SELECTED_BRANCH, this.selectedBranch, true);
    }
  }
  
  ngOnInit() {
  }
  
  onChangeActivateMeasurement(measurement: any) {
    this.ls.show();
    this.ms.updateMeasurementStatus<ApiResponse<any>>(measurement.id, measurement.isActive).subscribe({
      next: (response: any) => {
        this.ls.hide();
        if(response.isSuccess && response.statusCode == 200) {
          this.messService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: response.message });
          let index = this.measurements.findIndex(m => m.id === measurement.id);
          
          if (index !== -1) {
            this.measurements.splice(index, 1);
            this.measurements = [...this.measurements];
          }
          return;
        }
        measurement.isActive = !measurement.isActive; // revert the change if failed
        this.messService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: response.message });
      },
      error: (err: any) => {
        measurement.isActive = !measurement.isActive; // revert the change if failed
        this.ls.hide();
        if(err instanceof HttpErrorResponse) {
          this.messService.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
        }
      },
      complete: () => {
        this.ls.hide();
      }
    });
  }
  
  searchStr: string = '';
  first: number= 0;
  rows: number= 10;
  pageNumber: number = 0;
  pageSize: number = 10;
  loadMeasurments(event?: TableLazyLoadEvent): void {
    this.ls.show();
    this.first = event?.first ?? this.first;
    this.rows = event?.rows ?? this.rows;
    
    this.pageNumber = Math.floor(this.first / this.rows);
    this.pageSize = this.rows;
  
    let payload = {
      page: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchStr,
      startDate: this.dateRange.length > 0 ? moment(this.dateRange[0]).toISOString() : '',
      endDate: (this.dateRange.length > 0 && this.dateRange[1] != null) ? moment(this.dateRange[1]).toISOString() : '',
      customerId: 0,
      suitTypeId: 0,
      businessId: this.businessId,
      status: this.selectedStatus.id
    };
    
    this.ms.getMeasurements<ApiResponse<Measurement>>(payload).subscribe({
      next: (data: any) => {
        
        this.ls.hide();
        let usersResp = data as ApiResponse<MeasurementResponse>;
        this.measurements = usersResp.data.measurements ?? [];
        this.totalOrdersCount = usersResp.data.totalCount;
      },
      error: (error: any) => {
        this.ls.hide();
        this.messService.add({ key:'global-toast', severity: 'error', summary: 'Error', detail: 'Failed to load customers.' });
      }
    });
  }
  
  showCustomDateRangeDialog: boolean = false;
  onDateFilterChanged($event: any) {
    if (this.selectedDateFilter.id === 8) {
      this.showCustomDateRangeDialog = true;
    } else {
      const todayDate = moment().toDate();
      switch (this.selectedDateFilter.id) {
        case 1:
        this.dateRange = [moment().startOf('day').toDate(), todayDate];
        break;
        case 2:
        this.dateRange = [moment().startOf('week').toDate(), todayDate];
        break;
        case 3:
        this.dateRange = [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()];
        break;
        case 4:
        this.dateRange = [moment().startOf('month').toDate(), todayDate];
        break;
        case 5:
        this.dateRange = [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()];
        break;
        case 6:
        this.dateRange = [moment().startOf('year').toDate(), todayDate];
        break;
        case 7:
        this.dateRange = [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()];
        break;
        case 9:
        this.dateRange = [];
        break;
      }
    }
    
    this.loadMeasurments();
  }
  
  addUpdateMeasurementDialog(measurement?: Measurement): void {
    const ref = this.dialogService.open(CreateMeasurementComponent, {
      header: measurement ? 'Add New Measurement' : 'Add New Measurement',
      width: '70%',
      height: '80%',
      styleClass: 'measurement-dialog',
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      draggable: true,
      closable: true,
      autoZIndex: true,
      closeOnEscape: false,
      data: {
        measurement: measurement || null,
        businessId: this.businessId || 0
      } 
    });
    
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadMeasurments();
      }
    });
  }
  
  confirmDelete(measurement: Measurement): void {
    this.cs.confirm({
      message: `Are you sure you want to delete measurement?`,
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
        this.ms.deleteMeasurement<ApiResponse<any>>(measurement.id!).subscribe({
          next: (response: any) => {
            let resp = response as ApiResponse<any>;
            if(resp.isSuccess && resp.statusCode == 200){
              this.messService.add({ key:'global-toast', severity: 'success', summary: 'Success', detail: resp.message });
              this.loadMeasurments();
            }
          },
          error: (err: any) => {
            if(err instanceof HttpErrorResponse) {
              this.messService.add({ key: 'global-toast', severity: 'error', summary: 'Error', detail: err.error.message });
            }
          }
        });
      }
    });
  }
}
