import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';
import { environment } from '../../../environments/environment';
import { ERole } from '../../enums/enums';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService{
  private endpoint = environment.api.auth.controller;

  getUsers<T>(page: number = 1, pageSize: number = 20, search: string = "", role: ERole = ERole.ALL): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.auth.enpoints.GetAllUsers);
  }

  deleteUser<T>(id: number) : Observable<ApiResponse<T>>{
    return this.get(this.endpoint + environment.api.auth.enpoints.DeleteUser);
  }
}
