import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsAuthService {

  constructor() { }

  apiUrl = environment.authUrl + '/auth';

  /**
   * Get uri for validate refresh jwt
   */
  public validateRefreshjwttokenUrl() : string {
    return `${this.apiUrl}/validate-refresh-token`;
  }

  public signIn() : string{
    return `${this.apiUrl}/signin`;
  }

  public getUserDetailsUrl(userName: string): string {
    return `${this.apiUrl}/user/detail/${userName}`;
  }

  public jwtRefresh(): string {
    return this.apiUrl + '/refresh';
  }

  public updatePassword(): string {
    return `${this.apiUrl}/user/update-password`;
  }
}
