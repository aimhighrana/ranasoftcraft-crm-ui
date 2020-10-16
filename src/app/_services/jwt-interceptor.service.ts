import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { EndpointService } from '../_services/endpoint.service';
import { Router } from '@angular/router';
import { AccessDeniedDialogComponent } from '@modules/shared/_components/access-denied-dialog/access-denied-dialog.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  initialTotalRequests = 0;
  pendingRequestsCount = 0;
  constructor(
    private router: Router,
    private http: HttpClient,
    private endpointService: EndpointService,
    private accessDeniedComponent: AccessDeniedDialogComponent,
    private sharedService: SharedServiceService,
    private matDialog: MatDialog
  ) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.pendingRequestsCount++;
    this.initialTotalRequests++;
    // add authorization header with jwt token if available
    if (request.headers.has('Skip401Interceptor')) {
      const headers = request.headers.delete('Skip401Interceptor');
      return next.handle(request.clone({ headers }));
    } else {
      const jwtToken = localStorage.getItem('JWT-TOKEN');
      if (jwtToken && !request.headers.has('Authorization')) {
        request = this.addToken(request, jwtToken);
      }
      return next.handle(request).pipe(
        finalize(() => {
          this.pendingRequestsCount--;
          if (this.pendingRequestsCount === 0) {
            this.callAPI();
          }
        }),
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 401:
              return this.handlerFor401(request, next);

            case 403:
              this.handlerFor403(request, next);
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
      return this.http.post<any>(this.endpointService.jwtRefresh(), refreshToken, { observe: 'response', headers })
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
              if(error && error.status === 401) {
                this.logout();
              }
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

  /**
   * While http throw 403 ,
   * Open access denied comman dialog
   * @param req http request url control
   * @param next handler for http request
   */
  handlerFor403(req: HttpRequest<any>, next: HttpHandler) {
    if (req) {
      this.accessDeniedComponent.open();
    }
  }

  logout() {
    // const dialogRef = this.matDialog.open(ResumeSessionComponent, {
    //   data: {},
    //   disableClose: true,
    //   height:'200px',
    //   width:'300px'
    // });
    // dialogRef.afterClosed().subscribe(res=>{
    //   const url = document.getElementsByTagName('base')[0].href.substring(0, document.getElementsByTagName('base')[0].href.indexOf('MDOSF')) + 'MDOSF';
    //   window.close();
    //   window.open(url , 'MDO_TAB');
    //   localStorage.removetItem('JWT-TOKEN');
    //   localStorage.removetItem('JWT-REFRESH-TOKEN');
    //   // this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    // });
    try {
      localStorage.removetItem('JWT-TOKEN');
      localStorage.removetItem('JWT-REFRESH-TOKEN');
    }finally {
      this.router.navigate(['auth','login'], { queryParams: { returnUrl: this.router.url } });
    }
  }

  /**
   * when there are lot of request sequencially the this gets called
   * when all the callsare done and then after 1000 MS,
   * notification count gets updates
   */
  callAPI() {
    console.log(this.initialTotalRequests);
    if (this.initialTotalRequests > 0) {
      setTimeout(() => {
        console.warn('API Calls Completed, Updating notifications count');
        this.sharedService.getNotificationCount();
        this.initialTotalRequests = 0;
      }, 1000);
    }
  }
}
