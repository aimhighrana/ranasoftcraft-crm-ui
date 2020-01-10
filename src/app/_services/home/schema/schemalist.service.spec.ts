import { TestBed, async } from '@angular/core/testing';

import { SchemalistService } from './schemalist.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Any2tsService } from '../../any2ts.service';
import { EndpointService } from '../../endpoint.service';
import { SchemaListModuleList } from 'src/app/_models/schema/schemalist';

describe('SchemalistService', () => {
  let schemalistService: SchemalistService;
  let httpTestingController: HttpTestingController;
  let any2tsServiceSpy: jasmine.SpyObj<Any2tsService>;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  beforeEach(() => {
    const any2tsSpy = jasmine.createSpyObj('Any2tsService', ['anyToSchemaListsViewPage']);
    const endpointSpy = jasmine.createSpyObj('EndpointService', ['getSchemaListByGroupIdUrl']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchemalistService,
        { provide: Any2tsService, useValue: any2tsSpy },
        { provide: EndpointService, useValue: endpointSpy }
      ]
    }).compileComponents();
    schemalistService = TestBed.get(SchemalistService);
    httpTestingController = TestBed.get(HttpTestingController);
    any2tsServiceSpy = TestBed.get(Any2tsService);
    endpointServiceSpy = TestBed.get(EndpointService);
  });

  it('should be created', () => {
    expect(schemalistService).toBeTruthy();
  });

  it('getSchemaListByGroupId(): get schema list', async(() => {
    const url = 'get schema list url';
    const grpId = '837645763957';
    // mock url
    endpointServiceSpy.getSchemaListByGroupIdUrl.withArgs(grpId).and.returnValue(url);
    // mock data
    const mockData = {} as any;
    const expectedData: SchemaListModuleList[] = [];
    expectedData.push(new SchemaListModuleList());
    expectedData.push(new SchemaListModuleList());
    // mock any2Ts
    any2tsServiceSpy.anyToSchemaListsViewPage.withArgs(mockData).and.returnValue(expectedData);
    // actual service call
    schemalistService.getSchemaListByGroupId(grpId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(expectedData);
      expect(actualResponse.length).toEqual(expectedData.length);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

});

