import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../generics/api.service';
import { Measurement, MeasurementDetails } from '../../Dtos/requests/request-dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class MeasurementDetailsService extends ApiService {
  private endpoint = environment.api.measurementdetails.controller;
  
  constructor() {
    super();
  }
  
  getMeasurementDetails<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.measurementdetails.enpoints.GetMeasurementDetails, payload);
  }
  
  updateMeasurementStatus<T>(id: number, status: boolean): Observable<ApiResponse<T>> {
    return this.put(this.endpoint + environment.api.measurement.enpoints.UpdateMeasurementStatus+'/'+ id, status);
  }
  
  updateMeasurementDetails<T>(id: number, payload: Measurement): Observable<ApiResponse<T>> {
    return this.put(this.endpoint + environment.api.measurementdetails.enpoints.UpdateMeasurementDetails+'/'+ id, payload);
  }
  
  getMeasurements<T>(payload: any): Observable<ApiResponse<T>> {
    return this.get(this.endpoint + environment.api.measurement.enpoints.GetAllMeasurements, payload);
  }
  
  deleteMeasurement<T>(id: number) : Observable<ApiResponse<T>>{
    return this.delete(this.endpoint + environment.api.auth.enpoints.DeleteUser+'/'+id);
  }
}
