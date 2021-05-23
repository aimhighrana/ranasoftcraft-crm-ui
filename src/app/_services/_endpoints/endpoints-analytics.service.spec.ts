import { async, inject, TestBed } from '@angular/core/testing';
import { WidgetType } from '@modules/report/_models/widget';

import { EndpointsAnalyticsService } from './endpoints-analytics.service';

describe('EndpointsAnalyticsService', () => {

  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointsAnalyticsService', ['docCountUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: EndpointsAnalyticsService, useValue: endPointProvider }
      ]
    });
  });

  it('should be created', inject([EndpointsAnalyticsService], (service: EndpointsAnalyticsService) => {
    expect(service).toBeTruthy();
  }));

  it('docCountUrl(), should return the get doc count url', async(() => {
    const serObj = new EndpointsAnalyticsService();
    const objType = '1005';
    expect(serObj.docCountUrl(objType)).toContain(`report/record-count/${objType}`, `report/record-count/${objType}  sould be return!`);
  }));

  it('it should call getReportListUrl() and return formatted URL', () => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.getReportListUrl()).toContain(`report/list`);
  });

  it('deleteReport(),should delete report details', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.deleteReport('823927')).toContain('report/delete/823927');
  }));

  it('getReportConfigUrl(),should return report config', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.getReportConfigUrl('823927')).toContain('report/823927');
  }));

  it('createUpdateReportUrl(),should create or update report details', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.createUpdateReportUrl()).toContain('report/create-update');
  }));

  it('getTimeseriesWidgetInfoUrl(),should return time series widget info', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.getTimeseriesWidgetInfoUrl(75687687)).toContain('report/widget/timeseries/75687687');
  }));

  it('getListTableMetaData(),should return meta data table', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.getListTableMetaData(75687687)).toContain('report/widget/report-list/metadata/75687687');
  }));

  it('reportDashboardUrl(),should return report dashboard details', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.reportDashboardUrl(75687687)).toContain('report/report-info/75687687');
  }));

  it('downloadWidgetDataUrl(),should download the widgetData', async(() => {
    const serObj = new EndpointsAnalyticsService();
    expect(serObj.downloadWidgetDataUrl('75687687')).toContain('widget/download/75687687');
  }));

  it('widgetDataUrl(), should return the WidgetData', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.widgetDataUrl()).toContain(`widgetData`);
  }));

  it('getCustomDataUrl(), should return the object of custom data', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.getCustomDataUrl()).toContain(`report/custom-data`);
  }));

  it('getCustomDatasetFieldsUrl(), should return fields of custom data object', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.getCustomDatasetFieldsUrl('numberoflogin')).toContain(`report/custom-dataset/fields/numberoflogin`);
  }));

  it('getReportListUrlForMsTeams(), should return reportlist for ms team', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.getReportListUrlForMsTeams()).toContain(`report`);
  }));

  it('getlayoutData(), should return layout data', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    const widgetId = '65433567';
    const objectNumber = '1005';
    expect(serviceobj.getlayoutData(widgetId, objectNumber)).toContain(`report/layout-data/65433567/1005`);
  }));

  it('getAttachmentData(), should return attachement data', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.getAttachmentData()).toContain(`report/attachment-data`);
  }));

  it('defineColorPaletteForWidget(), should defin color palette for widget', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.defineColorPaletteForWidget()).toContain(`report/color-palette`);
  }));

  it('createUpdateReportDataTable(), should create update report data table', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    const widgetId = '65433567';
    expect(serviceobj.createUpdateReportDataTable(widgetId)).toContain(`report/table/view/create-update/65433567`);
  }));

  it('getFieldMetadatByFldUrl(), should return field meta data', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    const fieldId = 'NDC_TYPE'
    expect(serviceobj.getFieldMetadatByFldUrl(fieldId)).toContain(`report/fields-description/NDC_TYPE`);
  }));

  it('getCountMetadata(), should return count of meta data', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    expect(serviceobj.getCountMetadata(6547898676578)).toContain(`report/widget/count/metadata/6547898676578`);
  }));

  it('saveReportDownload(), should return count of meta data', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    const widgetId = '6547898676578';
    const userName = 'harshit'
    expect(serviceobj.saveReportDownload(widgetId, userName)).toContain(`/widget/startdoDownloadFile/${widgetId}?userName=${userName}`);
  }));

  it('copyReport(), should copy a report', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    const reportId = '6547898676578';
    expect(serviceobj.copyReport(reportId)).toContain(`/report/copy?reportId=${reportId}`);
  }));

  it('displayCriteria(), should get API string', async(() => {
    const serviceobj = new EndpointsAnalyticsService();
    const widgetId = '12345';
    const widgetType = WidgetType.BAR_CHART;
    expect(serviceobj.displayCriteria(widgetId, widgetType)).toContain(`/report/widget/display-criteria?widgetId=${widgetId}&widgetType=${widgetType}`);
  }));
});
