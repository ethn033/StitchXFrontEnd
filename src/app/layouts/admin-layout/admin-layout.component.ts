import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TopbarComponent } from '../../dashboard/shared-admin/topbar/topbar.component';
import { SidebarComponent } from '../../dashboard/shared-admin/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
 
}
