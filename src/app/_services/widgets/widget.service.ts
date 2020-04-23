import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '../endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Criteria, BarChartWidget } from 'src/app/_modules/report/_models/widget';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(
    private endpointService: EndpointService,
    private http: HttpClient,
  ) { }

  /**
   * Call this method for widget data
   * Provide widgetId , and filterCriteria
   */
  public getWidgetData(widgetId: string, filterCriteria: Criteria[]):Observable<any>{
      filterCriteria = filterCriteria ? filterCriteria : [];
      return this.http.post<any>(this.endpointService.widgetDataUrl(), filterCriteria, {params:{widgetId}});
  }

  public getListdata(pageSize,pageIndex,widgetId: string, filterCriteria: Criteria[]):Observable<any>{
    filterCriteria = filterCriteria ? filterCriteria : [];
    return this.http.post<any>(this.endpointService.widgetDataUrl(), filterCriteria, {params:{widgetId}});
  }

  public getStackChartMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getStackBarChartMetaData(widgetId));
  }

  public getFilterMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getFiltertMetaData(widgetId));
  }

  public getListTableMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getListTableMetaData(widgetId));
  }

  public getBarChartMetadata(widgetId):Observable<BarChartWidget>{
    return this.http.get<BarChartWidget>(this.endpointService.getBarChartMetaData(widgetId));
  }

  public getCountMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getCountMetadata(widgetId));
  }

  public getHeaderMetaData(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getHeaderMetaData(widgetId));
  }

}
