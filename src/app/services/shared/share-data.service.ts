import { LogoComponent } from './../../components/shared/logo/logo.component';
import { ERoleToString } from './../../utils/utils';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch, Business, User } from '../../Dtos/requests/request-dto';
import { ERole } from '../../enums/enums';
import { LocalStorageService } from '../generics/local-storage.service';
import { APP_SELECTED_BRANCH } from '../../utils/global-contstants';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  ls = inject(LocalStorageService);
  private userResponseSubject = new BehaviorSubject<User | null>(null);
  userData = this.userResponseSubject.asObservable();

  currentUser!: User;

  constructor() { }

  setUserResponse(currentUser: User) {
    this.currentUser = currentUser as User;
    this.userResponseSubject.next(currentUser);
  }

  currentUserId() : number {
    return this.currentUser.id || 0;
  }

  getCurrentUserBusinessId() : number {
    if(!this.currentUser || !this.currentUser.business) return 0;
    return this.currentUser.business.id || 0;
  }

  isSoftOwner() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.SOFT_OWNER]) ?? false;
  }

  isShopOwner() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.SHOP_OWNER]) ?? false;
  }

  isTailor() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.TAILOR]) ?? false;
  }

  isCutter() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.CUTTER]) ?? false;
  }
  
  isCustomer() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.CUSTOMER]) ?? false;
  }

  isSweeper() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.SWEEPER]) ?? false;
  }

  isDemoUser() : boolean {
    return this.currentUser.roles?.includes(ERoleToString[ERole.DEMO_USER]) ?? false;
  }

  isBusinessExists(): boolean { 
    if(!this.currentUser || !this.currentUser.business) return false;
    return true;
  }

  isBranchExists(): boolean { 
    if(!this.currentUser || !this.currentUser.business || !this.currentUser.business.branches || this.currentUser.business.branches.length <= 0) return false;
    return true;
  }

  getCurrentBusiness(): Business | null {
    return this.currentUser && this.currentUser.business ? this.currentUser.business : null;
  }

  getCurrentBranch(): Branch | null {
    let currentBranch = this.ls.getItem(APP_SELECTED_BRANCH, true);
    if(currentBranch) {
      this.ls.setItem(APP_SELECTED_BRANCH, currentBranch, true);
    }
    else if(this.currentUser && this.currentUser.business && this.currentUser.business.branches && this.currentUser.business.branches.length > 0) {
      currentBranch = this.currentUser.business.branches[0];
      this.ls.setItem(APP_SELECTED_BRANCH, currentBranch, true);
    } 
    return currentBranch;
  }

  getCurrentBranches(): Branch[] | [] {
    return this.currentUser && this.currentUser.business && this.currentUser.business.branches ? this.currentUser.business.branches : [];
  }
}
