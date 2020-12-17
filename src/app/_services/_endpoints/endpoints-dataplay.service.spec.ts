import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EndpointsDataplayService } from './endpoints-dataplay.service';

describe('EndpointsDataplayService', () => {
  let service: EndpointsDataplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EndpointsDataplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
