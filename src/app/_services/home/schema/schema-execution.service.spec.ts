import { TestBed } from '@angular/core/testing';

import { SchemaExecutionService } from './schema-execution.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';



describe('SchemaExecutionService', () => {

  let service: SchemaExecutionService;
  let httpTesintController: HttpTestingController;
  let endpointService: EndpointsClassicService;


  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(SchemaExecutionService);
    httpTesintController = TestBed.inject(HttpTestingController);
    endpointService = TestBed.inject(EndpointsClassicService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should scheduleSChema', () => {

    const url = 'getScheduleSchemaUrl';
    spyOn(endpointService, 'getScheduleSchemaUrl').and.returnValue(url);

    const request = {schemaId: 'schema1', variantId: '0'} as SchemaExecutionRequest;
    const expectedResponse = 'success';

    service.scheduleSChema(request, true).subscribe(actualResponse => {
      expect(actualResponse).toEqual(expectedResponse);
    });

    const mockRequest = httpTesintController.expectOne(`${url}`);
    expect(mockRequest.request.method).toEqual('POST');
    mockRequest.flush(expectedResponse);
    httpTesintController.verify();

  })


});
