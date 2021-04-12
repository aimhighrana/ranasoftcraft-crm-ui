import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FieldMetaData, ObjectType } from '@models/core/coreModel';
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

  public getAllFieldsForView(moduleId: string): Observable<FieldMetaData[]> {
    return this.http.get<FieldMetaData[]>(this.endpointsService.getAllFieldsForViewUrl(moduleId))
  }

  getObjectTypeDetails(moduleId): Observable<ObjectType>{
    return this.http.get<ObjectType>(this.endpointsService.getObjectTypeDetailsUrl(moduleId));
  }

}
