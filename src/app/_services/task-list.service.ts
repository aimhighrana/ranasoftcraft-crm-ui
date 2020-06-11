import { Injectable } from '@angular/core';
import { TaskListRow } from '@models/task-list/taskListRow';
import { Filter, StaticFilter, DynamicFilter } from '@models/task-list/filter';
import { Pagination } from '@models//task-list/pagination';
import { EndpointService } from '@services/endpoint.service';
import { of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  sampleList: TaskListRow[] = [
    {
      task_id: 'Task ID - OTV484',
      description: 'OTV484 Vendor has been created and sent for your approval.',
      requestor: 'Prospecta Administrator',
      recieved_on: 'April 20, 2019 04:40:33',
      due_date: 'September 20, 2020 04:40:33',
      module: 'Material',
      priority: 'Medium',
      tags: [{
        color: 'pink',
        value: 'tag1'
      }, {
        color: 'red',
        value: 'tag2'
      }, {
        color: 'blue',
        value: 'tag3'
      }, {
        color: 'green',
        value: 'tag4'
      }, {
        color: 'pink',
        value: 'tag5'
      }],
    }, {
      task_id: 'Task ID - OTV485',
      description: 'OTV484 Vendor has been created and sent for your approval.',
      requestor: 'Prospecta Administrator',
      recieved_on: 'April 20, 2019 04:40:33',
      due_date: 'September 20, 2020 04:40:33',
      module: 'Customer',
      priority: 'Medium',
      tags: [{
        color: 'pink',
        value: 'tag1'
      }, {
        color: 'red',
        value: 'tag2'
      }, {
        color: 'blue',
        value: 'tag3'
      }, {
        color: 'green',
        value: 'tag4'
      }, {
        color: 'pink',
        value: 'tag5'
      }],
    }, {
      task_id: 'Task ID - OTV486',
      description: 'OTV484 Vendor has been created and sent for your approval.',
      requestor: 'Prospecta Administrator',
      recieved_on: 'April 20, 2019 04:40:33',
      due_date: 'September 20, 2020 04:40:33',
      module: 'Material',
      priority: 'Medium',
      tags: [{
        color: 'pink',
        value: 'tag1'
      }, {
        color: 'red',
        value: 'tag2'
      }, {
        color: 'blue',
        value: 'tag3'
      }, {
        color: 'green',
        value: 'tag4'
      }, {
        color: 'pink',
        value: 'tag5'
      }],
    }, {
      task_id: 'Task ID - OTV487',
      description: 'OTV484 Vendor has been created and sent for your approval.',
      requestor: 'Prospecta Administrator',
      recieved_on: 'April 20, 2019 04:40:33',
      due_date: 'September 20, 2020 04:40:33',
      module: 'Material',
      priority: 'Medium',
      tags: [{
        color: 'pink',
        value: 'tag1'
      }, {
        color: 'red',
        value: 'tag2'
      }, {
        color: 'blue',
        value: 'tag3'
      }, {
        color: 'green',
        value: 'tag4'
      }, {
        color: 'pink',
        value: 'tag5'
      }],
    }
  ]

  staticFilters: StaticFilter = {
    status: '',
    priority: '',
    region: '',
    recieved_on: new Date(),
    due_date: new Date(),
    requested_by: ''
  }

  dynamicFilters: DynamicFilter[] = [
    {
      objectType: '0000',
      objectDesc: 'All Modules',
      filterFields: [],
      colorActive: true,
    }
  ]

  sampleColumns = [
    { value: 'task_id', hasLargeText: false, visible: true },
    { value: 'description', hasLargeText: true, visible: true },
    { value: 'requestor', hasLargeText: false, visible: true },
    { value: 'recieved_on', hasLargeText: false, visible: true },
    { value: 'due_date', hasLargeText: false, visible: true },
    { value: 'module', hasLargeText: false, visible: true },
    { value: 'priority', largeText: false, visible: true },
    { value: 'tags', hasLargeText: false, visible: true }
  ]

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
  dynamicFiltersObservable: BehaviorSubject<DynamicFilter[]> = new BehaviorSubject([]);

  /**
   * Constructor of @class TaskListService
   */
  constructor(
    private endpointService: EndpointService,
    private http: HttpClient
  ) { }

  /**
   * Function to get Task list from Service
   * @param filters the filter object to send to sever
   * @param pagination the pagination object to send to server
   */
  getTasks(filters: Filter, pagination: Pagination) {
    return of(this.sampleList);
    // return this.http.get(this.endpointService.getTasksListUrl());
  }

  public getStaticFilters(): StaticFilter {
    return this.staticFilters;
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
   * function to get columns(optional as of now)
   */
  getColumns() {
    return of(this.sampleColumns);
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
}
