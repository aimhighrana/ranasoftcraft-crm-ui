import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectType } from '@models/core/coreModel';
import { EndpointsCoreService } from '@services/_endpoints/endpoints-core.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http: HttpClient,
      private endpointsService: EndpointsCoreService) { }

  getAllObjectType(): Observable<ObjectType[]>{
    return this.http.get<ObjectType[]>(this.endpointsService.getAllObjectTypeUrl());
  }

}
