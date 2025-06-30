import { LoadingService } from '../../services/generics/loading.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TopbarComponent } from '../../dashboard/shared-admin/topbar/topbar.component';
import { SidebarComponent } from '../../dashboard/shared-admin/sidebar/sidebar.component';
import { LoadingComponent } from '../../components/shared/loading/loading.component';

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    SidebarComponent,
    LoadingComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent  {

  loadingService: LoadingService = inject(LoadingService);
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
      }
    });
  } 
}
