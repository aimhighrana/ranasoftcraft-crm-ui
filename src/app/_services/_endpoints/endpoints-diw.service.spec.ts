import { TestBed } from '@angular/core/testing';

import { EndpointsDiwService } from './endpoints-diw.service';

describe('EndpointsDiwService', () => {
  let service: EndpointsDiwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointsDiwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
