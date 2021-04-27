import { async, inject, TestBed } from '@angular/core/testing';

import { EndpointsAuthService } from './endpoints-auth.service';

describe('EndpointsAuthService', () => {

  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointsAuthService', ['getUserDetailsUrl']);
    TestBed.configureTestingModule({
      providers: [
        { provide: EndpointsAuthService, useValue: endPointProvider }
      ]
    });
  });

  it('should be created', inject([EndpointsAuthService], (service: EndpointsAuthService) => {
    expect(service).toBeTruthy();
  }));

  it('getUserDetailsUrl(),should return user detail', async(() => {
    const serObj = new EndpointsAuthService();
    expect(serObj.getUserDetailsUrl('harshit')).toContain('user/detail/harshit');
  }));

  it('signIn(),should retun signin authentication', async(() => {
    const serObj = new EndpointsAuthService();
    expect(serObj.signIn()).toContain('signin');
  }));

  it('validateRefreshjwttokenUrl(), should validate Token', async(() => {
    const serObj = new EndpointsAuthService();
    expect(serObj.validateRefreshjwttokenUrl()).toContain('refresh');
  }));

  it('jwtRefresh(), should call jwtrefresh function', async(() => {
    const serObj = new EndpointsAuthService();
    expect(serObj.jwtRefresh()).toContain('refresh');
  }));

  it('should updatePassword', () => {
    const serObj = new EndpointsAuthService();
    expect(serObj.updatePassword()).toContain('/user/update-password');
  });
});
