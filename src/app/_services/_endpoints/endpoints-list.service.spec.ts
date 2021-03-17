import { TestBed } from '@angular/core/testing';

import { EndpointsListService } from './endpoints-list.service';

describe('EndpointsListService', () => {
  let service: EndpointsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
