import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenPayLoadData, Userdetails, UserPasswordDetails, UserPersonalDetails, UserPreferenceDetails } from 'src/app/_models/userdetails';
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../any2ts.service';
import { EndpointsAuthService } from '@services/_endpoints/endpoints-auth.service';
import { EndpointsProfileService } from '@services/_endpoints/endpoints-profile.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDetailsBehaviorSubject = new BehaviorSubject<Userdetails>(new Userdetails());

  constructor(
    private endpointService: EndpointsAuthService,
    private http: HttpClient,
    private any2tsService: Any2tsService,
    private profileEndpointService: EndpointsProfileService
  ) { }

  public getUserIdFromToken(): string {
    const jwtToken = localStorage.getItem('JWT-TOKEN');
    const tokenPayLoadData: TokenPayLoadData = new TokenPayLoadData();
    if (jwtToken && jwtToken !== '') {
      const afterDecode: any = jwt_decode(jwtToken);
      if (afterDecode.hasOwnProperty('sub')) {
        const subData: any = JSON.parse(afterDecode.sub);
        tokenPayLoadData.userName = subData.username;
        tokenPayLoadData.fullName = subData.fullname;
      }
      tokenPayLoadData.iat = afterDecode.iat;
      tokenPayLoadData.exp = afterDecode.exp;
      tokenPayLoadData.iss = afterDecode.iss;
      return tokenPayLoadData.userName;
    }
    return;
  }

  public getUserDetails(): Observable<Userdetails> {
    // check subjectuserdetails userid !== jwt token userid, call service
    const currentUserId = this.getUserIdFromToken();
    if (this.userDetailsBehaviorSubject.getValue().userName !== currentUserId) {
      this.http.get<any>(this.endpointService.getUserDetailsUrl(currentUserId)).pipe(map(data => {
        this.userDetailsBehaviorSubject.next(this.any2tsService.any2UserDetails(data));
      })).subscribe();
    }
    return this.userDetailsBehaviorSubject;
  }

  public getUserPersonalDetails(): Observable<UserPersonalDetails> {
    return this.http.get<UserPersonalDetails>(this.profileEndpointService.getPersonalDetails());
  }

  public updateUserPersonalDetails(personalDetails: UserPersonalDetails): Observable<any> {
    return this.http.post<any>(this.profileEndpointService.updatePersonalDetails(), personalDetails);
  }

  public getUserPreferenceDetails(): Observable<UserPreferenceDetails> {
    return this.http.get<UserPreferenceDetails>(this.profileEndpointService.getUserPreferenceDetails());
  }

  public updateUserPreferenceDetails(pref: UserPreferenceDetails): Observable<any> {
    return this.http.post<any>(this.profileEndpointService.updateUserPreferenceDetails(), pref);
  }

  public getAllLanguagesList(): Observable<any> {
    return this.http.get<any>(this.profileEndpointService.getAllLanguagesList());
  }

  public getDateFormatList(): Observable<any> {
    return this.http.get<any>(this.profileEndpointService.getDateFormatList());
  }

  public getNumberFormatList(): Observable<any> {
    return this.http.get<any>(this.profileEndpointService.getNumberFormatList());
  }

  public updatePassword(passwordDetails: UserPasswordDetails): Observable<any> {
    return this.http.post<any>(this.endpointService.updatePassword(), passwordDetails);
  }
}
