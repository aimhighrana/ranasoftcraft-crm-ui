import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DropDownValues, LayoutConfigWorkflowModel, ReportDashboardReq } from '../_models/widget';
import { ReportList } from '../report-list/report-list.component';
import { PermissionOn, ReportDashboardPermission } from '@models/collaborator';
import { EndpointsAnalyticsService } from 'src/app/_services/_endpoints/endpoints-analytics.service';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

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

  public getDocCount(objectType: string, plantCode:string, isWorkflowDataset?:any): Observable<number> {
    if(isWorkflowDataset) {
      return this.http.get<number>(this.endpointAnalyticService.docCountUrl(objectType),{params:{plantCode, isWorkflowDataset}});
    } else {
      return this.http.get<number>(this.endpointAnalyticService.docCountUrl(objectType), {params:{plantCode}});
    }
  }

  public getCollaboratorPermission(queryString: string) : Observable<PermissionOn> {
    return this.http.get<PermissionOn>(this.endpointService.getPermissionUrl(),{params:{queryString}});
  }

  public getCollaboratorsPermisison(reportId: string): Observable<ReportDashboardPermission[]> {
    return this.http.get<ReportDashboardPermission[]>(this.endpointService.returnCollaboratorsPermisisonUrl(reportId));
  }

  public saveUpdateReportCollaborator(request: ReportDashboardPermission[]): Observable<ReportDashboardPermission[]> {
    return this.http.post<ReportDashboardPermission[]>(this.endpointService.saveUpdateReportCollaborator(), request);
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
    return this.http.get<LayoutConfigWorkflowModel[]>(this.endpointAnalyticService.getlayoutsUrl(),{params:{objectType,wfId, roleId, plantCode}});
  }
}
