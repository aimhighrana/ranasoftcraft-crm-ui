import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../endpoint.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../any2ts.service';
import { SchemaGroupResponse, SchemaGroupDetailsResponse, SchemaGroupCountResponse, CreateSchemaGroupRequest, GetAllSchemabymoduleidsReq, ObjectTypeResponse, GetAllSchemabymoduleidsRes, SchemaGroupWithAssignSchemas } from 'src/app/_models/schema/schema';
import { DataSource } from 'src/app/_modules/schema/_components/upload-data/upload-data.component';
import { DropDownValue, UDRBlocksModel, UdrModel, CoreSchemaBrInfo, Category } from 'src/app/_modules/admin/_components/module/business-rules/business-rules.modal';



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

  public getAllBusinessRules(schemaId): Observable<CoreSchemaBrInfo[]> {
    return this.http.get<CoreSchemaBrInfo[]>(this.endpointService.getBusinessRulesInfo(schemaId));
  }

  public getAllCategoriesList(): Observable<Category[]> {
    return this.http.get<Category[]>(this.endpointService.getCategoriesInfo());
  }

  public createUpdateSchema(params): Observable<string> {
    return this.http.post<string>(this.endpointService.createSchema(), params);
  }

  getFillDataDropdownData(id) {
    return this.http.get(this.endpointService.getFillDataInfo(id));
  }

  createBusinessRule(params): Observable<CoreSchemaBrInfo> {
    return this.http.post<CoreSchemaBrInfo>(this.endpointService.createBr(), params);
  }

  public deleteBr(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointService.deleteBr(id));
  }

  public getBrConditionalOperator(): Observable<string[]> {
    return this.http.get<string[]>(this.endpointService.getBrConditionalOperatorUrl());
  }

  public dropDownValues(fieldId: string, queryString: string): Observable<DropDownValue[]> {
    return this.http.get<DropDownValue[]>(this.endpointService.dropDownValuesUrl(fieldId),{params:{queryString}});
  }

  public saveUpdateUdrBlock(blocks: UDRBlocksModel[]): Observable<string[]> {
    return this.http.post<string[]>(this.endpointService.saveUpdateUdrBlockUrl(), blocks);
  }

  public getConditionList(objectType: string): Observable<UDRBlocksModel[]> {
    return this.http.get<UDRBlocksModel[]>(this.endpointService.conditionListsUrl(objectType));
  }

  public saveUpdateUDR(udrReq: UdrModel) : Observable<string> {
    return this.http.post<string>(this.endpointService.saveUpdateUDRUrl(), udrReq);
  }

  public getBusinessRuleInfo(brId: string): Observable<CoreSchemaBrInfo> {
    return this.http.get<CoreSchemaBrInfo>(this.endpointService.getBusinessRuleInfoUrl(brId));
  }

  /**
   * Http call and return UdrModel
   * getUdrBusinessRuleInfoUrl
   */
  public getUdrBusinessRuleInfo(ruleId: string): Observable<UdrModel> {
    return this.http.get<UdrModel>(this.endpointService.getUdrBusinessRuleInfoUrl(ruleId));
  }

  /**
   * Delete blocks and mapping to brs
   * @param blockId blockid that want to delete
   */
  public deleteConditionBlock(blockId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointService.deleteConditionBlock(blockId));
  }
}
