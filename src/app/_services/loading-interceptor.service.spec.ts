import { TestBed, inject } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { EndpointService } from './endpoint.service';
import { HttpClientModule } from '@angular/common/http';
import { LoadingInterceptorService } from './loading-interceptor.service';

describe('LoadingInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [LoadingInterceptorService, EndpointService]
    });
  });

  it('should be created', inject([LoadingInterceptorService], (service: LoadingInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
