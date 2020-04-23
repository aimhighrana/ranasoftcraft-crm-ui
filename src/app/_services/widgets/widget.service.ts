import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '../endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Any2tsService } from '../any2ts.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(  private endpointService: EndpointService,
    private http: HttpClient,
    private any2tsService: Any2tsService) { }


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
