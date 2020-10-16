import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  jwtHelper = new JwtHelperService();

  constructor(
    private router: Router
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

  /**
   * Check has already login then avoid /auth/login
   * And redirect to /home url
   *
   * @param route current router ..
   * @param segments segments for child routing ..
   */
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const jwtToken = localStorage.getItem('JWT-TOKEN');
      const refreshToken = localStorage.getItem('JWT-REFRESH-TOKEN');
      const decodedJWTToken = this.jwtHelper.decodeToken(jwtToken);
      const decodedRefreshToken = this.jwtHelper.decodeToken(refreshToken);
      if (decodedJWTToken && decodedRefreshToken) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
  }

}
