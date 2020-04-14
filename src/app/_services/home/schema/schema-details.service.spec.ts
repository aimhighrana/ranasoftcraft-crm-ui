import { TestBed, async } from '@angular/core/testing';

import { SchemaDetailsService } from './schema-details.service';
import { EndpointService } from '../../endpoint.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('SchemaDetailsService', () => {
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  let schemaDetaService: SchemaDetailsService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const endpointSpy = jasmine.createSpyObj('EndpointService', ['getAllSelectedFields']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchemaDetailsService,
        { provide: EndpointService, useValue: endpointSpy }
      ]
    }).compileComponents();
    schemaDetaService = TestBed.inject(SchemaDetailsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    endpointServiceSpy = TestBed.inject(EndpointService) as jasmine.SpyObj<EndpointService>;
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
    const mockData = ['FIELD1','FIELD2'];
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
