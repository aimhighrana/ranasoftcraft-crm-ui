import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { EndpointService } from '../_services/endpoint.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private endpointService: EndpointService
  ) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const jwtToken = localStorage.getItem('JWT-TOKEN');
    if (jwtToken && !request.headers.has('Authorization')) {
        request = this.addToken(request, jwtToken);
    }
    if (request.headers.has('Skip401Interceptor')) {
        const headers = request.headers.delete('Skip401Interceptor');
        return next.handle(request.clone({ headers }));
    } else {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                switch (error.status) {
                    case 401:
                    return this.handlerFor401(request, next);
                }
                // notify user here
                return throwError(error);
            }));
    }
  }

  handlerFor401(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
        this.isRefreshingToken = true;

        // Reset here so that the following requests wait until the token
        // comes back from the refreshToken call.
        this.tokenSubject.next(null);

        const headers: HttpHeaders = new HttpHeaders({
            Skip401Interceptor: ''
        });
        const refreshToken = localStorage.getItem('JWT-REFRESH-TOKEN');
        return this.http.post<any>(this.endpointService.jwtRefresh(), { refreshToken }, { observe: 'response', headers })
            .pipe(
                finalize(() => this.isRefreshingToken = false),
                switchMap(
                    resp => {
                        const jwtToken = resp.headers.get('JWT-TOKEN');
                        const newRefreshToken = resp.headers.get('JWT-REFRESH-TOKEN');
                        if (jwtToken && newRefreshToken) {
                          localStorage.setItem('JWT-TOKEN', jwtToken);
                          localStorage.setItem('JWT-REFRESH-TOKEN', newRefreshToken);
                          this.tokenSubject.next(jwtToken);
                          return next.handle(this.addToken(req, jwtToken));
                        }
                        this.logout();
                        return throwError(new Error('oops! no token'));
                    }
                ),
                catchError(
                    (error, ca) => {
                        this.logout();
                        return throwError(error);
                    }
                ));
    } else {
        return this.tokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
                return next.handle(this.addToken(req, token));
            }));
    }
  }

  logout() {
    localStorage.removetItem('JWT-TOKEN');
    localStorage.removetItem('JWT-REFRESH-TOKEN');
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  }
}
