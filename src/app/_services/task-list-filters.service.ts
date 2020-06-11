import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@services/endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListFiltersService {

  constructor(private http: HttpClient, private endpointService: EndpointService) { }
  getDynamicList(item) {
    return this.http.post<any>(this.endpointService.getFilterDynamicListsUrl(), item)
  }
}
