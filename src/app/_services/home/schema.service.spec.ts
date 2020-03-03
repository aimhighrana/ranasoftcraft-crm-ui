import { TestBed, async } from '@angular/core/testing';

import { SchemaService } from './schema.service';
import { SchemaGroupResponse, SchemaGroupDetailsResponse, CreateSchemaGroupRequest, ObjectTypeResponse } from 'src/app/_models/schema/schema';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { EndpointService } from '../endpoint.service';
import { Any2tsService } from '../any2ts.service';
describe('SchemaService', () => {
  let schemaService: SchemaService;
  let httpTestingController: HttpTestingController;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  let any2tsSpy: jasmine.SpyObj<Any2tsService>;

  beforeEach(async(() => {
    const epsSpy = jasmine.createSpyObj('EndpointService', [ 'getSchemaGroupsUrl', 'getSchemaGroupDetailsByGrpIdUrl', 'getCreateSchemaGroupUrl', 'getAllObjecttypeUrl' ]);
    const any2Spy = jasmine.createSpyObj('Any2tsService', [ 'any2SchemaGroupResponse', 'any2SchemaDetails', 'any2ObjectType' ]);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        SchemaService,
        { provide: EndpointService, useValue: epsSpy },
        { provide: Any2tsService, useValue: any2Spy }
      ]
    }).compileComponents();
    schemaService = TestBed.inject(SchemaService);
    endpointServiceSpy = TestBed.get(EndpointService);
    any2tsSpy = TestBed.get(Any2tsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should be created', () => {
    const service: SchemaService = TestBed.inject(SchemaService);
    expect(service).toBeTruthy();
  });

  it('getAllSchemaGroup() : be able to retrive schemagroups from the API', async(() => {
    const testurl = 'dummy url to test';
    // mocking url
    endpointServiceSpy.getSchemaGroupsUrl.and.returnValue(testurl);
    // mock data
    const mockhttpData = {} as any;
    const mockTS: SchemaGroupResponse[] = [];
    mockTS.push(new SchemaGroupResponse());
    mockTS.push(new SchemaGroupResponse());
    // mock any2TS
    any2tsSpy.any2SchemaGroupResponse.withArgs(mockhttpData).and.returnValue(mockTS);
    // actual call
    schemaService.getAllSchemaGroup().subscribe(actualData => {
      expect(actualData).toEqual(mockTS);
    });
    // mocking http
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockhttpData);
    // verify http
    httpTestingController.verify();

  }));

  it('getSchemaGroupDetailsBySchemaGrpId(): be able to retrive Schema Group Details By Group Id from the API', async(() => {
    const url = 'test url for schema details by grp id';
    const groupId = '826462836823234';
    // mock url
    endpointServiceSpy.getSchemaGroupDetailsByGrpIdUrl.withArgs(groupId).and.returnValue(url);
    // making mock data
    const mockhttpData = {} as any;
    const mockTS: SchemaGroupDetailsResponse = new SchemaGroupDetailsResponse();
    // mock any2ts
    any2tsSpy.any2SchemaDetails.withArgs(mockhttpData).and.returnValue(mockTS);
    // actual service call
    schemaService.getSchemaGroupDetailsBySchemaGrpId(groupId).subscribe(actualData => {
      expect(actualData).toEqual(mockTS);
    });
    // mocking http
    const httpReq = httpTestingController.expectOne(url);
    expect(httpReq.request.method).toEqual('GET');
    httpReq.flush(mockhttpData);
    // verify http
    httpTestingController.verify();
  }));

  it('createSchemaGroup(): schema and update group ', async(() => {
    // mock data
    const createSchemaGroupRequest: CreateSchemaGroupRequest = new CreateSchemaGroupRequest();
    createSchemaGroupRequest.moduleIds = ['1005', '23345'];
    createSchemaGroupRequest.schemaIds = [827368263875, 72354725378];
    createSchemaGroupRequest.schemaGroupName = 'Test group create 1';
    createSchemaGroupRequest.groupId = '23764527357534';

    // mock url
    const createUrl = 'create-schema-group';
    endpointServiceSpy.getCreateSchemaGroupUrl.and.returnValue(createUrl);

    // call actual service method
    schemaService.createSchemaGroup(createSchemaGroupRequest).subscribe(data => {
      expect(createSchemaGroupRequest.groupId).toEqual(data.groupId);
    });

    // mock http
    const httpReq = httpTestingController.expectOne(createUrl);
    expect(httpReq.request.method).toEqual('POST');
    httpReq.flush(createSchemaGroupRequest);
    // verify http
    httpTestingController.verify();

  }));

  it('getAllObjectType() : will return list of object type ', async(() => {
    // mock data
    const objectTypeList: ObjectTypeResponse[] = [];
    objectTypeList.push(new ObjectTypeResponse());

    // mock url
    const getObejctTypeUrl = 'get-all-objecttype';
    const httpMockData = {} as any;
    endpointServiceSpy.getAllObjecttypeUrl.and.returnValue(getObejctTypeUrl);

    any2tsSpy.any2ObjectType.withArgs(httpMockData).and.returnValue(objectTypeList);

    // call actual service method
    schemaService.getAllObjectType().subscribe(data => {
      expect(data).toEqual(objectTypeList);
    });

    // mock http
    const httpReq = httpTestingController.expectOne(getObejctTypeUrl);
    expect(httpReq.request.method).toEqual('GET');
    httpReq.flush(httpMockData);
    // verify http
    httpTestingController.verify();
  }));
});
