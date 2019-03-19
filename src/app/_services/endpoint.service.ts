import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor() { }

  public login(): string {
    return '<api_url>' + '/' + '<api_version>' + '/login';
  }

}
