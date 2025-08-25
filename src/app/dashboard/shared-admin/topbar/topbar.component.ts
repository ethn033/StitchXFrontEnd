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
import { ERole } from '../../../enums/enums';
import { Badge } from "primeng/badge";
import { validateCurrentRole } from '../../../utils/utils';
import { Branch, User } from '../../../Dtos/requests/request-dto';
import { SelectChangeEvent, SelectModule } from "primeng/select";
import { LocalStorageService } from '../../../services/generics/local-storage.service';
import { APP_SELECTED_BRANCH } from '../../../utils/global-contstants';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, IconFieldModule, RouterModule, OverlayBadgeModule, AutoCompleteModule, MenuModule, ButtonModule, FormsModule, CommonModule, FormsModule, AutoCompleteModule, MenuModule, ButtonModule, RippleModule, AvatarModule, ToolbarModule, Badge, SelectModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  private as = inject(AuthService);
  private ls = inject(LocalStorageService);
  private sds = inject(ShareDataService);
  userResponse?: User | null;
  
  roles = ERole;
  currentRole?: ERole | null;
  branches: Branch[] = [];
  
  selectedBranch?: Branch | null;
  
  constructor() {
    this.sds.userData.subscribe(userData => {
      this.userResponse = userData as User;
      
      if(this.userResponse.roles)
        this.currentRole = validateCurrentRole(this.userResponse.roles!);

      if(this.userResponse && this.userResponse.business && this.userResponse.business.branches) {
        this.branches = this.userResponse.business.branches;
        // get selected branch if any 
        let selected = this.ls.getItem(APP_SELECTED_BRANCH, true) as Branch;
        if(selected)
          this.selectedBranch = selected;
        else
          this.selectedBranch = this.branches[0];
      }
    });
  }
  
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
          command: () => this.as.signOut()
        }
      ]
    }
  ];
  
  searchText = '';
  filteredItems: string[] = [];
  dummyItems = ['Order #1234', 'Customer: John Doe', 'Fabric Stock', 'Measurement Template'];
  filterItems(event: any) {
    this.filteredItems = this.dummyItems.filter(item => 
      item.toLowerCase().includes(event.query.toLowerCase())
    );
  }
  
  
  onBranchChange(event: SelectChangeEvent) {
    let selected = event.value as Branch;
    if(selected)
      this.ls.removeItem(APP_SELECTED_BRANCH);
    this.ls.setItem(APP_SELECTED_BRANCH, selected, true);
  }
}
