import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ObjectType } from '@models/core/coreModel';
import { EndpointsCoreService } from '@services/_endpoints/endpoints-core.service';

import { CoreService } from './core.service';

describe('CoreService', () => {
  let service: CoreService;
  let endpointsServiceSpy: jasmine.SpyObj<EndpointsCoreService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const endpointSpy = jasmine.createSpyObj('EndpointsCoreService', ['getAllObjectTypeUrl']);
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

  })
});
