import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsAnalyticsService {

  constructor() { }

  apiUrl = environment.apiurl + '/analytics';

  public reportDashboardUrl(reportId: number) {
    return `${this.apiUrl}/report/report-info/${reportId}`;
  }

  public getFieldMetadatByFldUrl(fieldId: string): string {
    return `${this.apiUrl}/report/fields-description/${fieldId}`;
  }

  public getStackBarChartMetaData(widgetId): string {
    return `${this.apiUrl}/report/widget/stack-barChart/metadata/${widgetId}`;
  }

  public getFiltertMetaData(widgetId): string {
    return `${this.apiUrl}/report/widget/filter/metadata/${widgetId}`;
  }

  public getListTableMetaData(widgetId): string {
    return `${this.apiUrl}/report/widget/report-list/metadata/${widgetId}`;
  }

  public getBarChartMetaData(widgetId): string {
    return `${this.apiUrl}/report/widget/bar-chart/metadata/${widgetId}`;
  }

  public getCountMetadata(widgetId): string {
    return `${this.apiUrl}/report/widget/count/metadata/${widgetId}`;
  }

  public getHeaderMetaData(widgetId): string {
    return `${this.apiUrl}/report/widget/header/metadata/${widgetId}`;
  }

  public getTimeseriesWidgetInfoUrl(widgetId: number): string {
    return `${this.apiUrl}/report/widget/timeseries/${widgetId}`;
  }

  public createUpdateReportUrl(): string {
    return `${this.apiUrl}/report/create-update`;
  }

  public getReportListUrl(): string {
    return `${this.apiUrl}/report/list`;
  }
  public getimageMetadata(widgetId): string {
    return `${this.apiUrl}/report/widget/image/metadata/${widgetId}`;
  }

  public getHTMLMetadata(widgetId): string {
    return `${this.apiUrl}/report/widget/html-editor/metadata/${widgetId}`;
  }

  public getReportConfigUrl(reportId: string): string {
    return `${this.apiUrl}/report/${reportId}`;
  }

  public deleteReport(reportId: string): string {
    return `${this.apiUrl}/report/delete/${reportId}`;
  }

  public docCountUrl(objectType: string): string {
    return `${this.apiUrl}/report/record-count/${objectType}`;
  }

  public getReportListUrlForMsTeams(): string {
    return `${this.apiUrl}/report`;
  }

  public getLayoutMetadata(widgetId, objectNumber, layoutId): string {
    return `${this.apiUrl}/report/layout-metadata/${widgetId}/${objectNumber}/${layoutId}`;
  }

  public getlayoutData(widgetId, objectNumber): string {
    return `${this.apiUrl}/report/layout-data/${widgetId}/${objectNumber}`;
  }

  public getAttachmentData(): string {
    return `${this.apiUrl}/report/attachment-data`;
  }

  public defineColorPaletteForWidget(): string {
    return `${this.apiUrl}/report/color-palette`;
  }

  /**
   * endpoint to update data table column setting
   */
  public createUpdateReportDataTable(widgetId: string): string {
    return this.apiUrl + `/report/table/view/create-update/${widgetId}`;
  }

  /**
   * endpoint to get location hierarchy
   */
  public getLocationHierarchyUrl(topLocation: string, fieldId: string, searchString: string, searchFunc: string): string {
    return this.apiUrl + `/report/loc/searchLocationNode?topLocation=${topLocation}&fieldId=${fieldId}&searchString=${searchString}&searchFunc=${searchFunc}`
  }

  public downloadWidgetDataUrl(widgetId: string): string {
    return `${this.apiUrl}/widget/download/${widgetId}`;
  }

  public widgetDataUrl(): string {
    return `${this.apiUrl}/widgetData`;
  }

  public getCustomDataUrl(): string {
    return `${this.apiUrl}/report/custom-data`;
  }

  public getCustomDatasetFieldsUrl(objectId: string): string {
    return `${this.apiUrl}/report/custom-dataset/fields/${objectId}`
  }

  public saveReportDownload(widgetId: string,userName:string) : string {
    return `${this.apiUrl}/widget/startdoDownloadFile/${widgetId}?userName=${userName}`;
  }

  /**
   * endpoint to copy endpoint
   */
  public copyReport(reportId: string, reportName:string) : string {
    return `${this.apiUrl}/report/copy?reportId=${reportId}&reportName=${reportName}`;
  }
}
