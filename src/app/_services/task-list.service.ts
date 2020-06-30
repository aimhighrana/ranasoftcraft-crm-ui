import { Injectable } from '@angular/core';
import { Filter } from '@models/task-list/filter';
import { EndpointService } from '@services/endpoint.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TaskListViewObject } from '@models/task-list/columnSetting';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  savedSearches = [
    { searchName: 'Search 1', id: 'ss-1' },
    { searchName: 'Search 2', id: 'ss-2' },
    { searchName: 'Search 3', id: 'ss-3' },
    { searchName: 'Search 4', id: 'ss-4' },
  ]

  taskDetails = {
    generalInformation: {
      task_id: '',
      requestor: '',
      due_date: '',
      module: '',
      tags: [{
        color: '',
        value: 'tag1'
      }, {
        color: '#eaeaea',
        value: 'tag2'
      }, {
        color: 'red',
        value: 'tag3'
      }],
      addressDetails: {
        name: '',
        address: '',
        homePhone: '',
        email: ''
      },
      bank_details: {
        country: '',
        account_number: '',
        name: '',
        email: ''
      }
    },
    history: [{
      user: '',
      role: '',
      slaHours: '',
      recievedOn: '',
      auctionedOn: ''
    }]
  }

  /**
   * Constructor of @class TaskListService
   */
  constructor(
    public endpointService: EndpointService,
    private http: HttpClient
  ) { }

  /**
   * Function to get Task list from Service
   * @param filters the filter object to send to sever
   * @param pagination the pagination object to send to server
   */
  getTasks(filters: Filter) {
    return this.http.post(this.endpointService.getTasksUrl(), filters)
  }

  /**
   * Function to get dynamic filters
   */
  public getDynamicFilters(userDetails) {
    const url = this.endpointService.getFiltersUrl();
    const requestData = {
      plantCode: userDetails.plantCode,
      userName: userDetails.userName,
      roleId: userDetails.currentRoleId,
      locale: 'en',
      clientId: '738'
    }
    return this.http.post(url, requestData);
  }

  /**
   * Function to get saves searches
   */
  getSavedSearches() {
    return of(this.savedSearches);
  }

  /**
   * Funtion to call the service to get the task details
   * @param taskId The id of the task
   */
  getTaskDetails(taskId: string) {
    return of(this.taskDetails);
  }

  /**
   * This is used to get the task list
   * @param userName The current logged in username
   */
  getTasklListViews(userName: string) {
    return this.http.get(this.endpointService.getTaskListViewsUrl(userName))
  }

  /**
   * This is delete to get the task list view
   * @param userName The current logged in username
   */
  deleteTaskListItem(viewId: string) {
    return this.http.delete(this.endpointService.getDeleteTaskListViewUrl(viewId), {})
  }

  /**
   * This is used to save the task list view
   * @param userName The current logged in username
   */
  saveTaskListView(taskListViewObject: TaskListViewObject) {
    return this.http.post(this.endpointService.getSaveTaskListURL(), taskListViewObject)
  }

  /**
   * This is used to update the task list view
   * @param userName The current logged in username
   */
  updateTaskListView(taskListViewObject: TaskListViewObject) {
    return this.http.post(this.endpointService.getSaveTaskListURL(), taskListViewObject);
  }
}
