import { TestBed, inject } from '@angular/core/testing';

import { JwtInterceptorService } from './jwt-interceptor.service';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointService } from '../_services/endpoint.service';
import { HttpClientModule } from '@angular/common/http';
import { AccessDeniedDialogComponent } from '@modules/shared/_components/access-denied-dialog/access-denied-dialog.component';
import { MatDialog } from '@angular/material/dialog';

describe('JwtInterceptorService', () => {
  const mockMatDialog = {
    close: jasmine.createSpy('close')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [JwtInterceptorService, EndpointService, AccessDeniedDialogComponent,
        {
          provide: MatDialog,
          useValue: mockMatDialog
        }]
    });
  });

  it('should be created', inject([JwtInterceptorService], (service: JwtInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
