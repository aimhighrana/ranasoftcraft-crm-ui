import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { DoCorrectionRequest, MasterRecordChangeRequest, RequestForCatalogCheckData, RequestForGroupList } from '@models/schema/duplicacy';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';

import { CatalogCheckService } from './catalog-check.service';

describe('CatalogCheckService', () => {
  let catalogService: CatalogCheckService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointsClassicService>;
  const endpointSpy = jasmine.createSpyObj('EndpointsClassicService', ['duplicacyGroupsListUrl', 'catalogCheckRecordsUrl', 'markForDeletionUrl',
  'masterRecordChangeUrl','doDuplicacyCorrectionUrl','approveDuplicacyCorrectionUrl', 'rejectDuplicacyCorrectionUrl']);
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EndpointsClassicService, useValue: endpointSpy }
      ]
    });
    catalogService = TestBed.inject(CatalogCheckService);
    endpointServiceSpy = TestBed.inject(EndpointsClassicService) as jasmine.SpyObj<EndpointsClassicService>;
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
    request.page = 0;
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
    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('mark a record as master record ', async(() => {

    const request = new MasterRecordChangeRequest();
    request.id = 'Diw_15';
    request.schemaId = 'schema123';
    request.runId = 'run123';
    request.oldId = '';

    const url = 'catalog master record url';

    // mock url
    endpointServiceSpy.masterRecordChangeUrl.and.returnValue(url);
    // mock data
    const mockData = {
      message: 'success'
    }


    // actual service call
    catalogService.markAsMasterRecord(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('should mark a record for deletion ', async(() => {

    const url = 'catalog deletion record url';

    // mock url
    endpointServiceSpy.markForDeletionUrl.and.returnValue(url);
    // mock data
    const mockData = {
      message: 'success'
    }


    // actual service call
    catalogService.markForDeletion('Diw_15','module1','schema','run').subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('should do record correction ', async(() => {

    const url = 'do-correction url';

    // mock url
    endpointServiceSpy.doDuplicacyCorrectionUrl.and.returnValue(url);
    // mock data
    const mockData = {
      message: 'success'
    }

    const request: DoCorrectionRequest = { id: 'Diw_15', fldId: 'MATL_GRP', vc: 'newValue', oc: 'oldVal',
      groupIdold: 'fuzzy1', groupIdnew:'',isReviewed: 'false' } as DoCorrectionRequest;


    // actual service call
    catalogService.doCorrection('schema1','run1', request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('should approve record correction ', async(() => {

    const url = 'approve-correction url';

    // mock url
    endpointServiceSpy.approveDuplicacyCorrectionUrl.and.returnValue(url);
    // mock data
    const mockData = {
      message: 'success'
    }


    // actual service call
    catalogService.approveDuplicacyCorrection('schema1','run1', ['diw_15'], 'user').subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('should reject record correction ', async(() => {

    const url = 'reject-correction url';

    // mock url
    endpointServiceSpy.rejectDuplicacyCorrectionUrl.and.returnValue(url);
    // mock data
    const mockData = {
      message: 'success'
    }


    // actual service call
    catalogService.rejectDuplicacyCorrection('schema1','run1', ['diw_15'], 'user').subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
    });

    // mock http call
    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));


});
