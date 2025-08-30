import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarModule } from 'primeng/avatar';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';
import { ShareDataService } from '../../../services/shared/share-data.service';
import { ERole } from '../../../enums/enums';
import { Badge } from "primeng/badge";
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
  as = inject(AuthService);
  ls = inject(LocalStorageService);
  router = inject(Router);
  sds = inject(ShareDataService);
  userResponse?: User | null;
  
  roles = ERole;
  branches: Branch[] = [];
  
  selectedBranch?: Branch | null;
  
  constructor() {
    this.userResponse = this.sds.currentUser as User;
    this.branches = this.sds.getCurrentBranches() as Branch[];
    this.selectedBranch = this.sds.getCurrentBranch();
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
      this.ls.setItem(APP_SELECTED_BRANCH, selected, true);
  }
}
