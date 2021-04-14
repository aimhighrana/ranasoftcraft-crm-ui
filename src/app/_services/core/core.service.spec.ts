import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FieldMetaData, ObjectType } from '@models/core/coreModel';
import { EndpointsCoreService } from '@services/_endpoints/endpoints-core.service';

import { CoreService } from './core.service';

describe('CoreService', () => {
  let service: CoreService;
  let endpointsServiceSpy: jasmine.SpyObj<EndpointsCoreService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const endpointSpy = jasmine.createSpyObj('EndpointsCoreService', ['getAllObjectTypeUrl', 'getAllFieldsForViewUrl', 'getObjectTypeDetailsUrl',
      'searchFieldsMetadataUrl', 'getMetadataByFieldsUrl']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: EndpointsCoreService, useValue: endpointSpy}
      ]
    });
    service = TestBed.inject(CoreService);
    endpointsServiceSpy = TestBed.inject(EndpointsCoreService) as jasmine.SpyObj<EndpointsCoreService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAllObjectType', () => {

    const url = 'getAllObjectTypeUrl';
    const response: ObjectType[] = [
      {objectid: '1005', objectdesc: 'Material'}
    ];

    endpointsServiceSpy.getAllObjectTypeUrl.and.returnValue(url);

    service.getAllObjectType().subscribe(modules => {
      expect(modules).toEqual(response);
    });

    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('GET');
    mockRequest.flush(response);
    httpTestingController.verify();

  });

  it('should getAllFieldsForView', () => {

    const url = 'getAllFieldsForViewUrl';
    const response = [
      {fieldId: 'MTL_TYPE', fieldDescri: 'Material type'}
    ] as FieldMetaData[];

    endpointsServiceSpy.getAllFieldsForViewUrl.and.returnValue(url);

    service.getAllFieldsForView('1005').subscribe(modules => {
      expect(modules).toEqual(response);
    });

    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('GET');
    mockRequest.flush(response);
    httpTestingController.verify();

  });

  it('should getObjectTypeDetails', () => {

    const url = 'getObjectTypeDetailsUrl';
    const response = {
      objectid: '1005',
      objectdesc: 'Material'
    } as ObjectType;

    endpointsServiceSpy.getObjectTypeDetailsUrl.and.returnValue(url);

    service.getObjectTypeDetails('1005').subscribe(modules => {
      expect(modules).toEqual(response);
    });

    const mockRequest = httpTestingController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('GET');
    mockRequest.flush(response);
    httpTestingController.verify();

  });

  it('should searchFieldsMetadata', () => {

    const url = 'searchFieldsMetadataUrl';
    const response = [
      {fieldId: 'MTL_TYPE', fieldDescri: 'Material type'}
    ] as FieldMetaData[];

    endpointsServiceSpy.searchFieldsMetadataUrl.and.returnValue(url);

    service.searchFieldsMetadata('1005', 0,'material',20,'').subscribe(fields => {
      expect(fields).toEqual(response);
    });

    const mockRequest = httpTestingController.expectOne(`${url}?lang=&moduleId=1005&offset=0&searchString=material&size=20`);
    expect(mockRequest.request.method).toEqual('GET');
    mockRequest.flush(response);
    httpTestingController.verify();

  });

  it('should getMetadataByFields', () => {

    const url = 'getMetadataByFieldsUrl';
    const response = [
      {fieldId: 'MTL_TYPE', fieldDescri: 'Material type'}
    ] as FieldMetaData[];

    endpointsServiceSpy.getMetadataByFieldsUrl.and.returnValue(url);

    service.getMetadataByFields(['MTL_TYPE'],'').subscribe(fields => {
      expect(fields).toEqual(response);
    });

    const mockRequest = httpTestingController.expectOne(`${url}?lang=`);
    expect(mockRequest.request.method).toEqual('POST');
    mockRequest.flush(response);
    httpTestingController.verify();

  });

});
