import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndpointService } from 'src/app/_services/endpoint.service';
import { DropDownValues, ReportDashboardReq } from '../_models/widget';
import { ReportList } from '../report-list/report-list.component';

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

  public getDocCount(objectType: string): Observable<number> {
    return this.http.get<number>(this.endpointService.docCountUrl(objectType));
  }
}
