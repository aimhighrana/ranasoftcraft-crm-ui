import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../endpoint.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../any2ts.service';
import { SchemaGroupResponse, SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
    private any2tsService: Any2tsService
  ) { }

  /*
  public onLoadSchema(): Observable<any> {
    return this.http.get(this.endpointService.onLoadSchema()).pipe(map(data => {
      return this.any2tsService.anyToSchemaListOnLoadResponse(data);
    }));
  }
  public createSchemaGroup(schemaGroup: SchemaGroupRequest ): Observable<any> {
    return this.http.post<SchemaGroupRequest>(this.endpointService.getCreateSchemaGroupUtl(), schemaGroup, this.httpOptions);
  }
  public schemaGroupMapping(schemaGroupId: number , schemaIds: string[]): Observable<any> {
    const sendData = JSON.stringify(schemaIds);
    const sendUrl = this.endpointService.getSchemaGroupMappingUrl(schemaGroupId) + '?selectedSchemas=' + sendData;
    return this.http.post<any>(sendUrl, sendData, this.httpOptions);
  } */
  public getAllSchemaGroup(): Observable<SchemaGroupResponse[]> {
    return this.http.get(this.endpointService.getSchemaGroupsUrl()).pipe(map(data => {
      return this.any2tsService.any2SchemaGroupResponse(data);
    }));
  }
  /*
  public getSchemaDescModuleIdByGroupId(groupId: string): Observable<any> {
    return this.http.get<any>(this.endpointService.getSchemaDescModuleIdByGroupId(groupId));
  }
  public deleteSchemaGroupAndMapping(groupId: string): Observable<any> {
    return this.http.post<any>(this.endpointService.deleteSchemaGroupUrl(groupId), '');
  } */

  public getSchemaGroupDetailsBySchemaGrpId(schemaGroupId: string): Observable<SchemaGroupDetailsResponse> {
    return this.http.post<any>(this.endpointService.getSchemaGroupDetailsByGrpIdUrl(schemaGroupId), '').pipe(map(data => {
      return this.any2tsService.any2SchemaDetails(data);
    }));
  }
}
