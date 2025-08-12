import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarModule } from 'primeng/avatar';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { UserResponse } from '../../../Dtos/responses/loginResponseDto';
import { ERole, ERoleToString } from '../../../enums/enums';
import { Badge } from "primeng/badge";

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, IconFieldModule, RouterModule, OverlayBadgeModule, AutoCompleteModule, MenuModule, ButtonModule, FormsModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    MenuModule,
    ButtonModule,
    RippleModule, AvatarModule, ToolbarModule, Badge],
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css'
  })
  export class TopbarComponent {
    private authService = inject(AuthService);
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
    
    searchText = '';
    filteredItems: string[] = [];
    dummyItems = ['Order #1234', 'Customer: John Doe', 'Fabric Stock', 'Measurement Template'];
    
    userMenuItems: MenuItem[] = [
     
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            shortcut: '⌘+O'
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q',
            command: () => this.authService.signOut()
          }
        ]
      }
    ];
    
    filterItems(event: any) {
      this.filteredItems = this.dummyItems.filter(item => 
        item.toLowerCase().includes(event.query.toLowerCase())
      );
    }
  }
  