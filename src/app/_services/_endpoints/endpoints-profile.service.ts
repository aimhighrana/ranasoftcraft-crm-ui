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

  public getUserPreferenceDetails(): string {
    return `${this.apiUrl}/get-user-pref`;
  }

  public updateUserPreferenceDetails(): string {
    return `${this.apiUrl}/save-user-pref`;
  }

  public getAllLanguagesList(): string {
    return `${this.apiUrl}/get-all-languages`;
  }

  public getDateFormatList(): string {
    return `${this.apiUrl}/get-date-format`;
  }

  public getNumberFormatList(): string {
    return `${this.apiUrl}/get-number-format`;
  }
}
