import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenPayLoadData, Userdetails } from 'src/app/_models/userdetails';
import * as jwt_decode from 'jwt-decode';
import { EndpointService } from '../endpoint.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../any2ts.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDeatilsBehaviorSubject = new BehaviorSubject<Userdetails>(new Userdetails());

  constructor(
    private endpointService: EndpointService,
    private http: HttpClient,
    private any2tsService: Any2tsService
  ) { }

  public getUserIdFromToken(): string {
    const jwtToken = localStorage.getItem('JWT-TOKEN');
    const tokenPayLoadData: TokenPayLoadData = new TokenPayLoadData();
    if (jwtToken && jwtToken !== '') {
      const afterDecode: any = jwt_decode(jwtToken);
      if (afterDecode.hasOwnProperty('sub')) {
        const subData: any = JSON.parse(afterDecode.sub);
        tokenPayLoadData.userName = subData.userId;
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
    if (this.userDeatilsBehaviorSubject.getValue().userName !== currentUserId) {
      this.http.post<any>(this.endpointService.getUserDetailsUrl(currentUserId), '').pipe(map(data => {
        this.userDeatilsBehaviorSubject.next(this.any2tsService.any2UserDetails(data));
      })).subscribe().unsubscribe();
    }
    return this.userDeatilsBehaviorSubject;
  }
}
