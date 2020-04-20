import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../endpoint.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../any2ts.service';
import { SchemaGroupResponse, SchemaGroupDetailsResponse, SchemaGroupCountResponse, CreateSchemaGroupRequest, GetAllSchemabymoduleidsReq, ObjectTypeResponse, GetAllSchemabymoduleidsRes, SchemaGroupWithAssignSchemas } from 'src/app/_models/schema/schema';
import { DataSource } from 'src/app/_modules/schema/_components/upload-data/upload-data.component';


@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
    private any2tsService: Any2tsService
  ) { }

  public getAllSchemaGroup(): Observable<SchemaGroupResponse[]> {
    return this.http.get(this.endpointService.getSchemaGroupsUrl()).pipe(map(data => {
      return this.any2tsService.any2SchemaGroupResponse(data);
    }));
  }
  public getSchemaGroupDetailsBySchemaGrpId(schemaGroupId: string): Observable<SchemaGroupDetailsResponse> {
    return this.http.get<any>(this.endpointService.getSchemaGroupDetailsByGrpIdUrl(schemaGroupId)).pipe(map(data => {
      return this.any2tsService.any2SchemaDetails(data);
    }));
  }

  public getSchemaGroupCounts(groupId: number): Observable<SchemaGroupCountResponse> {
    return this.http.get<any>(this.endpointService.getSchemaGroupCountUrl(groupId)).pipe(map(data => {
      return this.any2tsService.any2SchemaGroupCountResposne(data);
    }));
  }

  public createSchemaGroup(createSchemaGroupRequest: CreateSchemaGroupRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.getCreateSchemaGroupUrl(), createSchemaGroupRequest);
  }

  public getAllSchemabymoduleids(getAllSchemabymoduleidsReq: GetAllSchemabymoduleidsReq): Observable<GetAllSchemabymoduleidsRes[]> {
    return this.http.post<any>(this.endpointService.getAllSchemabymoduleids(), getAllSchemabymoduleidsReq).pipe(map(data => {
      return this.any2tsService.any2GetAllSchemabymoduleidsResponse(data);
    }));
  }

  public getAllObjectType(): Observable<ObjectTypeResponse[]> {
    return this.http.get<any>(this.endpointService.getAllObjecttypeUrl()).pipe(map(data => {
      return this.any2tsService.any2ObjectType(data);
    }));
  }

  public getSchemaGroupDetailsByGroupId(schemaGroupId: string): Observable<SchemaGroupWithAssignSchemas> {
    return this.http.get<any>(this.endpointService.groupDetailswithAssignedschemaUrl(schemaGroupId)).pipe(map(response => {
      return this.any2tsService.any2SchemaGroupWithAssignSchemasResponse(response);
    }));
  }

  public scheduleSchemaCount(schemaId: string): Observable<number> {
    return this.http.get<any>(this.endpointService.scheduleSchemaCount(schemaId));
  }

  public deleteSchemaGroup(groupId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointService.deleteSchemaGroupUrl(groupId));
  }

  public uploadUpdateFileData(file: File, fileSno: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.endpointService.uploadFileDataUrl()}?fileSno=${fileSno}`, formData);
  }

  public uploadData(data: DataSource[], objectType: string, fileSno: string): Observable<string> {
    return this.http.post<any>(this.endpointService.uploadDataUrl(objectType, fileSno), data);
  }
  public getAllBusinessRules(schemaId) {
    return this.http.get(this.endpointService.getBusinessRulesInfo(schemaId));
  }

  public getAllCategoriesList() {
    return this.http.get<any>(this.endpointService.getCategoriesInfo()).pipe(map(data => {
      return this.any2tsService.any2CategoriesList(data);
    }));
  }

  public createUpdateSchema(params) {
    return this.http.post(this.endpointService.createSchema(), params);
  }

  getFillDataDropdownData(id) {
    return this.http.get(this.endpointService.getFillDataInfo(id));
  }

  createBusinessRule(params) {
    return this.http.post(this.endpointService.createBr(), params);
  }

  public deleteBr(id) {
    return this.http.delete(this.endpointService.deleteBr(id));
  }
}
