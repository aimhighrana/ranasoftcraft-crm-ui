import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsProfileService {

  apiUrl = environment.apiurl + '/profile';

  constructor() { }

  public getPersonalDetails(): string {
    return `${this.apiUrl}/get-personal-details`;
  }

  public updatePersonalDetails(): string {
    return `${this.apiUrl}/save-personal-details`;
  }
}
