import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MsteamsConfigService } from './msteams-config.service';
describe('MsteamsConfigService', () => {
  let service: MsteamsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
    });
    service = TestBed.inject(MsteamsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signIn(), should call signIn', async(() => {
    service.signIn('testUser', 'testPassword');
  }))

  it('getReportUrlList(), should call report list', async(() => {
    service.getReportUrlList();
  }))
});
