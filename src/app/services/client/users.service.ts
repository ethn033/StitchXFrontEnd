import { Injectable, QueryList } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';
import { environment } from '../../../environments/environment';
import { ERole } from '../../enums/enums';
import { RegisterDto } from '../../Dtos/requests/requestDto';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService{
  private endpoint = environment.api.auth.controller;

  createUsers<T>(payload: RegisterDto): Observable<ApiResponse<T>> {
    return this.post(this.endpoint + environment.api.auth.enpoints.Register, payload);
  }

  getUsers<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.auth.enpoints.GetAllUsers, payload);
  }

  deleteUser<T>(id: number) : Observable<ApiResponse<T>>{
    return this.get(this.endpoint + environment.api.auth.enpoints.DeleteUser);
  }
}
