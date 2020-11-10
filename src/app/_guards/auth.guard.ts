import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MsteamsConfigService } from '@modules/msteams/_service/msteams-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

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

  /**
   * Check has already login then avoid /auth/login
   * And redirect to /home url
   *
   * @param route current router ..
   * @param segments segments for child routing ..
   */
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log(window.location.hash);
    const jwtToken = localStorage.getItem('JWT-TOKEN');
      const refreshToken = localStorage.getItem('JWT-REFRESH-TOKEN');
      const decodedJWTToken = this.jwtHelper.decodeToken(jwtToken);
      const decodedRefreshToken = this.jwtHelper.decodeToken(refreshToken);
      if (decodedJWTToken && decodedRefreshToken) {
        this.setResponseTokenToStorage(refreshToken).then(res=>{
          if(res.headers) {
            localStorage.setItem('JWT-TOKEN', res.headers.get('JWT-TOKEN'));
            localStorage.setItem('JWT-REFRESH-TOKEN', res.headers.get('JWT-REFRESH-TOKEN'));
            if(window.location && window.location.hash && window.location.hash.indexOf('returnUrl') !==-1) {
              try{
                const url = unescape(window.location.hash.split('returnUrl=')[1]);
                this.router.navigateByUrl(url);
              }catch(ex){console.error(ex); this.router.navigate(['/home/report/']);}
            } else {
              this.router.navigate(['/home/report/']);
            }
            return false;
          }
        }).catch(ex=>{
          return true;
        });
      }
      return true;
  }

  /**
   * Call validateToken as sync .. for token validation
   * @param refreshToken get refresh token from local storage ..
   */
  async setResponseTokenToStorage(refreshToken: string) {
    return await this.validateToken(refreshToken);
  }


  /**
   * Call service as promise for get sync token validation ..
   * @param token get for validation token ..
   */
  validateToken(token: string): Promise<any> {
    return this.msteamServices.validateToken(token).toPromise()
  }

}
