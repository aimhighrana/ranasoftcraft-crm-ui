import { TestBed, async } from '@angular/core/testing';

import { SchemaDetailsService } from './schema-details.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
describe('SchemaDetailsService', () => {
  let endpointServiceSpy: jasmine.SpyObj<EndpointsClassicService>;
  let schemaDetaService: SchemaDetailsService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const endpointSpy = jasmine.createSpyObj('EndpointsClassicService', ['getAllSelectedFields']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchemaDetailsService,
        { provide: EndpointsClassicService, useValue: endpointSpy }
      ]
    }).compileComponents();
    schemaDetaService = TestBed.inject(SchemaDetailsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    endpointServiceSpy = TestBed.inject(EndpointsClassicService) as jasmine.SpyObj<EndpointsClassicService>;
  });

  it('should be created', () => {
    const service: SchemaDetailsService = TestBed.inject(SchemaDetailsService);
    expect(service).toBeTruthy();
  });

  it('getAllSelectedFields(): get selected fields ', async(() => {
    const schemaId = '837645763957';
    const variantId = '0';
    const url = `get selected field url`;
    // mock url
    endpointServiceSpy.getAllSelectedFields.and.returnValue(url);
    // mock data
    const mockData = [
      {fieldId: 'FIELD1', order:0, editable: false},
      {fieldId: 'FIELD2', order:1, editable: false}
    ];
    // actual service call
    schemaDetaService.getAllSelectedFields(schemaId, variantId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
      expect(actualResponse.length).toEqual(mockData.length);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&variantId=${variantId}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));
});
