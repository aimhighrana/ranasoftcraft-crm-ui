import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendReqForSchemaDataTableColumnInfo, SendDataForSchemaTableShowMore, SchemaDataTableColumnInfoResponse, RequestForSchemaDetailsWithBr, SchemaTableViewRequest, OverViewChartDataSet, CategoryInfo, CategoryChartDataSet, MetadataModeleResponse, SchemaBrInfo, SchemaCorrectionReq, SchemaExecutionLog, SchemaTableViewFldMap, ClassificationNounMod, SchemaMROCorrectionReq } from 'src/app/_models/schema/schemadetailstable';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { PermissionOn, SchemaDashboardPermission } from '@models/collaborator';
import { EndpointsAnalyticsService } from '@services/_endpoints/endpoints-analytics.service';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaDetailsService {

  constructor(
    private http: HttpClient,
    public endpointService: EndpointsClassicService,
    private any2tsService: Any2tsService,
    private analyticsEndpointService: EndpointsAnalyticsService
  ) { }

  private getDateString(days) {
    return moment().add(days, 'd').format('MM/DD/YYYY HH:mm');
  }

  public getSchemaDataTableColumnInfo(sendData: SendReqForSchemaDataTableColumnInfo): Observable<SchemaDataTableColumnInfoResponse> {
    return this.http.post<any>(this.endpointService.getSchemaDataTableColumnInfoUrl(), sendData).pipe(map(data => {
      return this.any2tsService.any2SchemaDataTableResponse(data);
    }));
  }

  public getSchemaDetailsBySchemaId(schemaId: string): Observable<SchemaListDetails> {
    return this.http.post<any>(this.endpointService.getSchemaDetailsBySchemaId(schemaId), '').pipe(map(data => {
      return null; // this.any2tsService.returnSchemaListDataForGrp(data, schemaId);
    }));
  }
  public getSchemaDataTableShowMore(scrollId: string): Observable<any> {
    const sendData: SendDataForSchemaTableShowMore = new SendDataForSchemaTableShowMore(scrollId, '');
    return this.http.post<any>(this.endpointService.getShowMoreSchemaTableDataUrl(), sendData);
  }

  /**
   * Call http for table data response
   * @param request request for table data
   */
  public getSchemaTableData(request: RequestForSchemaDetailsWithBr): Observable<any> {
    return this.http.post<any>(this.endpointService.getSchemaTableDetailsUrl(), request);
  }

  /**
   * updateSchemaTableView
   */
  public updateSchemaTableView(schemaTableViewReq: SchemaTableViewRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.getUpdateSchemaTableViewUrl(), schemaTableViewReq);
  }

  public getOverviewChartDetails(schemaId: string, variantId: string, runId: string): Observable<OverViewChartDataSet> {
    schemaId = schemaId ? schemaId : '';
    runId = runId ? runId : '';
    return this.http.get<any>(this.endpointService.getOverviewChartDataUrl(schemaId, variantId, runId)).pipe(map(data => {
      return this.any2tsService.any2OverviewChartData(data);
    }));
  }

  public getAllCategoryInfo(): Observable<CategoryInfo[]> {
    return this.http.get<any>(this.endpointService.getCategoryInfoUrl()).pipe(map(data => {
      return this.any2tsService.any2CategoryInfo(data);
    }));
  }

  public getSchemaStatus(): Observable<string[]> {
    return this.http.get<any>(this.endpointService.getSchemaStatusUrl()).pipe(map(data => {
      return this.any2tsService.any2SchemaStatus(data);
    }));
  }

  public getCategoryChartDetails(schemaId: string, variantId: string, categoryId: string, status: string): Observable<CategoryChartDataSet> {
    return this.http.get<any>(this.endpointService.categoryChartData(schemaId, variantId, categoryId, status)).pipe(map(response => {
      return this.any2tsService.any2CategoryChartData(response);
    }));
  }

  public getMetadataFields(objectId: string): Observable<MetadataModeleResponse> {
    return this.http.get<any>(this.endpointService.getMetadataFields(objectId)).pipe(map(res => {
      return this.any2tsService.any2MetadataResponse(res);
    }));
  }

  public getWorkflowFields(ObjectType: string[]): Observable<any>{
    return this.http.post<any>(this.endpointService.getWorkFlowFieldsUrl(), ObjectType);
  }

  public getAllSelectedFields(schemaId: string, variantId: string): Observable<SchemaTableViewFldMap[]> {
    return this.http.get<SchemaTableViewFldMap[]>(this.endpointService.getAllSelectedFields(), { params: { schemaId, variantId } });
  }

  public getSchemaBrInfoList(schemaId: string): Observable<SchemaBrInfo[]> {
    return this.http.get<SchemaBrInfo[]>(this.endpointService.getSchemaBrInfoList(schemaId));
  }

  public doCorrection(schemaId: string, request: SchemaCorrectionReq): Observable<any> {
    return this.http.post<any>(this.endpointService.doCorrectionUrl(schemaId), request);
  }

  public getCorrectedRecords(schemaId: string, fetchSize: any, fetchCount: any): Observable<any> {
    return this.http.get<any>(this.endpointService.getCorrectedRecords(schemaId), { params: { fetchSize, fetchCount } });
  }

  public getLastBrErrorRecords(schemaId: string, objnrs: string[]): Observable<any> {
    return this.http.post<any>(this.endpointService.getLastBrErrorRecords(schemaId), objnrs);
  }

  public getSchemaExecutionLogs(schemaId: string): Observable<SchemaExecutionLog[]> {
    return this.http.get<SchemaExecutionLog[]>(this.endpointService.getSchemaExecutionLogUrl(schemaId));
  }

  /**
   * Approve corrected records ..
   * @param schemaId append as request path
   * @param objNrs send as request body
   * @param roleId append as request params
   */
  public approveCorrectedRecords(schemaId: string, objNrs: string[], roleId?: string): Observable<any> {
    return this.http.post(this.endpointService.approveCorrectedRecords(schemaId), objNrs, {params:{roleId}});
  }

  /**
   * Reset scheama corrected records ..
   * @param schemaId append as request path ..
   * @param runId append as request query ..
   * @param objNrs append as request body
   */
  public resetCorrectionRecords(schemaId: string, runId: string, objNrs: string[]): Observable<any> {
    return this.http.put<any>(this.endpointService.resetCorrectionRecords(schemaId), objNrs, {params:{runId}});
  }

  public getAllUserDetails(queryString: string, fetchCount: any): Observable<PermissionOn> {
    return this.http.get<PermissionOn>(this.endpointService.getAllUserDetailsUrl(), { params: { queryString, fetchCount } });
  }

  public getCollaboratorDetails(schemaId: string): Observable<SchemaDashboardPermission[]> {
    return this.http.get<SchemaDashboardPermission[]>(this.endpointService.getCollaboratorDetailsUrl(schemaId));
  }

  public createUpdateUserDetails(request: SchemaDashboardPermission[]): Observable<number[]> {
    return this.http.post<number[]>(this.endpointService.createUpdateUserDetailsUrl(), request);
  }

  public deleteCollaborator(sNoList: number[]): Observable<boolean> {
    return this.http.request<boolean>('delete', this.endpointService.deleteSchemaCollaboratorDetailsUrl(), {body: sNoList});
  }

  public saveNewSchemaDetails(objectId: string, runNow: boolean, variantId: string, fileSno: string, requestObject: {}) {
    return this.http.post(this.endpointService.saveNewSchemaUrl(objectId, runNow, variantId, fileSno), requestObject)
  }

  public createUpdateReportDataTable(widgetId: string,request: object[]): Observable<boolean> {
    return this.http.post<boolean>(this.analyticsEndpointService.createUpdateReportDataTable(widgetId), request)
  }

  public getClassificationNounMod(schemaId: string, runId: string,requestStatus: string, variantId?: string, searchString?: string, scrollId?: string): Observable<ClassificationNounMod> {
    searchString = searchString ? searchString : '';
    requestStatus = requestStatus ? requestStatus : '';
    return this.http.get<any>(this.endpointService.getClassificationNounMod(schemaId, runId, variantId), {params:{searchString, requestStatus}}).pipe(map(res=>{
      const  finalRes = {} as ClassificationNounMod;
      const mro = res.filter(fil => fil.ruleType === 'mro_local_lib');
      finalRes.mro_local_lib = {doc_cnt:mro[0] ?mro[0].doc_count : 0, info: mro[0] ? mro[0].info : []};

      const gsn = res.filter(fil => fil.ruleType === 'mro_gsn_lib');
      finalRes.mro_gsn_lib = {doc_cnt:gsn[0] ?gsn[0].doc_count : 0, info: gsn[0] ? gsn[0].info : []};

      const unmatched = res.filter(fil => fil.ruleType === 'unmatched');
      finalRes.unmatched = {doc_count: unmatched[0].doc_count ? unmatched[0].doc_count : 0};

      return finalRes;
    }));
  }

  /**
   * Get classification data based on nounCode and modCode ..
   *
   * @param schemaId append on request
   * @param runid appned on request path
   * @param nounCode append on requet params
   * @param modifierCode append on requet params
   * @param ruleType append on requet params
   * @param objectNumberAfter append on requet params
   */
  public getClassificationData(schemaId: string, runid: string, nounCode: string, modifierCode: string, ruleType: string,requestStatus: string, searchString, objectNumberAfter?: string): Observable<any> {
    return this.http.get<any>(this.endpointService.getClassificationDataTableUrl(schemaId, runid), {params:{nounCode, modifierCode, ruleType,requestStatus, searchString, objectNumberAfter}});
  }

  /**
   * Generate / create  cross module objectnumbet ..
   * @param schemaId append in parameter
   * @param objectType append in parameter
   * @param objectNumber append in parameter
   */
  public generateCrossEntry(schemaId: string, objectType: string, objectNumber: string) {
    return this.http.get<string>(this.endpointService.generateCrossEntryUri(schemaId, objectType, objectNumber));
  }

  /**
   * Do correction in schema classification output ..
   * @param schemaId append in request parametere ..
   * @param request append in request body ..
   */
  public doCorrectionForClassification(schemaId: string ,fieldId: string,  request: SchemaMROCorrectionReq): Observable<any>{
    fieldId = fieldId ? fieldId : '';
    return this.http.post<any>(this.endpointService.doClassificationCorrectionUri(), request , {params:{schemaId, fieldId}});
  }

  /**
   * Approve mro classification .. records ..
   *
   * @param schemaId append as required parameter ..
   * @param runId append as optional param..
   * @param objNr required parameter ..
   */
  public approveClassification(schemaId: string, runId: string, objNr: string[]): Observable<boolean> {
    return this.http.put<boolean>(this.endpointService.approveClassificationUri(), objNr, {params:{schemaId, runId}});
  }

  /**
   * Reject mro classification data ..
   *
   * @param schemaId as request
   * @param runId as optional request
   * @param objNr as required parameter ..
   */
  public rejectClassification(schemaId: string, runId: string, objNr: string[]): Observable<boolean> {
    return this.http.put<boolean>(this.endpointService.rejectClassificationUri(), objNr, {params:{schemaId, runId}});
  }

  public getExecutionOverviewChartData(schemaId: string, variantId: string): Observable<SchemaExecutionLog[]> {
    return this.http.get<any>(this.endpointService.getExecutionOverviewChartDataUrl(schemaId, variantId));
  }

}
