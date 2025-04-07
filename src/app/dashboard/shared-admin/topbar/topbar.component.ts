import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, AutoCompleteModule, MenuModule, ButtonModule, FormsModule,
    CommonModule,
  FormsModule,
  AutoCompleteModule,
  MenuModule,
  ButtonModule,
  RippleModule // For pRipple effect
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  private authService = inject(AuthService);
  searchText = '';
  filteredItems: string[] = [];
  dummyItems = ['Order #1234', 'Customer: John Doe', 'Fabric Stock', 'Measurement Template'];

  notificationItems = [
    { label: 'New order received', icon: 'pi pi-shopping-bag' },
    { label: 'Payment completed', icon: 'pi pi-check' },
    { separator: true },
    { label: 'View all notifications', icon: 'pi pi-bell' }
  ];

  userMenuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user' },
    { label: 'Settings', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.authService.signOut() }
  ];

  filterItems(event: any) {
    this.filteredItems = this.dummyItems.filter(item => 
      item.toLowerCase().includes(event.query.toLowerCase())
    );
  }
}
