import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../generics/api.service';
import { SuitType } from '../../Dtos/requests/request-dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class SuitTypeService extends ApiService {
  private controller = environment.api.suitype.controller;
  
  constructor() {
    super();
  }
  
  
  createSuitType<T>(payload: SuitType): Observable<ApiResponse<T>> {
    return this.post(this.controller + environment.api.suitype.enpoints.CreateSuitType, payload);
  }

  getSuitTypeById<T>(id: number): Observable<ApiResponse<T>> {
    return this.get(this.controller + environment.api.suitype.enpoints.GetSuitTypeById+'/'+id);
  }
  
  updateSuitType<T>(id: number, payload: SuitType): Observable<ApiResponse<T>> {
    return this.put(this.controller + environment.api.suitype.enpoints.UpdateSuitType+'/'+ id, payload);
  }
  
  getSuitTypes<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.controller + environment.api.suitype.enpoints.GetAllSuitTypes, payload);
  }
  
  deleteSuitType<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.controller + environment.api.suitype.enpoints.DeleteSuitType+'/'+id);
  }

  updateSuitTypeStatus<T>(id: number, status: boolean): Observable<ApiResponse<T>> {
    return this.put(this.controller + environment.api.suitype.enpoints.UpdateSuitTypeStatus+'/'+ id, status);
  }
  
}