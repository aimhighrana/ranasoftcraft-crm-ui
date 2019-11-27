import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor() { }

  public getTasks(): string {
    // return '<api_url>' + '/' + '<api_version>' + '/login';
    return 'https://mdoqa.masterdataonline.com/MDOSF/REST/restTasklistServices/taskList?userId=demorev';
  }
  public login(): string {
    throw new Error('Login not implemented');
  }

  public jwtRefresh(): string {
    return '/jwt/refresh';
  }

}
