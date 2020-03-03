import { TestBed, async } from '@angular/core/testing';

import { SchemaVariantService } from './schema-variant.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Any2tsService } from '../../any2ts.service';
import { EndpointService } from '../../endpoint.service';
import { SchemaVariantResponse, SendSchemavariantRequest } from 'src/app/_models/schema/schemalist';

describe('SchemaVariantService', () => {
  let httpTestingController: HttpTestingController;
  let schemaVariantService: SchemaVariantService;
  let any2tsServiceSpy: jasmine.SpyObj<Any2tsService>;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  beforeEach(async(() => {
    const any2TsSpy = jasmine.createSpyObj('Any2tsService', ['any2SchemaVariantResponse']);
    const endpointSpy = jasmine.createSpyObj('EndpointService', ['schemaVarinatDetails']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SchemaVariantService,
        { provide: Any2tsService, useValue: any2TsSpy },
        { provide: EndpointService, useValue: endpointSpy },
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    schemaVariantService = TestBed.inject(SchemaVariantService);
    any2tsServiceSpy = TestBed.get(Any2tsService);
    endpointServiceSpy = TestBed.get(EndpointService);
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
});
