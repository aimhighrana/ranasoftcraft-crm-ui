import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];

  constructor(
    private loadingService: LoadingService,
    private sharedService: SharedServiceService
  ) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
        this.requests.splice(i, 1);
    }
    (this.requests.length > 0)? this.sharedService.showLoader() : this.sharedService.hideLoader()
    this.loadingService.isLoading().emit(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.loadingService.isLoading().emit(true);
    return new Observable(observer => {
        const subscription = next.handle(req)
            .subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        this.removeRequest(req);
                        observer.next(event);
                    }
                },
                err => {
                    this.removeRequest(req);
                    observer.error(err);
                },
                () => {
                    this.removeRequest(req);
                    observer.complete();
                });
        // remove request from queue when cancelled
        return () => {
            this.removeRequest(req);
            subscription.unsubscribe();
        };
    });
  }

}
