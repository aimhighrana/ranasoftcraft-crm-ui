import { DataList } from '@modules/list/_components/list.component';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterCriteria, ListPageViewDetails, ViewsPage } from '@models/list-page/listpage';
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
   public getAllListPageViews(moduleId, offSet): Observable<ViewsPage> {
    return this.http.get<ViewsPage>(this.endpointService.getAllListPageViewsUrl(), { params: {moduleId, offSet}});
  }

/**
 * get list page view details
 * @param viewId view id
 */
 public getListPageViewDetails(viewId: string, moduleId): Observable<ListPageViewDetails> {
  return this.http.get<ListPageViewDetails>(this.endpointService.getListPageViewDetailsUrl(viewId), { params: {moduleId}});
}

/**
 * update list page view details
 */
public upsertListPageViewDetails(viewDetails: ListPageViewDetails, moduleId): Observable<ListPageViewDetails> {
  return this.http.post<any>(this.endpointService.upsertListPageViewUrl(), viewDetails, { params: {moduleId}});
}

/**
 * delete list page view details
 */
 public deleteListPageView(viewId: string, moduleId): Observable<ListPageViewDetails> {
  return this.http.delete<any>(this.endpointService.deleteListPageViewUrl(viewId), { params: {moduleId}});
}

/**
 * get table records
 * @param moduleId module id
 * @param viewId active view id
 * @param pageId page index
 * @param filterCriterias applied filters
 * @returns page records
 */
public getTableData(moduleId: string, viewId: string, pageId: number, filterCriterias: FilterCriteria[]): Observable<any> {
  return this.http.post<any>(this.endpointService.getTableDataUrl(), filterCriterias, {params: {moduleId, viewId, pageId: `${pageId}`}})
}

/**
 * get records count
 * @param moduleId module id
 * @param filterCriterias uplied filters
 * @returns total records count
 */
public getDataCount(moduleId: string, filterCriterias: FilterCriteria[]): Observable<number> {
  return this.http.post<number>(this.endpointService.getDataCountUrl(), filterCriterias, {params: {moduleId}})
}

}
