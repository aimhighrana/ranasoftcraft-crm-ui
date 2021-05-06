import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsProcessService {
  apiUrl = environment.apiurl + '/process';

  constructor() { }

  public getInboxNodesCountUrl() {
    return `${this.apiUrl}/feed/count`;
  }

  public saveTasklistVisitByUserUrl(nodeId: string): string {
    return `${this.apiUrl}/feed/visit/${nodeId}`;
  }

  public saveOrUpdateTasklistHeadersUrl(nodeId: string): string {
    return `${this.apiUrl}/${nodeId}/field/save-update`;
  }

  public getHeadersForNodeUrl(nodeId: string): string {
    return `${this.apiUrl}/${nodeId}/field/list`;
  }

  public getTaskListDataUrl(nodeId: string, lang: string, size: number, searchAfter: string): string {
    return `${this.apiUrl}/tasklist/${nodeId}/${lang}/get-data?size=${size}&searchAfter=${searchAfter}`;
  }
}
