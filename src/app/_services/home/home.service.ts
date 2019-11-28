import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private languageUrl = 'http://localhost:8080/MDOSF/admin_user_tz.servlet';

  constructor(private http: HttpClient) { }

  getALlLanguage() {
    const header = new HttpHeaders();
    header.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJ1c2VySWRcIjpcIkFkbWluXCIsXCJmdWxsbmFtZVwiOlwiQWRtaW4gQWRtaW5cIn0iLCJpc3MiOiJNRE8iLCJleHAiOjE1NzM2MTg5MzYsImlhdCI6MTU3MzYxODAzNn0.-KWrMVeqcYgWe1dqTuT79qlWbqVIck_7Eydd1wbUfiY');
    // const body = '';
    return this.http.get<any>(this.languageUrl, {headers: header});
  }

}
