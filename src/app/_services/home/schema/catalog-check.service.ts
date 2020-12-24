import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoCorrectionRequest, MasterRecordChangeRequest } from '@models/schema/duplicacy';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogCheckService {

  constructor(private endpointService: EndpointsClassicService,
    private http: HttpClient) { }


  markAsMasterRecord(request: MasterRecordChangeRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.masterRecordChangeUrl(), request);
  }

  markForDeletion(objctNumber, moduleId) {
    return this.http.post<any>(this.endpointService.markForDeletionUrl(objctNumber, moduleId), null);
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
    return this.http.post<any>(this.endpointService.catalogCheckRecordsUrl(), params);
  }

  doCorrection(schemaId, runId, request: DoCorrectionRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.doDuplicacyCorrectionUrl(schemaId, runId), request);
  }

}
