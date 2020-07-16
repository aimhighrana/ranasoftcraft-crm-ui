import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EndpointService } from '../endpoint.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Criteria, BarChartWidget, WidgetHeader, TimeSeriesWidget, WidgetImageModel, WidgetHtmlEditor, ReportingWidget } from 'src/app/_modules/report/_models/widget';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  public count: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  constructor(
    private endpointService: EndpointService,
    private http: HttpClient,
  ) { }

  /**
   * Call this method for widget data
   * Provide widgetId , and filterCriteria
   */
  public getWidgetData(widgetId: string, filterCriteria: Criteria[],searchString?:string): Observable<any> {
    searchString = searchString===undefined?'':searchString;
    filterCriteria = filterCriteria ? filterCriteria : [];
    return this.http.post<any>(this.endpointService.widgetDataUrl(), filterCriteria, { params: { widgetId,searchString  } });
  }

  public getListdata(size,from,widgetId: string, filterCriteria: Criteria[], sortMapStr: any):Observable<any>{
    filterCriteria = filterCriteria ? filterCriteria : [];
    if(sortMapStr) {
      sortMapStr = JSON.stringify(sortMapStr);
      return this.http.post<any>(this.endpointService.widgetDataUrl(), filterCriteria, {params:{widgetId,size,from, sortMapStr}});
    } else {
      return this.http.post<any>(this.endpointService.widgetDataUrl(), filterCriteria, {params:{widgetId,size,from}});
    }

  }

  public getStackChartMetadata(widgetId): Observable<any> {
    return this.http.get<any>(this.endpointService.getStackBarChartMetaData(widgetId));
  }

  public getFilterMetadata(widgetId): Observable<any> {
    return this.http.get<any>(this.endpointService.getFiltertMetaData(widgetId));
  }

  public getListTableMetadata(widgetId): Observable<ReportingWidget[]> {
    return this.http.get<ReportingWidget[]>(this.endpointService.getListTableMetaData(widgetId));
  }

  public getBarChartMetadata(widgetId): Observable<BarChartWidget> {
    return this.http.get<BarChartWidget>(this.endpointService.getBarChartMetaData(widgetId));
  }

  public getCountMetadata(widgetId): Observable<any> {
    return this.http.get<any>(this.endpointService.getCountMetadata(widgetId));
  }

  public getHeaderMetaData(widgetId): Observable<WidgetHeader> {
    return this.http.get<WidgetHeader>(this.endpointService.getHeaderMetaData(widgetId));
  }

  public getTimeseriesWidgetInfo(widgetId: number): Observable<TimeSeriesWidget> {
    return this.http.get<TimeSeriesWidget>(this.endpointService.getTimeseriesWidgetInfoUrl(widgetId));
  }

  public getimageMetadata(widgetId): Observable<WidgetImageModel> {
    return this.http.get<WidgetImageModel>(this.endpointService.getimageMetadata(widgetId));
  }

  public getHTMLMetadata(widgetId): Observable<WidgetHtmlEditor> {
    return this.http.get<WidgetHtmlEditor>(this.endpointService.getHTMLMetadata(widgetId));
  }

  public updateCount(count) {
    this.count.next(count);
  }

  downloadImage(dataURI: string, imgName: string) {
    dataURI = dataURI.split('data:image/png;base64,')[1];
    const url = window.URL.createObjectURL(this.dataURItoBlob(dataURI));
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = imgName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  downloadCSV(excelFileName: string, data: any[]) {
    try {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      XLSX.writeFile(wb, excelFileName + '.csv')
    } catch (e) { }
  }

}
