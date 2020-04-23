import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '../endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Criteria } from 'src/app/_modules/report/_models/widget';

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

  public getBarChartData(): Observable<any> {
    // check subjectuserdetails userid !== jwt token userid, call service
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public getstackbarChartData(): Observable<any> {
    // check subjectuserdetails userid !== jwt token userid, call service
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public loadAlldropData():Observable<any>{
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public getListdata():Observable<any>{
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public getStackChartMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public getFilterMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public getListTableMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

  public getBarChartMetadata(widgetId):Observable<any>{
    return this.http.get<any>(this.endpointService.getDummyJSON());
  }

}
