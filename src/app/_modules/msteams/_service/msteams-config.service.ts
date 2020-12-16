import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EndpointsAnalyticsService } from '@services/_endpoints/endpoints-analytics.service';
import { EndpointsAuthService } from '@services/_endpoints/endpoints-auth.service';
@Injectable({
  providedIn: 'root'
})
export class MsteamsConfigService {

  constructor(
    private http: HttpClient,
    public analyticsEndpointService: EndpointsAnalyticsService,
    public authEndpointService: EndpointsAuthService
  )
  { }
  apiUrl = environment.apiurl;

  // Send user credentials to login api of MDO
  public signIn(userName: string, password: string){
    return this.http.post<any>(this.authEndpointService.signIn(), null, {params : {username:userName, password }});
  }


  // Get report url list from MDO to shown in dropdwon of MS Teams app configuration page
  public getReportUrlList(): Observable<any[]>{
    return this.http.get<any[]>(this.analyticsEndpointService.getReportListUrlForMsTeams());
  }

  /**
   * Validate jwt refresh token ..
   * @param refToken jwt refresh token ..
   */
  public validateToken(refToken: string): Observable<any>{
    const requestUri = this.authEndpointService.jwtRefresh();
    const authorizationData = 'Bearer '+ refToken;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: authorizationData
      }),
      observe: 'response' as const
    };
    return this.http.post<any>(requestUri, null, httpOptions);
  }
}
