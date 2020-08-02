import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EndpointService } from './endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowBuilderService {

  recipientsListSample = [
    'Bilel', 'Nikhil', 'Sandeep', 'Saurabh'
  ] ;

  workflowFieldsSample = {
    allWFfield: [
      { id : 1, label : 'Moving price R', picklist : '0', datatype : 'CHAR'},
      // { id : 2, label : 'Price control', key : 'priceControl', type : 'select', options : ['option 1', 'option 2']},
      { id : 3, label : 'Storage bin', picklist : '0', datatype : 'NUM'}
    ]
  };


  customEventsSample = [
    { id : 1, label : 'Date check'},
    { id : 2, label : 'Update status'},
    { id : 3, label : 'Value edit'}
  ] ;

  constructor(private http : HttpClient,
              private endpointService : EndpointService) { }



  getRecipientList(data) : Observable<any>{
    // return of(this.recipientsListSample) ;
     return this.http.get<any>(this.endpointService.getLoadRecipientsListUrl(), {params : data}) ;
  }

  getWorkflowFields(data) : Observable<any>{
    // return of(this.workflowFieldsSample) ;
    return this.http.get(this.endpointService.getWfFieldsListUrl(), {params : data}) ;
  }

  getLoadApi(data) : Observable<any>{
    return this.http.get(this.endpointService.getLoadApisUrl(), {params: data}) ;
  }

  saveWfDefinition(data) : Observable<any>{

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new HttpParams()
    .set('plantCode', data.plantCode)
    .set('moduleId', data.moduleId)
    .set('userName', data.userName)
    .set('stepDataxml', data.stepDataxml);

    return this.http.post(this.endpointService.getSaveWfDefinitionUrl(), body, {headers}) ;

    // return this.http.post(this.endpointService.getSaveWfDefinitionUrl(), null, {params : data, headers}) ;
    // return this.http.post(this.endpointService.getSaveWfDefinitionUrl(), data) ;
  }

  getFieldOptions(data) : Observable<any>{
    return this.http.get(this.endpointService.getFieldOptionsUrl(), {params: data}) ;
  }

  getwfDefinition(data) : Observable<any>{
    return this.http.get(this.endpointService.getloadWfDefinitionUrl(), {params: data}) ;
  }

}
