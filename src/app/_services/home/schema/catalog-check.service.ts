import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@services/endpoint.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogCheckService {

  constructor(private endpointService: EndpointService,
    private http: HttpClient) { }


  markAsMasterRecord(recordId) {
    return of(true);
  }

  markForDeletion(recordId) {
    return of(true);
  }

  getAllGroupIds(params) : Observable<any> {

    return this.http.get<any>(this.endpointService.duplicacyGroupsListUrl(), { params })
      .pipe(
        map(data => {
          if (data){
            let groups = data.exactGroupId.map(id => {return  {groupId: id, groupKey: 'exactGroupId' }});
            groups = groups.concat(data.fuzzyGroupId.map(id => {return  {groupId: id, groupKey: 'fuzzyGroupId' }}));
            console.log('Groups ', groups);
            return groups;
          }
          return [];
        })
      );
  }

  getCatalogCheckRecords(params): Observable<any>{
    return this.http.post<any>(this.endpointService.catalogCheckRecordsUrl(), null , { params });
  }

}
