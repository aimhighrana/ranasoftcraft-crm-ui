import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../endpoint.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../any2ts.service';
import { SchemaGroupResponse, SchemaGroupDetailsResponse, SchemaGroupCountResponse, CreateSchemaGroupRequest, GetAllSchemabymoduleidsReq, ObjectTypeResponse, GetAllSchemabymoduleidsRes, SchemaGroupWithAssignSchemas, WorkflowResponse, WorkflowPath, ExcelValues, DataSource } from 'src/app/_models/schema/schema';
import { DropDownValue, UDRBlocksModel, UdrModel, CoreSchemaBrInfo, Category } from 'src/app/_modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaStaticThresholdRes, SchemaListModuleList, SchemaListDetails, CoreSchemaBrMap } from '@models/schema/schemalist';
import { SchemaScheduler } from '@models/schema/schemaScheduler';



@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private excelValues: BehaviorSubject<ExcelValues> = new BehaviorSubject(null);
  private staticFieldValues: BehaviorSubject<string[]> = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
    private any2tsService: Any2tsService
  ) { }

  /**
   * get column data using the selected column id
   * @param selectedElement Element that's selected currently
   */
  public generateColumnByFieldId(fieldId: string) {
    if(fieldId) {
      const excelData: ExcelValues = this.getExcelValues();
      const column = excelData.headerData.find((header) => header.mdoFldId === fieldId);
      const index = column.columnIndex;
      const columnData: string[] = [];
      excelData.uploadedData.map((row: any[], i) => {
        const columnValue = row[index];
        if(columnValue && i>0) {
          columnData.push(columnValue);
        }
      });

      this.setStaticFieldValues(Array.from(new Set(columnData)));
    }
  }

  public setStaticFieldValues(values: string[]) {
    this.staticFieldValues.next(values);
  }

  public getStaticFieldValues(fieldId: string): string[] {
    if(fieldId && fieldId.trim()){
      this.generateColumnByFieldId(fieldId);
    }
    return this.staticFieldValues.getValue();
  }

  public setExcelValues(values: ExcelValues) {
    this.excelValues.next(values);
  }

  public getExcelValues(): ExcelValues {
    return this.excelValues.getValue();
  }

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

  /**
   * API to get business rules for the schema
   * @param schemaId ID of the schema
   */
  public getAllBusinessRules(schemaId = ''): Observable<CoreSchemaBrInfo[]> {
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
    return this.http.get<DropDownValue[]>(this.endpointService.dropDownValuesUrl(fieldId), { params: { queryString } });
  }

  public saveUpdateUdrBlock(blocks: UDRBlocksModel[]): Observable<string[]> {
    return this.http.post<string[]>(this.endpointService.saveUpdateUdrBlockUrl(), blocks);
  }

  public getConditionList(objectType: string): Observable<UDRBlocksModel[]> {
    return this.http.get<UDRBlocksModel[]>(this.endpointService.conditionListsUrl(objectType));
  }

  public saveUpdateUDR(udrReq: UdrModel): Observable<string> {
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

  /**
   * Return Schema threshold based on config ..
   * Latest Run statics
   * @param schemaId schema id
   * @param variantId variant id is an option params ..
   */
  public getSchemaThresholdStatics(schemaId: string, variantId?: string): Observable<SchemaStaticThresholdRes> {
    return this.http.get<SchemaStaticThresholdRes>(this.endpointService.getSchemaThresholdStatics(schemaId, variantId));
  }
  public uploadCorrectionData(data: DataSource[], objectType: string, schemaId: string, runId: string, plantCode: string, fileSno: string): Observable<string> {
    return this.http.post<any>(this.endpointService.uploadCorrectionDataUrl(objectType, schemaId, runId, plantCode, fileSno), data);
  }

  /**
   * Delete Schema by schemaid
   * @param schemaId deletable schemaid
   */
  public deleteSChema(schemaId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointService.deleteSchema(schemaId));
  }

  /**
   * Get schema list info by moduleId
   * @param moduleId get data based on this id
   */
  public getSchemaInfoByModuleId(moduleId: string): Observable<SchemaListModuleList> {
    return this.http.get<SchemaListModuleList>(this.endpointService.getSchemaInfoByModuleIdUrl(moduleId));
  }

  /**
   * Get schema along with variants ...
   *
   * @param moduleId moduleid its optional parametere if want schema on that module then send it
   * other wise data comes based on plantcode
   */
  public getSchemaWithVariants(moduleId?: string): Observable<SchemaListDetails[]> {
    return this.http.get<SchemaListDetails[]>(
      moduleId ? `${this.endpointService.getSchemaWithVariantsUrl()}?moduleId=${moduleId}`: this.endpointService.getSchemaWithVariantsUrl());
  }

  public updateBrMap(req: CoreSchemaBrMap): Observable<boolean> {
    return this.http.post<boolean>(this.endpointService.updateBrMap(), req);
  }

  public getWorkflowData(): Observable<WorkflowResponse[]>{
    return this.http.get<any>(this.endpointService.getWorkflowDataURL());
  }

  public getWorkFlowPath(ObjectType: string[]): Observable<WorkflowPath[]> {
    return this.http.post<WorkflowPath[]>(this.endpointService.getWorkFlowPathUrl(),ObjectType);
  }

  /**
   * function to POST Api call for create/update schedule
   * @param schemaId Id of schema
   * @param schedulerObject request payload contains scheduler information..
   */
  public createUpdateSchedule(schemaId: string, schedulerObject: SchemaScheduler): Observable<number>{
    return this.http.post<number>(this.endpointService.createUpdateScheduleUrl(schemaId), schedulerObject)
  }
}
