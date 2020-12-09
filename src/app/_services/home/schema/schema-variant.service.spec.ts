import { TestBed, async } from '@angular/core/testing';

import { SchemaVariantService } from './schema-variant.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Any2tsService } from '../../any2ts.service';
import { SchemaVariantResponse, SendSchemavariantRequest } from 'src/app/_models/schema/schemalist';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';

describe('SchemaVariantService', () => {
  let httpTestingController: HttpTestingController;
  let schemaVariantService: SchemaVariantService;
  let any2tsServiceSpy: jasmine.SpyObj<Any2tsService>;
  let endpointServiceSpy: jasmine.SpyObj<EndpointsClassicService>;
  beforeEach(async(() => {
    const any2TsSpy = jasmine.createSpyObj('Any2tsService', ['any2SchemaVariantResponse']);
    const endpointSpy = jasmine.createSpyObj('EndpointsClassicService', ['schemaVarinatDetails', 'getVariantdetailsByvariantIdUrl', 'deleteVariantUrl', 'saveUpdateVariantUrl']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SchemaVariantService,
        { provide: Any2tsService, useValue: any2TsSpy },
        { provide: EndpointsClassicService, useValue: endpointSpy },
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    schemaVariantService = TestBed.inject(SchemaVariantService);
    any2tsServiceSpy = TestBed.inject(Any2tsService) as jasmine.SpyObj<Any2tsService>;
    endpointServiceSpy = TestBed.inject(EndpointsClassicService) as jasmine.SpyObj<EndpointsClassicService>;
  }));

  it('should be created', () => {
    const service: SchemaVariantService = TestBed.inject(SchemaVariantService);
    expect(service).toBeTruthy();
  });

  it('schemavariantDetailsBySchemaId() : should call' , () => {
    const url = 'get all variant of schema';
    // mock url
    endpointServiceSpy.schemaVarinatDetails.and.returnValue(url);

    // mock data
    const mockData = {} as any;
    const schemaVariants: SchemaVariantResponse[] = [];
    any2tsServiceSpy.any2SchemaVariantResponse.withArgs(mockData).and.returnValue(schemaVariants);
    // actual call
    const sendData: SendSchemavariantRequest = new SendSchemavariantRequest();
    schemaVariantService.schemavariantDetailsBySchemaId(sendData).subscribe(actualData => {
      expect(actualData).toEqual(schemaVariants);
    });

    // mock http
    const mockRequest = httpTestingController.expectOne(url);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  });

  it('getVariantdetailsByvariantId(): should call', () =>{
    const url = 'get all variant details of variant';
    // mock url
    endpointServiceSpy.getVariantdetailsByvariantIdUrl.and.returnValue(url);

    // mock data
    const mockData = {} as any;
    // actual call
    const variantId = '7676567575';
    schemaVariantService.getVariantdetailsByvariantId(variantId).subscribe(actualData => {
      expect(actualData).toEqual(mockData);
    });
    // mock http
    const mockRequest = httpTestingController.expectOne(url);
    expect(mockRequest.request.method).toEqual('GET');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  });

  it('deleteVariant(): should call', () =>{
    const url = 'delete variant details';
    // mock url
    endpointServiceSpy.deleteVariantUrl.and.returnValue(url);

    // mock data
    const mockData = true;
    // actual call
    const variantId = '7676567575';
    schemaVariantService.deleteVariant(variantId).subscribe(actualData => {
      expect(actualData).toEqual(mockData);
    });
    // mock http
    const mockRequest = httpTestingController.expectOne(url);
    expect(mockRequest.request.method).toEqual('DELETE');
    expect(mockRequest.request.responseType).toEqual('json');
    // verify http
    httpTestingController.verify();
  });

  it('saveUpdateSchemaVariant(): should call', () =>{
    const url = 'create and update single details';
    // mock url
    endpointServiceSpy.saveUpdateVariantUrl.and.returnValue(url);

    // mock data
    const mockData = {} as any;
    // actual call
    const request = {} as any;
    schemaVariantService.saveUpdateSchemaVariant(request).subscribe(actualData => {
      expect(actualData).toEqual(mockData);
    });
    // mock http
    const mockRequest = httpTestingController.expectOne(url);
    expect(mockRequest.request.method).toEqual('POST');
    expect(mockRequest.request.responseType).toEqual('json');
    mockRequest.flush(mockData);
    // verify http
    httpTestingController.verify();
  });
});
