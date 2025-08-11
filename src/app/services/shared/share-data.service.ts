import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserResponse } from '../../Dtos/responses/loginResponseDto';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private userResponseSubject = new BehaviorSubject<UserResponse | null>(null);
  userData = this.userResponseSubject.asObservable();

  constructor() { }

  setUserResponse(userResponse: UserResponse) {
    this.userResponseSubject.next(userResponse);
  }
}
