import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../generics/api.service';
import { SuitTypeParameter } from '../../Dtos/requests/request-dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';

type NewType = ApiService;

@Injectable({
  providedIn: 'root'
})
export class SuitTypeParameterService extends ApiService {
  private controller = environment.api.suitypeparameter.controller;
  
  constructor() {
    super();
  }
  
  
  createSuitTypeParameter<T>(payload: SuitTypeParameter): Observable<ApiResponse<T>> {
    return this.post(this.controller + environment.api.suitypeparameter.enpoints.createSuitTypeParameter, payload);
  }

  getSuitTypeParameterById<T>(id: number): Observable<ApiResponse<T>> {
    return this.get(this.controller + environment.api.suitypeparameter.enpoints.getSuitTypeParameterById+'/'+id);
  }
  
  updateSuitTypeParameter<T>(id: number, payload: SuitTypeParameter): Observable<ApiResponse<T>> {
    return this.put(this.controller + environment.api.suitypeparameter.enpoints.updateSuitTypeParameter+'/'+ id, payload);
  }
  
  getSuitTypeParameters<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.controller + environment.api.suitypeparameter.enpoints.getSuitTypeParameters, payload);
  }
  
  deleteSuitTypeParameter<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.controller + environment.api.suitypeparameter.enpoints.deleteSuitTypeParameter+'/'+id);
  }

  updateSuitTypeParameterStatus<T>(id: number, status: boolean): Observable<ApiResponse<T>> {
    return this.put(this.controller + environment.api.suitypeparameter.enpoints.updateSuitTypeParameter+'/'+ id, status);
  }
  
  restoreDeletedSuitTypeParameter<T>(id: number): Observable<ApiResponse<T>> {
    return this.put(this.controller + environment.api.suitypeparameter.enpoints.restoreDeletedSuitTypeParameter+'/'+ id);
  }
  
}