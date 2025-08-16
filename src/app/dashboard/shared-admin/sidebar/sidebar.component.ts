import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { UserResponse } from '../../../Dtos/responses/loginResponseDto';
import { ERole } from '../../../enums/enums';
import { ERoleToString } from '../../../utils/utils';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private sds = inject(ShareDataService);
  userResponse?: UserResponse | null;

  roles = ERole;
  currentRole?: ERole | null;

  constructor() {
    this.sds.userData.subscribe(userData => {
      this.userResponse = userData;
      if(this.userResponse && this.userResponse.roles.length > 0) {
        let roles = this.userResponse.roles;
        if(roles.includes(ERoleToString[ERole.SOFT_OWNER])) {
          this.currentRole = ERole.SOFT_OWNER;
        }
        if(roles.includes(ERoleToString[ERole.SHOP_OWNER])) {
          this.currentRole = ERole.SHOP_OWNER;
        }
        if(roles.includes(ERoleToString[ERole.TAILOR])) {
          this.currentRole = ERole.TAILOR;
        }
        if(roles.includes(ERoleToString[ERole.CUTTER])) {
          this.currentRole = ERole.CUTTER;
        }
        if(roles.includes(ERoleToString[ERole.CUSTOMER])) {
          this.currentRole = ERole.CUSTOMER;
        }
      }
    });
  }
}