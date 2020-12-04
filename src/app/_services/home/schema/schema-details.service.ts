import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../../endpoint.service';
import { Observable } from 'rxjs';
import { SendReqForSchemaDataTableColumnInfo, SendDataForSchemaTableShowMore, SchemaDataTableColumnInfoResponse, RequestForSchemaDetailsWithBr, SchemaTableViewRequest, OverViewChartDataSet, CategoryInfo, CategoryChartDataSet, MetadataModeleResponse, SchemaBrInfo, SchemaCorrectionReq, SchemaExecutionLog, SchemaTableViewFldMap, ClassificationNounMod } from 'src/app/_models/schema/schemadetailstable';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { PermissionOn, SchemaDashboardPermission } from '@models/collaborator';

@Injectable({
  providedIn: 'root'
})
export class SchemaDetailsService {

  constructor(
    private http: HttpClient,
    public endpointService: EndpointService,
    private any2tsService: Any2tsService
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

  public submitReviewedRecords(schemaId: string): Observable<any> {
    return this.http.post(this.endpointService.submitReviewedRecordsUrl(schemaId), null);
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
    return this.http.post<boolean>(this.endpointService.createUpdateReportDataTable(widgetId), request)
  }

  public getClassificationNounMod(schemaId: string, runId: string, variantId?: string, queryString?: string, scrollId?: string): Observable<ClassificationNounMod> {
    if(queryString) {

    } else {
      return this.http.get<any>(this.endpointService.getClassificationNounMod(schemaId, runId, variantId)).pipe(map(res=>{
        const  finalRes = {} as ClassificationNounMod;
        const mro = res.filter(fil => fil.ruleType === 'BR_MRO_LIBRARY');
        finalRes.BR_MRO_LIBRARY = {doc_cnt:mro[0] ?mro[0].doc_count : 0, info: mro[0] ? mro[0].info : []};

        const gsn = res.filter(fil => fil.ruleType === 'gsn');
        finalRes.gsn = {doc_cnt:gsn[0] ?gsn[0].doc_count : 0, info: gsn[0] ? gsn[0].info : []};;

        return finalRes;
      }));
    }
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
  public getClassificationData(schemaId: string, runid: string, nounCode: string, modifierCode: string, ruleType: string, objectNumberAfter?: string): Observable<any> {
    return this.http.get<any>(this.endpointService.getClassificationDataTableUrl(schemaId, runid), {params:{nounCode, modifierCode, ruleType, objectNumberAfter}});
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

}
