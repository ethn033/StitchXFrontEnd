import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ShareDataService } from '../../../services/shared/share-data.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sds = inject(ShareDataService);
  constructor() {
    
  }
}