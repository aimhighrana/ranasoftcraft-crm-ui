import { TestBed, inject } from '@angular/core/testing';

import { JwtInterceptorService } from './jwt-interceptor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointService } from '../_services/endpoint.service';
import { HttpClientModule } from '@angular/common/http';

describe('JwtInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [JwtInterceptorService, EndpointService]
    });
  });

  it('should be created', inject([JwtInterceptorService], (service: JwtInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
