import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { RequestForCatalogCheckData, RequestForGroupList } from '@models/schema/duplicacy';
import { EndpointService } from '@services/endpoint.service';

import { CatalogCheckService } from './catalog-check.service';

describe('CatalogCheckService', () => {
  let catalogService: CatalogCheckService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  const endpointSpy = jasmine.createSpyObj('EndpointService', ['duplicacyGroupsListUrl', 'catalogCheckRecordsUrl']);
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EndpointService, useValue: endpointSpy }
      ]
    });
    catalogService = TestBed.inject(CatalogCheckService);
    endpointServiceSpy = TestBed.inject(EndpointService) as jasmine.SpyObj<EndpointService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(catalogService).toBeTruthy();
  });

  it('get All group Ids ', async(() => {

    const request = new RequestForGroupList();
    request.schemaId = 'schema1';
    request.plantCode = '0';
    request.runId = '123';

    const url = 'get group ids url';

    // mock url
    endpointServiceSpy.duplicacyGroupsListUrl.and.returnValue(url);
    // mock data
    const mockData = {
      exactGroupId: ['exact1'],
      fuzzyGroupId: ['fuzzy1']
    }

    // const mockResult
    const mockResult = [
      { groupId : 'exact1', groupKey: 'exactGroupId'},
      { groupId : 'fuzzy1', groupKey: 'fuzzyGroupId'}
    ];

    // actual service call
    catalogService.getAllGroupIds(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockResult);
      expect(actualResponse.length).toEqual(2);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}?schemaId=${request.schemaId}&plantCode=${request.plantCode}&runId=${request.runId}`);
    expect(mockRequest.request.method).toEqual('GET');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('get All data Records ', async(() => {

    const request = new RequestForCatalogCheckData();
    request.schemaId = 'schema1';
    request.groupId = 'group1';
    request.from = 1;
    request.size = 20;
    request.key = 'exactGroupId';
    request.runId = '123';

    const url = 'catalog check records url';

    // mock url
    endpointServiceSpy.catalogCheckRecordsUrl.and.returnValue(url);
    // mock data
    const mockData = {
      doc : [{}],
      totalCount: 0
    }


    // actual service call
    catalogService.getCatalogCheckRecords(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
      // expect(actualResponse.length).toEqual(2);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}?schemaId=${request.schemaId}&groupId=${request.groupId}&from=${request.from}&size=${request.size}&key=${request.key}&runId=${request.runId}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));


});
