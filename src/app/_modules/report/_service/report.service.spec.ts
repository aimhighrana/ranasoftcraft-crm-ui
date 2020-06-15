import { TestBed, async } from '@angular/core/testing';

import { ReportService } from './report.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointService } from 'src/app/_services/endpoint.service';

describe('ReportService', () => {
  let service: ReportService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const epsSpy = jasmine.createSpyObj('EndpointService', [ 'reportDashboardUrl','docCountUrl','getPermissionUrl','returnCollaboratorsPermisisonUrl','saveUpdateReportCollaborator','deleteCollaboratorUrl']);
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

  it('getDocCount() : should be return count', async(() => {
    const testurl = 'count testing url';
    const objectType = '1005';
    // mocking url
    endpointServiceSpy.docCountUrl.withArgs(objectType).and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.getDocCount(objectType).subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));

  it('getCollaboratorPermission() : get all collaborators permisison', async(() => {
    const testurl = 'get collaborator permission url';
    const queryString = '';
    // mocking url
    endpointServiceSpy.getPermissionUrl.and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.getCollaboratorPermission(queryString).subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl+'?queryString=');
    expect(req.request.method).toEqual('GET');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));

  it('getCollaboratorsPermisison() : get all collaborators with permisison', async(() => {
    const testurl = 'get collaborator with permission url';
    const reportId = '724752745672';
    // mocking url
    endpointServiceSpy.returnCollaboratorsPermisisonUrl.withArgs(reportId).and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.getCollaboratorsPermisison(reportId).subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));

  it('saveUpdateReportCollaborator() : should call to save/update permission', async(() => {
    const testurl = 'save update url';
    // mocking url
    endpointServiceSpy.saveUpdateReportCollaborator.and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.saveUpdateReportCollaborator([]).subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('POST');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));

  it('deleteCollaborator() : should call to delete collaborator', async(() => {
    const testurl = 'delete collaborator url';
    // mocking url
    endpointServiceSpy.deleteCollaboratorUrl.and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    // actual call
    service.deleteCollaborator('7235745').subscribe(actualData => {
      expect(actualData).toEqual(mockhttpData);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));

});
