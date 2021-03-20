import { TestBed, async } from '@angular/core/testing';

import { WidgetService } from './widget.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointsAnalyticsService } from '@services/_endpoints/endpoints-analytics.service';

describe('WidgetService', () => {
  let service: WidgetService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointsAnalyticsService>;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const epsSpy = jasmine.createSpyObj('EndpointsAnalyticsService', [ 'widgetDataUrl']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        WidgetService,
        { provide: EndpointsAnalyticsService, useValue: epsSpy }
      ]
    }).compileComponents();
    service = TestBed.inject(WidgetService);
    endpointServiceSpy = TestBed.inject(EndpointsAnalyticsService) as jasmine.SpyObj<EndpointsAnalyticsService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWidgetData() : be able to retrive widget data', async(() => {
    const testurl = 'dummy url to test';
    const widgetId = '6254672';
    // mocking url
    endpointServiceSpy.widgetDataUrl.and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.getWidgetData(widgetId,null).subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(`${testurl}?widgetId=${widgetId}&searchString=&searchAfter=`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));
});
