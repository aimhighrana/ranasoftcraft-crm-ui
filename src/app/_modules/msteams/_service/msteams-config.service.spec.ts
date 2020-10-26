import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MsteamsConfigService } from './msteams-config.service';
import { environment } from 'src/environments/environment';

describe('MsteamsConfigService', () => {
  let service: MsteamsConfigService;
  let apiUrl: string;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MsteamsConfigService);
    apiUrl = environment.apiurl;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signIn(), should call signIn', async(() => {
    service.signIn('testUser', 'testPassword').subscribe((response) => {
      expect(response).not.toBe(null)
    });
    const testurl = `${apiUrl}/login_4m_session`;
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  }))

  it('getReportUrlList(), should call report list', async(() => {
    expect(service.getReportUrlList()).toBeTruthy();
    service.getReportUrlList().subscribe((response) => {
      expect(response).not.toBe(null);
    });

    const testurl = service.endpointService.getReportListUrlForMsTeams()

    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('GET');
    httpTestingController.verify();
  }))

  it('validateToken(), should call valid toke api', async(() => {
    service.validateToken('').subscribe((response) => {
      expect(response).not.toBe(null)
    });
    const testurl = `${apiUrl}/jwt/validate-refresh-token`;
    const req = httpTestingController.expectOne(testurl);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  }))
});

// const testurl = service.endpointService.getSaveTaskListURL()
//     const req = httpTestingController.expectOne(testurl);
//     expect(req.request.method).toEqual('POST');
//     httpTestingController.verify();