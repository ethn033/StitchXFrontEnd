import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { environment } from '../../../environments/environment';
import { Measurement } from '../../Dtos/requests/request-dto';
import { ApiResponse } from '../../models/base-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService extends ApiService {
  private endpoint = environment.api.measurement.controller;
  
  constructor() {
    super();
  }
  
  createMeasurement<T>(payload: Measurement): Observable<ApiResponse<T>> {
    return this.post(this.endpoint + environment.api.measurement.enpoints.GetAllMeasurements, payload);
  }
  
  updateMeasurementStatus<T>(id: number, payload: Measurement): Observable<ApiResponse<T>> {
    return this.put(this.endpoint + environment.api.auth.enpoints.UpdateUser+'/'+ id, payload);
  }
  
  getMeasurements<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.measurement.enpoints.GetAllMeasurements, payload);
  }
  
  deleteMeasurement<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.endpoint + environment.api.auth.enpoints.DeleteUser+'/'+id);
  }
}
