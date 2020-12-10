import { async, inject, TestBed } from '@angular/core/testing';

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
    const serObj =new EndpointsAnalyticsService();
    const objType = '1005';
    expect(serObj.docCountUrl(objType)).toContain(`report/record-count/${objType}`, `report/record-count/${objType}  sould be return!`);
  }));

  it('it should call getReportListUrl() and return formatted URL', () => {
    const serviceobj =new EndpointsAnalyticsService();
    expect(serviceobj.getReportListUrl()).toContain(`report/list`);
  });

  it('deleteReport(),should delete report details', async(() => {
    const serObj =new EndpointsAnalyticsService();
    expect(serObj.deleteReport('823927')).toContain('report/delete/823927');
  }));

  it('getReportConfigUrl(),should return report config', async(() => {
    const serObj =new EndpointsAnalyticsService();
    expect(serObj.getReportConfigUrl('823927')).toContain('report/823927');
  }));

  it('createUpdateReportUrl(),should create or update report details', async(() => {
    const serObj =new EndpointsAnalyticsService();
    expect(serObj.createUpdateReportUrl()).toContain('report/create-update');
  }));

  it('getTimeseriesWidgetInfoUrl(),should return time series widget info', async(() => {
    const serObj =new EndpointsAnalyticsService();
    expect(serObj.getTimeseriesWidgetInfoUrl(75687687)).toContain('report/widget/timeseries/75687687');
  }));

  it('getListTableMetaData(),should return meta data table', async(() => {
    const serObj =new EndpointsAnalyticsService();
    expect(serObj.getListTableMetaData(75687687)).toContain('report/widget/report-list/metadata/75687687');
  }));

  it('reportDashboardUrl(),should return report dashboard details', async(() => {
    const serObj =new EndpointsAnalyticsService();
    expect(serObj.reportDashboardUrl(75687687)).toContain('report/report-info/75687687');
  }));
});
