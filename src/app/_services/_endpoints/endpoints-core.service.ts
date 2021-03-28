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

  public getAllFieldsForViewUrl(): string {
    return this.apiurl + `/metadata/list-view-fields`;
  }

}
