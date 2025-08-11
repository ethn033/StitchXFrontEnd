import { LoadingService } from '../../services/generics/loading.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TopbarComponent } from '../../dashboard/shared-admin/topbar/topbar.component';
import { SidebarComponent } from '../../dashboard/shared-admin/sidebar/sidebar.component';
import { LoadingComponent } from '../../components/shared/loading/loading.component';
import { UserResponse } from '../../Dtos/responses/loginResponseDto';
import { APP_USER } from '../../utils/global-contstants';
import { LocalStorageService } from '../../services/generics/local-storage.service';
import { ShareDataService } from '../../services/shared/share-data.service';

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
  userResponse? : UserResponse;
  private ls = inject(LocalStorageService);
  private sds = inject(ShareDataService);
  loadingService: LoadingService = inject(LoadingService);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (event instanceof NavigationEnd) {
        this.loadingService.hide();
      }
    });
    
    
    this.userResponse = this.ls.getItem(APP_USER, true) as UserResponse;
    if(!this.userResponse) {
      this.router.navigate(['auth'], { replaceUrl: true });
      return;
    }
    
    this.sds.setUserResponse(this.userResponse);
  } 
}