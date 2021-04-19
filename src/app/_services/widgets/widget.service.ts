import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Criteria, BarChartWidget, WidgetHeader, TimeSeriesWidget, WidgetImageModel, WidgetHtmlEditor, ReportingWidget, LayoutTabResponse, MDORECORDESV3,WidgetColorPalette, DuplicateReport, DisplayCriteria, WidgetType } from 'src/app/_modules/report/_models/widget';
import { TreeModel } from '@modules/report/view/dashboard-container/filter/hierarchy-filter/hierarchy-filter.component';
import { EndpointsAnalyticsService } from '@services/_endpoints/endpoints-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  public count: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  constructor(
    private http: HttpClient,
    private endpointAnalyticService: EndpointsAnalyticsService
  ) { }

  /**
   * Call this method for widget data
   * Provide widgetId , and filterCriteria
   */
  public getWidgetData(widgetId: string, filterCriteria: Criteria[],searchString?:string, searchAfter?:string): Observable<any> {
    searchString = searchString===undefined?'':searchString;
    filterCriteria = filterCriteria ? filterCriteria : [];
    searchAfter = searchAfter ? searchAfter : '';
    return this.http.post<any>(this.endpointAnalyticService.widgetDataUrl(), filterCriteria, { params: { widgetId,searchString,searchAfter}});
  }

  public getListdata(size,from,widgetId: string, filterCriteria: Criteria[], sortMapStr: any):Observable<any>{
    filterCriteria = filterCriteria ? filterCriteria : [];
    if(sortMapStr) {
      sortMapStr = JSON.stringify(sortMapStr);
      return this.http.post<any>(this.endpointAnalyticService.widgetDataUrl(), filterCriteria, {params:{widgetId,size,from, sortMapStr}});
    } else {
      return this.http.post<any>(this.endpointAnalyticService.widgetDataUrl(), filterCriteria, {params:{widgetId,size,from}});
    }

  }

  public getStackChartMetadata(widgetId): Observable<any> {
    return this.http.get<any>(this.endpointAnalyticService.getStackBarChartMetaData(widgetId));
  }

  public getFilterMetadata(widgetId): Observable<any> {
    return this.http.get<any>(this.endpointAnalyticService.getFiltertMetaData(widgetId));
  }

  public getListTableMetadata(widgetId): Observable<ReportingWidget[]> {
    return this.http.get<ReportingWidget[]>(this.endpointAnalyticService.getListTableMetaData(widgetId));
  }

  public getBarChartMetadata(widgetId): Observable<BarChartWidget> {
    return this.http.get<BarChartWidget>(this.endpointAnalyticService.getBarChartMetaData(widgetId));
  }

  public getCountMetadata(widgetId): Observable<any> {
    return this.http.get<any>(this.endpointAnalyticService.getCountMetadata(widgetId));
  }

  public getHeaderMetaData(widgetId): Observable<WidgetHeader> {
    return this.http.get<WidgetHeader>(this.endpointAnalyticService.getHeaderMetaData(widgetId));
  }

  public getTimeseriesWidgetInfo(widgetId: number): Observable<TimeSeriesWidget> {
    return this.http.get<TimeSeriesWidget>(this.endpointAnalyticService.getTimeseriesWidgetInfoUrl(widgetId));
  }

  public getimageMetadata(widgetId): Observable<WidgetImageModel> {
    return this.http.get<WidgetImageModel>(this.endpointAnalyticService.getimageMetadata(widgetId));
  }

  public getHTMLMetadata(widgetId): Observable<WidgetHtmlEditor> {
    return this.http.get<WidgetHtmlEditor>(this.endpointAnalyticService.getHTMLMetadata(widgetId));
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

  getLayoutMetadata(widgetId:string,objectNumber:string, layoutId: string, roleId: string):Observable<LayoutTabResponse[]>{
    return this.http.get<any>(this.endpointAnalyticService.getLayoutMetadata(widgetId,objectNumber, layoutId), {params:{roleId}});
  }

  getlayoutData(widgetId:string,objectNumber:string):Observable<MDORECORDESV3>{
    return this.http.get<any>(this.endpointAnalyticService.getlayoutData(widgetId,objectNumber));
  }

  getAttachmentData(snos : object):Observable<any>{
    return this.http.post<any>(this.endpointAnalyticService.getAttachmentData(),snos);
  }
  /**
   * Call http for save or define widget color palette
   * @param req define color palette request for widget
   */
   defineWidgetColorPalette(req: WidgetColorPalette): Observable<WidgetColorPalette> {
    return this.http.post<WidgetColorPalette>(this.endpointAnalyticService.defineColorPaletteForWidget(), req);
  }

  /**
   * Call http to get location hireeachy
   */
  getLocationHirerachy(topLocation: string, fieldId: string, searchString: string, searchFunc: string, plantCode: string): Observable<TreeModel[]>{
    return this.http.get<TreeModel[]>(this.endpointAnalyticService.getLocationHierarchyUrl(topLocation, fieldId, searchString, searchFunc), {params:{plantCode}})
  }

  /**
   * Call http to copy / duplicate a report
   */
  public copyReport(reportId: string, reportName:string) : Observable<DuplicateReport> {
    return this.http.post<DuplicateReport>(this.endpointAnalyticService.copyReport(reportId, reportName), {});
  }

  public getDisplayCriteria(widgetId: string, widgetType: WidgetType) : Observable<any> {
    return this.http.get<any>(this.endpointAnalyticService.displayCriteria(widgetId, widgetType));
  }

  public saveDisplayCriteria(widgetId: string, widgetType: WidgetType, displayCriteria: DisplayCriteria, body = null) : Observable<any> {
    const url = displayCriteria ? `&displayCriteria=${displayCriteria}` : '';
    return this.http.post<any>(this.endpointAnalyticService.displayCriteria(widgetId, widgetType) + url, body);
  }
}
