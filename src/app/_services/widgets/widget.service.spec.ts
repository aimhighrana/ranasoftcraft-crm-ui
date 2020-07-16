import { TestBed, async } from '@angular/core/testing';

import { WidgetService } from './widget.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointService } from '../endpoint.service';

describe('WidgetService', () => {
  let service: WidgetService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const epsSpy = jasmine.createSpyObj('EndpointService', [ 'widgetDataUrl']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        WidgetService,
        { provide: EndpointService, useValue: epsSpy }
      ]
    }).compileComponents();
    service = TestBed.inject(WidgetService);
    endpointServiceSpy = TestBed.inject(EndpointService) as jasmine.SpyObj<EndpointService>;
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
    const req = httpTestingController.expectOne(`${testurl}?widgetId=${widgetId}&searchString=`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));
});
