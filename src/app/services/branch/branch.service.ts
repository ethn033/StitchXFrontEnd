import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Branch } from '../../Dtos/requests/request-dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/base-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends ApiService {
  private readonly endpoint: string = environment.api.branch.controller;

  createBranch<T>(request: Branch) : Observable<ApiResponse<T>> {
      return this.post(this.endpoint+environment.api.branch.enpoints.CreateBranch, request);
  }
}
