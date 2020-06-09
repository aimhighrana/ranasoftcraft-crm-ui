import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EndpointService } from 'src/app/_services/endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsteamsConfigService {

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService
  )
  { }
  apiUrl = environment.apiurl;

  // Send user credentials to login api of MDO
  public signIn(userName: string, password: string){
    const requestUri = this.apiUrl+'/login_4m_session';
    const authorizationData = 'Basic '+ btoa(`${userName}:${password}`);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: authorizationData
      }),
      observe: 'response' as const
    };
    return this.http.post<any>(requestUri, null, httpOptions);
  }


  // Get report url list from MDO to shown in dropdwon of MS Teams app configuration page
  public getReportUrlList(): Observable<any[]>{
    return this.http.get<any[]>(this.endpointService.getReportListUrlForMsTeams());
  }

}
