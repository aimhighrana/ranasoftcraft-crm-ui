import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndpointService } from 'src/app/_services/endpoint.service';

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
}
