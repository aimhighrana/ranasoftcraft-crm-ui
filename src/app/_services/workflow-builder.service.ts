import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from './endpoint.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowBuilderService {

  recipientsListSample = [
    'Bilel', 'Nikhil', 'Sandeep', 'Saurabh'
  ] ;

  workflowFieldsSample = [
    { id : 1, label : 'Moving price R', key : 'movingPriceR', type : 'input'},
    { id : 2, label : 'Price control', key : 'priceControl', type : 'select', options : ['option 1', 'option 2']},
    { id : 3, label : 'Storage bin', key : 'storageBin', type : 'input'}
  ] ;


  customEventsSample = [
    { id : 1, label : 'Date check'},
    { id : 2, label : 'Update status'},
    { id : 3, label : 'Value edit'}
  ] ;

  constructor(private http : HttpClient,
              private endpointService : EndpointService) { }



  getRecipientList(){
    return of(this.recipientsListSample) ;
    // return this.http.get(this.endpointService.getLoadRecipientsListUrl()) ;
  }

  getWorkflowFields(){
    return of(this.workflowFieldsSample) ;
    // return this.http.get(this.endpointService.getLoadRecipientsListUrl()) ;
  }

  getCustomEvents(){
    return of(this.customEventsSample) ;
    // return this.http.get(this.endpointService.getLoadRecipientsListUrl()) ;
  }

}