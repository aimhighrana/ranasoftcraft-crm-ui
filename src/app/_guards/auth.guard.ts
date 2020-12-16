import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsteamsConfigService } from '@modules/msteams/_service/msteams-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private msteamServices: MsteamsConfigService
  ) { }

  /**
   * Check whether .. has authorized user
   * If it has then .. return current url
   * Otherwise
   *
   * @param next next activated router params ..
   * @param state state of urls..
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const jwtToken = localStorage.getItem('JWT-TOKEN');
      const refreshToken = localStorage.getItem('JWT-REFRESH-TOKEN');
      const decodedJWTToken = this.jwtHelper.decodeToken(jwtToken);
      const decodedRefreshToken = this.jwtHelper.decodeToken(refreshToken);
      if (decodedJWTToken && decodedRefreshToken) {
        return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
