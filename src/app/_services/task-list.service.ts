import { InboxNodesCount } from '@models/list-page/listpage';
import { EndpointsProcessService } from './_endpoints/endpoints-process.service';

import { Injectable } from '@angular/core';
import { TaskListRequest } from '@models/task-list/filter';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TaskListSummaryRequestParams, CommonGridRequestObject } from '@models/task-list/taskListDetails';
import { TaskListViewObject } from '@models/task-list/columnSetting';
import { EndpointsClassicService } from './_endpoints/endpoints-classic.service';

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

  /**
   * Constructor of @class TaskListService
   */
  constructor(
    public endpointService: EndpointsClassicService,
    public endpointsProcessService: EndpointsProcessService,
    private http: HttpClient
  ) { }

  /**
   * Function to get Task list from Service
   * @param filters the filter object to send to sever
   * @param pagination the pagination object to send to server
   */
  getTasks(filters: TaskListRequest) {
    return this.http.post(this.endpointService.getTasksUrl(), filters)
  }

  /**
   * Function to get dynamic filters
   */
  getDynamicFilters(userDetails) {
    const requestData = {
      plantCode: userDetails.plantCode,
      userName: userDetails.userName,
      roleId: userDetails.currentRoleId,
      locale: 'en',
      clientId: '738'
    }
    return this.http.post(this.endpointService.getFiltersUrl(), requestData);
  }

  /**
   * Function to get saves searches
   */
  getSavedSearches() {
    return of(this.savedSearches);
  }

  /**
   * Task list count
   */
  getTaskListCount(filters: TaskListRequest) {
    return this.http.post(this.endpointService.getTaskListCountURL(), filters)
  }

  /*
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

  /**
   * This is function to get audit logs(history for task summary page)
   * @param objectNumber object number of selected task
   * @param taskId task id of selected task
   */
  getAuditLogs(objectNumber: string, taskId: string, language: string) {
    return this.http.post(this.endpointService.getAuditTrailLogsURL(), { objectNumber, taskId, language })
  }

  getGridMetaData(gridRequestParams: CommonGridRequestObject) {
    return this.http.get(this.endpointService.getGridMetaDataURL(gridRequestParams))
  }

  getGridData(gridRequestParams: CommonGridRequestObject) {
    return this.http.get(this.endpointService.getGridDataUrl(gridRequestParams))
  }

  getMetadataByWfid(wfid: string) {
    return this.http.get(this.endpointService.getMetadataByWfid(wfid))
  }

  getCommonLayoutData(taskListSummaryRequestParams: TaskListSummaryRequestParams) {
    return this.http.get(this.endpointService.getCommonLayoutDataUrl(taskListSummaryRequestParams))
  }

  getChangeAuditLogDetails(taskId: string, userId: string, language: string) {
    return this.http.post(this.endpointService.getChangeLogDetails(), { taskId, userId, language })
  }

  saveTasklistVisitByUser(nodeId: string) {
    return this.http.post(this.endpointsProcessService.saveTasklistVisitByUserUrl(nodeId), {});
  }

  public getInboxNodesCount() {
    return this.http.get<InboxNodesCount[]>(this.endpointsProcessService.getInboxNodesCountUrl());
  }

  public saveOrUpdateTasklistHeaders(nodeId: string, payload: {fldId: string, order: number}[]) {
    return this.http.post(this.endpointsProcessService.saveOrUpdateTasklistHeadersUrl(nodeId), payload);
  }

  public getHeadersForNode(nodeId: string) {
    return this.http.get<any[]>(this.endpointsProcessService.getHeadersForNodeUrl(nodeId));
  }
}
