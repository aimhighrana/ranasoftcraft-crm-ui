import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsListService {

  apiUrl = environment.apiurl + '/list';

  constructor() { }

  public getAllListPageViewsUrl(): string {
    return this.apiUrl + `/view/all`;
  }

  public getListPageViewDetailsUrl(viewId: string): string {
    return this.apiUrl + `/view/${viewId}`;
  }

  public upsertListPageViewUrl(): string {
    return this.apiUrl + '/view/save-update-view';
  }

  public deleteListPageViewUrl(viewId: string): string {
    return this.apiUrl + `/view/delete-view/${viewId}`;
  }

}
