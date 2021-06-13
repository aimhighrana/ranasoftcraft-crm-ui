import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DropDownValues, LayoutConfigWorkflowModel, ReportDashboardReq } from '../_models/widget';
import { ReportList } from '../report-list/report-list.component';
import { PermissionOn, ReportDashboardPermission, WidgetDownloadUser } from '@models/collaborator';
import { EndpointsAnalyticsService } from 'src/app/_services/_endpoints/endpoints-analytics.service';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { ObjectTypeResponse } from '@models/schema/schema';
import { BehaviorSubject } from 'rxjs';
import { EmailTemplateBody, EmailRequestBody,EmailResponseBody, EmailTemplate } from '../_models/email';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  selectedTemplate: BehaviorSubject<EmailTemplateBody> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private endpointService: EndpointsClassicService,
    private endpointAnalyticService: EndpointsAnalyticsService
  ) { }

  public getReportInfo(reportId: number, plantCode: string): Observable<any> {
    return this.http.get<any>(this.endpointAnalyticService.reportDashboardUrl(reportId), {params: {plantCode}});
  }

  public getMetaDataFldByFldIds(fieldId: string, code: string[], plantCode: string): Observable<DropDownValues[]> {
    return this.http.post<DropDownValues[]>(this.endpointAnalyticService.getFieldMetadatByFldUrl(fieldId), code, {params: {plantCode}});
  }

  public createUpdateReport(request: ReportDashboardReq, plantCode: string): Observable<string> {
    return this.http.post<string>(this.endpointAnalyticService.createUpdateReportUrl(), request, {params: {plantCode}});
  }

  public reportList(plantCode: string, roleId:string): Observable<ReportList[]> {
    return this.http.get<ReportList[]>(this.endpointAnalyticService.getReportListUrl(), {params: {plantCode, roleId}});
  }

  public getReportConfi(reportId: string, roleId:string): Observable<ReportList> {
    return this.http.get<ReportList>(this.endpointAnalyticService.getReportConfigUrl(reportId), {params: {roleId}});
  }

  public deleteReport(reportId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointAnalyticService.deleteReport(reportId));
  }

  public getDocCount(objectType: string, plantCode:string, isWorkflowDataset?:any, isCustomdataSet?:any): Observable<number> {
    if(isWorkflowDataset) {
      return this.http.get<number>(this.endpointAnalyticService.docCountUrl(objectType),{params:{plantCode, isWorkflowDataset}});
    } else if(isCustomdataSet) {
      return this.http.get<number>(this.endpointAnalyticService.docCountUrl(objectType),{params:{plantCode, isCustomdataSet}});
    } else {
      return this.http.get<number>(this.endpointAnalyticService.docCountUrl(objectType), {params:{plantCode}});
    }
  }

  public getCollaboratorPermission(queryString: string, fetchCount: any) : Observable<PermissionOn> {
    return this.http.get<PermissionOn>(this.endpointService.getAllUserDetailsUrl(),{params:{ queryString, fetchCount }});
  }

  public getCollaboratorsPermisison(reportId: string): Observable<ReportDashboardPermission[]> {
    return this.http.get<ReportDashboardPermission[]>(this.endpointService.returnCollaboratorsPermisisonUrl(reportId));
  }

  public saveUpdateReportCollaborator(request: ReportDashboardPermission[]): Observable<ReportDashboardPermission[]> {
    return this.http.post<ReportDashboardPermission[]>(this.endpointService.saveUpdateReportCollaborator(), request);
  }

  public saveUpdateportDownload(request: WidgetDownloadUser[],widgetId:string, userName :string, conditionList: any): Observable<ReportDashboardPermission[]> {
    return this.http.post<ReportDashboardPermission[]>(this.endpointAnalyticService.saveReportDownload(widgetId,userName), request, {params: {conditionList}});
  }

  public deleteCollaborator(permissionId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointService.deleteCollaboratorUrl(permissionId));
  }

  /**
   * Get all layouts ..
   * @param objectType objecttype for summary
   * @param wfId wfid for find layouts
   */
  public getAllLayoutsForSummary(objectType: string, wfId: string, roleId: string, plantCode: string): Observable<LayoutConfigWorkflowModel[]> {
    objectType = objectType ? objectType : '';
    wfId = wfId ? wfId : '';
    return this.http.get<LayoutConfigWorkflowModel[]>(this.endpointService.getlayoutsUrl(),{params:{objectType,wfId, roleId, plantCode}});
  }

  public getCustomData(): Observable<ObjectTypeResponse[]> {
    return this.http.get<ObjectTypeResponse[]>(this.endpointAnalyticService.getCustomDataUrl());
  }

  public getCustomDatasetFields(objectId: string): Observable<any> {
    return this.http.get<any>(this.endpointAnalyticService.getCustomDatasetFieldsUrl(objectId));
  }

  public shareReport(request: EmailRequestBody, reportId:string): Observable<EmailResponseBody[]> {
    return this.http.post<EmailResponseBody[]>(this.endpointAnalyticService.shareReport(reportId), request);
  }

  public getAllTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(this.endpointAnalyticService.getAllTemplates());
  }

  public getTemplateById(_id:string): Observable<EmailTemplateBody> {
    return this.http.get<EmailTemplateBody>(this.endpointAnalyticService.getTemplateById(_id));
  }
}
