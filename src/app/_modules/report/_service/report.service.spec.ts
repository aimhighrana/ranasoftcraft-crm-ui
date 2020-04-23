import { TestBed, async } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointService } from 'src/app/_services/endpoint.service';

describe('ReportService', () => {
  let service: ReportService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const epsSpy = jasmine.createSpyObj('EndpointService', [ 'reportDashboardUrl']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ReportService,
        { provide: EndpointService, useValue: epsSpy }
      ]
    }).compileComponents();
    service = TestBed.inject(ReportService);
    endpointServiceSpy = TestBed.inject(EndpointService) as jasmine.SpyObj<EndpointService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getReportInfo() : be able to retrive report information', async(() => {
    const testurl = 'dummy url to test';
    // mocking url
    endpointServiceSpy.reportDashboardUrl.withArgs(265623).and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.getReportInfo(265623).subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));
});
