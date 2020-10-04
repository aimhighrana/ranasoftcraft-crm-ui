import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndpointService } from 'src/app/_services/endpoint.service';
import { DropDownValues, LayoutConfigWorkflowModel, ReportDashboardReq } from '../_models/widget';
import { ReportList } from '../report-list/report-list.component';
import { PermissionOn, ReportDashboardPermission } from '@models/collaborator';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService
  ) { }

  public getReportInfo(reportId: number): Observable<any> {
    return this.http.get<any>(this.endpointService.reportDashboardUrl(reportId));
  }

  public getMetaDataFldByFldIds(fieldId: string, code: string[]): Observable<DropDownValues[]> {
    return this.http.post<DropDownValues[]>(this.endpointService.getFieldMetadatByFldUrl(fieldId), code);
  }

  public createUpdateReport(request: ReportDashboardReq): Observable<string> {
    return this.http.post<string>(this.endpointService.createUpdateReportUrl(), request);
  }

  public reportList(): Observable<ReportList[]> {
    return this.http.get<ReportList[]>(this.endpointService.getReportListUrl());
  }

  public getReportConfi(reportId: string): Observable<ReportList> {
    return this.http.get<ReportList>(this.endpointService.getReportConfigUrl(reportId));
  }

  public deleteReport(reportId: string): Observable<boolean> {
    return this.http.delete<boolean>(this.endpointService.deleteReport(reportId));
  }

  public getDocCount(objectType: string, isWorkflowDataset?:any): Observable<number> {
    if(isWorkflowDataset) {
      return this.http.get<number>(this.endpointService.docCountUrl(objectType),{params:{isWorkflowDataset}});
    } else {
      return this.http.get<number>(this.endpointService.docCountUrl(objectType));
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
  public getAllLayoutsForSummary(objectType: string, wfId: string): Observable<LayoutConfigWorkflowModel[]> {
    objectType = objectType ? objectType : '';
    wfId = wfId ? wfId : '';
    return this.http.get<LayoutConfigWorkflowModel[]>(this.endpointService.getlayoutsUrl(),{params:{objectType,wfId}});
  }
}
