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
}
