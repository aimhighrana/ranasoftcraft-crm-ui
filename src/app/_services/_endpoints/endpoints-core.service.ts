import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsCoreService {

  apiurl = environment.apiurl + '/core'

  constructor() { }

  getAllObjectTypeUrl () {
    return this.apiurl + '/metadata/get-all-objecttype'
  }

  public getAllFieldsForViewUrl(moduleId): string {
    return this.apiurl + `/metadata/list-view-all-fields/${moduleId}`;
  }

  getObjectTypeDetailsUrl (moduleId) {
    return this.apiurl + `/metadata/get-module-desc/${moduleId}`
  }

}
