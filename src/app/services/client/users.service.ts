import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';
import { environment } from '../../../environments/environment';
import { User } from '../../Dtos/requests/request-dto';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService{
  private endpoint = environment.api.auth.controller;

  createUsers<T>(payload: User): Observable<ApiResponse<T>> {
    return this.post(this.endpoint + environment.api.auth.enpoints.Register, payload);
  }

  updateUsers<T>(id: number, payload: User): Observable<ApiResponse<T>> {
    return this.put(this.endpoint + environment.api.auth.enpoints.UpdateUser+'/'+ id, payload);
  }

  getUsers<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.auth.enpoints.GetAllUsers, payload);
  }

  deleteUser<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.endpoint + environment.api.auth.enpoints.DeleteUser+'/'+id);
  }
}
