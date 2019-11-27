import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//import { AuthenticationService } from '../_services/authentication.service';

describe('AuthGuard', () => {
  //const authenticationService = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['currentUser']);
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: Router, useValue: router},
        //{provide: AuthenticationService, useValue: authenticationService}
      ]
    });
  });

  it('should instantiate guard', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should be false for not authenticated', inject([AuthGuard], (guard: AuthGuard) => {
    // TODO Check call params also
    // let routerSS: RouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
    expect(guard.canActivate(<any>{}, <any>{})).toBeFalsy();
    expect(router.navigate).toHaveBeenCalled();
  }));

  // it('should be true for authenticated', inject([AuthGuard], (guard: AuthGuard) => {
    // TODO Check call params also
    // let routerSS: RouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
    // spyOn(guard.authenticationService, 'checkIfLoggedIn').and.returnValue(true);
    // expect(guard.canActivate(<any>{}, <any>{})).toBeTruthy();
    // expect(router.navigate).toHaveBeenCalledTimes(0);
  // }));
});
