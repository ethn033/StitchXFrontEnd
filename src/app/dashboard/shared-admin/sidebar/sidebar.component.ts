import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isCollapsed = false;
  isMobileMenuOpen = false;
  @Input() collapsed = false;
  toggleCollapse() {
    if (window.innerWidth >= 992) {
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }
}