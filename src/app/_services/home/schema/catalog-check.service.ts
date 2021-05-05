import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoCorrectionRequest, MasterRecordChangeRequest } from '@models/schema/duplicacy';
import { EndpointsRuleService } from '@services/_endpoints/endpoints-rule.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogCheckService {

  constructor(private endpointService: EndpointsRuleService,
    private http: HttpClient) { }


  markAsMasterRecord(request: MasterRecordChangeRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.masterRecordChangeUrl(), request);
  }

  markForDeletion(objctNumber, moduleId, schemaId, runId) {
    return this.http.post<any>(this.endpointService.markForDeletionUrl(objctNumber, moduleId, schemaId, runId), null);
  }

  getAllGroupIds(params) : Observable<any> {

    return this.http.post<any>(this.endpointService.duplicacyGroupsListUrl(),  params )
      .pipe(
        map(data => {
          if (data){
            let groups = [];
            const response = {
              groups: [],
              searchAfter: ''
            };
            let searchAfter;
            data.bucket.buckets.map(id => {
              if (id.key.exact !== '') {
                groups = groups.concat({ groupId: id.key.exact, groupDesc: id.key.group, groupKey: 'exactGroupId' })
              }
              if (id.key.fuzzy !== '') {
                groups = groups.concat({ groupId: id.key.fuzzy, groupDesc: id.key.group, groupKey: 'fuzzyGroupId' })
              }
            });
            if (data.bucket.buckets.length !== 0) {
              console.log('after key : ' + data.bucket.buckets[data.bucket.buckets.length - 1].key);
              searchAfter = data.bucket.buckets[data.bucket.buckets.length - 1].key;
            }
            console.log('Groups ', groups);
            console.log('searchAfter ', searchAfter);
            response.groups = groups;
            response.searchAfter = searchAfter;
            return response;
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

  approveDuplicacyCorrection(schemaId, runId, objNums, userName): Observable<any> {
    return this.http.post<any>(this.endpointService.approveDuplicacyCorrectionUrl(schemaId, runId, userName), objNums);
  }

  rejectDuplicacyCorrection(schemaId, runId, objNums, userName): Observable<any> {
    return this.http.post<any>(this.endpointService.rejectDuplicacyCorrectionUrl(schemaId, runId, userName), objNums);
  }

}
