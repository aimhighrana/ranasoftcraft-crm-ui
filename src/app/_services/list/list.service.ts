import { DataList } from '@modules/list/_components/list.component';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListPageViewDetails, ListPageViewFldMap } from '@models/list-page/listpage';
import { EndpointsListService } from '@services/_endpoints/endpoints-list.service';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private dataOfList: DataList[] = [
      {
        objectId:'1004',objectDesc:'Functional location'
      },{
        objectId:'1005',objectDesc:'Material'
      },{
        objectId:'1007',objectDesc:'Customer'
      }
  ];
  constructor(private http: HttpClient,
    private endpointService: EndpointsListService) {}

  apiUrl = environment.apiurl;
  public dataList(): Observable<DataList[]> {
    return of(this.dataOfList);
  }

  /**
   * get all list page views
   */
   public getAllListPageViews(userId, role, tenantcode, moduleId, pageIndex?, pageSize?): Observable<ListPageViewDetails[]> {
    const viewsList = [];
    for(let i=1; i<=10; i++) {
      const view = new ListPageViewDetails();
      view.viewId = `${Math.floor(Math.random()*1000)}`;
      view.viewName = `view ${view.viewId}`;
      view.fieldsReqList.push({fieldId: `Column ${view.viewId}`} as ListPageViewFldMap);
      viewsList.push(view);
    }
    return of(viewsList);

  // return this.http.get<ListPageViewDetails[]>(this.endpointService.getAllListPageViewsUrl(), { params: {userId, role, tenantcode, moduleId}});
}

/**
 * get list page view details
 * @param viewId view id
 */
 public getListPageViewDetails(viewId: string, userId, role, tenantcode, moduleId): Observable<ListPageViewDetails> {
  return this.http.get<ListPageViewDetails>(this.endpointService.getListPageViewDetailsUrl(viewId), { params: {userId, role, tenantcode, moduleId}});
}

/**
 * update list page view details
 */
public upsertListPageViewDetails(viewDetails: ListPageViewDetails, userId, role, tenantcode, moduleId): Observable<ListPageViewDetails> {
  return this.http.post<any>(this.endpointService.upsertListPageViewUrl(), viewDetails, { params: {userId, role, tenantcode, moduleId}});
}

/**
 * delete list page view details
 */
 public deleteListPageView(viewId: string, userId, role, tenantcode, moduleId): Observable<ListPageViewDetails> {
  return this.http.delete<any>(this.endpointService.deleteListPageViewUrl(viewId), { params: {userId, role, tenantcode, moduleId}});
}
}
