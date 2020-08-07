import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@services/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListFiltersService {

  constructor(public http: HttpClient, public endpointService: EndpointService) { }

  getDynamicList(item) {
    return this.http.post<any>(this.endpointService.getFilterDynamicListsUrl(), item)
  }
}
