import { Component, OnInit, ViewChild, ChangeDetectionStrategy, Output, OnDestroy } from '@angular/core';
import { TaskListRow } from '@models/task-list/taskListRow';
import { Filter, DynamicFilter } from '@models/task-list/filter';
import { TaskListService } from '@services/task-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription, forkJoin } from 'rxjs';

import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Pagination } from '@models/task-list/pagination';
import { TaskListViewObject } from '@models/task-list/columnSetting';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Utilities } from '@modules/base/common/utilities';
import { MatDialog } from '@angular/material/dialog';
import { SaveSearchDialogComponent } from '../save-search-dialog/save-search-dialog.component';

@Component({
  selector: 'pros-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TaskListComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource();
  displayedColumns = [
    'taskid',
    'emailtext',
    'requestorName',
    'datestarted',
    'duedate',
    'fname',
    'objectdesc',
    'priorityType',
    'tags',
    'setting',
  ];





  @ViewChild(MatSort) sort: MatSort;

  /**
   * list of tasks from service
   */
  tasks: TaskListRow[] = [];

  /**
   * flag to show dynamic filters
   */
  dynamicFiltersVisible = false;

  /**
   * this is used to subscribe to changes for task list
   * so that it can be unsubscribed
   */
  taskListSubscription = new Subscription();

  /**
   * router listener
   */
  routerSubscription = new Subscription();
  /**
   * this is used to subscribe to changes for user details
   * so that it can be unsubscribed
   */
  userDetailSubscription = new Subscription();

  /**
   * Filters object from the api
   */
  filters: Filter = {
    staticFilters: {
      status: '',
      priority: '',
      region: '',
      recieved_date: '',
      requested_date: '',
      due_date: '',
      requested_by: ''
    },
    dynamicFilters: [],
    tags: [],
    apiRequestStructure: []
  }

  /**
   * This is used to emit the upated filters
   */
  @Output() filterEmitter = new BehaviorSubject({});


  /**
   * list of columns from the service
   */
  tableColumns;

  /**
   * saved seaches list
   */
  savedSearches;

  /**
   * flag to show Column setting pop-up
   */
  showColumnSettingPopUp = false;

  /**
   * Flag to show details of task
   */
  showTaskDetails = false;

  /**
   * This is use to store the selectesd task's id to be
   * send to details component
   */
  selectedTaskId: string;

  /**
   * This is used to enable/disable the dragger
   */
  enableDragging = new Subject();

  /**
   * This is a view child object to get the tabs data
   */
  @ViewChild('tabs', { static: false }) tabGroup: MatTabGroup;

  /**
   * This is used to get the logged in user details
   */
  userDetails: Userdetails;

  /**
   * This is the list of the task list views
   */
  taskListViews: TaskListViewObject[] = [];

  /**
   * This is used to get the selected tabs
   * The reason is to make this dynamic and convert it into
   * a pascal case value;
   */
  availableTabs = [
    {
      value: 'My tasks',
      code: 'myTasks'
    }, {
      value: 'In WorkFlow',
      code: 'inWorkFlow'
    }, {
      value: 'Completed',
      code: 'completed'
    }
  ]

  sortableHeaders = [];
  /**
   * This is used to get the currently active tab
   */
  activeTab: string;
  /**
   * This is main form to call the task list api
   */
  filterForm: FormGroup;

  /**
   * This is flag for wild card search
   */
  wildSearchEnabled = false;

  /**
   * This is the value for wildCardsearch field
   */
  wildSearchValue: string;

  /**
   * This is the limit for pagination
   */
  paginationLimit: number;
  /**
   * This is used to get current task
   */
  currentTask: any;
  /*
   * This stores the active id
   */
  activeViewId: string;

  /**
   * construtor of @class TaskListComponent
   * @param taskListService This is the object of the service
   */
  constructor(public taskListService: TaskListService, private _router: Router,
    private _activeRouter: ActivatedRoute, private userService: UserService, private location: Location,
    public utilities: Utilities,
    public dialog: MatDialog) { }

  /**
   * ANGULAR HOOK
   * This is used here to inlitialize all the Datastructures for
   * tasks, columns and searches.
   */
  ngOnInit(): void {
    this.initializeForm()
    this.getTasks();
    this.getSavedSearches();
    this.getDefaultViews()
    const columnVisibleObject = []
    this.displayedColumns.forEach((column) => {
      columnVisibleObject.push({ visible: true, value: column })
    })
    this.tableColumns = columnVisibleObject;

    this.routerSubscription = this._activeRouter.params.subscribe((urlParams) => {
      if (urlParams && urlParams.wfid) {
        this.showTaskDetails = true;
        this.activeTab = urlParams.tabId;
        this.showOnly2Columns();
      }
    });
  }

  /**
   * this is used to call the service with the text search
   * @param event the typed in text
   */
  doWildSearch(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const existing = this.filterForm.controls.filtersMap.value;
    if (target.value.length === 0) {
      delete existing.wildCardSearch;
      this.wildSearchEnabled = false;
    }
    else {
      existing.wildCardSearch = target.value;
      this.wildSearchValue = target.value;
      this.wildSearchEnabled = true;
    }
    this.filterForm.controls.filtersMap.setValue(existing);
    this.filterForm.updateValueAndValidity();
    this.getTasks();
  }

  /**
   * This funcction initialize the form
   */
  initializeForm() {
    this.filterForm = new FormGroup({
      objectToLoad: new FormControl(['ALL']),
      fetchSize: new FormControl(10), // per page no of items
      fetchCount: new FormControl(0), // page id
      sortField: new FormControl([]),
      filtersMap: new FormControl({ wildCardSearch: '' })
    })
  }

  /**
   * function to get task list and pagination limit
   * from the service
   */
  getTasks() {
    this.taskListSubscription = forkJoin(
      [
        this.taskListService.getTasks(this.filterForm.value),
        this.taskListService.getTaskListCount(this.filterForm.value)
      ]
    ).subscribe(([taskList, paginationLimit]: [TaskListRow[], number]) => {
      this.dataSource.data = taskList;
      this.paginationLimit = paginationLimit;
      if (this.selectedTaskId) {
        const selectedTask = taskList.find(item => item.taskid === this.selectedTaskId);
        this.currentTask = selectedTask;
        this.getDefaultViews();
      }
    });
  }

  /**
   * This is used to paginate the task list
   * @param event pagination event
   */
  paginate(event: Pagination) {
    this.filterForm.controls.fetchSize.setValue(event.pageSize);
    this.filterForm.controls.fetchCount.setValue(event.pageIndex);
    this.getTasks();
  }

  /**
   * function to get filters from the service
   */
  getFilters = async () => {
    const firstDynamicObject: DynamicFilter = {
      objectType: '0000',
      objectDesc: 'All Modules',
      filterFields: [],
      colorActive: true
    }

    if (!this.dynamicFiltersVisible) {
      this.userDetailSubscription = this.userService.getUserDetails()
        .pipe(
          distinctUntilChanged()
        ).subscribe((userDetails: Userdetails) => {
          this.taskListSubscription = this.taskListService.getDynamicFilters(userDetails)
            .pipe(distinctUntilChanged())
            .subscribe((dynamicFilters: DynamicFilter[]) => {
              this.filters.dynamicFilters.length = 0;
              dynamicFilters.forEach((filteritem) => {
                filteritem.colorActive = false;
              });
              dynamicFilters.unshift(firstDynamicObject);
              this.filters.dynamicFilters.push(...dynamicFilters);
              this.dynamicFiltersVisible = true;
              this.filterEmitter.next(this.filters);
            })
        })
    } else {
      this.dynamicFiltersVisible = false;
    }
  }

  /**
   * function to toggle dynamic filters
   */
  toggleDynamicFilters() {
    this.dynamicFiltersVisible = !this.dynamicFiltersVisible;
  }

  /**
   * function to recieve updated filters from child component
   * @param filters The filters object
   */
  updateFilters(filters: Filter) {
    const staticKeys = Object.keys(filters.staticFilters);
    const nonNullFields = staticKeys.filter(key => filters.staticFilters[key] != null && filters.staticFilters[key] !== '')
    this.filterForm.controls.filtersMap.reset()
    const filtersMapData = { modules: [] }
    nonNullFields.forEach((field) => {
      filtersMapData[field] = filters.staticFilters[field]
    })
    const availableTagsData = filters.apiRequestStructure.filter(item => item.fieldData.filterList.length > 0);
    const selectedTagsObjectId = availableTagsData.map(item => item.objectId);
    console.log(selectedTagsObjectId);
    if (availableTagsData.length > 0) {
      const existingSavedObjectIds = this.filterForm.controls.objectToLoad.value;
      selectedTagsObjectId.forEach((objectId) => {
        if (existingSavedObjectIds.indexOf(objectId) < 0) {
          existingSavedObjectIds.push(objectId);
        }
      });
      this.filterForm.controls.objectToLoad.setValue(existingSavedObjectIds);
    } else {
      this.filterForm.controls.objectToLoad.setValue(['ALL']);
    }
    filtersMapData.modules = availableTagsData;
    this.filterForm.controls.filtersMap.setValue(filtersMapData);
    this.getTasks();
  }

  /**
   * reciever from child component to close filter box
   * @param value the current value
   */
  closeFilterBox() {
    this.dynamicFiltersVisible = true;
  }

  /**
   * function to toggle columns settings pop up
   */
  toggleColumnSettingPopUp() {
    this.showColumnSettingPopUp = !this.showColumnSettingPopUp;
  }

  /**
   * Function to get Saved Searches
   */
  getSavedSearches() {
    this.taskListSubscription = this.taskListService.getSavedSearches().subscribe((response) => {
      this.savedSearches = response;
    })
  }

  /**
   * Function to set the value of selected task to
   * send to the details page
   * @param taskId the id of the selected task
   */
  getTaskDetails(task: TaskListRow) {
    this.activeTab = this.availableTabs[this.tabGroup.selectedIndex].code;
    this.userDetailSubscription = this.userService.getUserDetails().subscribe((userDetails) => {
      this.userDetails = userDetails;
      this.selectedTaskId = task.taskid;
      this.currentTask = task;
      this.enableDragging.next(true);
      this.updateQueryParam(task.wfid, task.eventCode);
      this.showTaskDetails = true;
      this.showOnly2Columns();
    })
  }

  /**
   * Function to close the details RHS page
   * @param close the boolean value to hide the RHS
   */
  closeDetailsModal() {
    this.showTaskDetails = false;
    this.selectedTaskId = null;
    this.enableDragging.next(false)
    this.updateQueryParam('', '');
    this.showOnly2Columns();
  }

  /**
   * This is a common function to update url
   * @param taskId<string> the task id of the selected task
   */
  updateQueryParam(wfid: string, eventCode: string) {
    if (wfid) {
      this.location.go(`/home/task-list/${this.activeTab}/${wfid}/${eventCode}`);
      return;
    }
    this.location.go(`/home/task-list`)
  }

  /**
   * This is used to display specific column
   * This will be OBSOLETE IN NEXT TASK
   */
  get getDisplayColumns() {
    this.tableColumns[this.tableColumns.length - 1].visible = true;
    const getActiveColumns = this.tableColumns.filter(columns => columns.visible);
    return getActiveColumns.map(column => column.value);
  }

  /**
   * This function manipulates the DOM to show the columns conditionally
   */
  showOnly2Columns() {
    this.tableColumns.forEach((column, index) => {
      if (this.showTaskDetails && index > 1) {
        column.visible = false;
      } else {
        column.visible = true;
      }
    })
    this.tableColumns[this.tableColumns.length - 1].visible = true;
  }

  /**
   * Sorting data and making API call
   * @param sortEvent Sort Event
   */
  sortData(sortEvent: { active: string, direction: string }) {
    const currentSortableFields = ['datestarted', 'duedate'];
    if (!currentSortableFields.includes(sortEvent.active)) {
      this.utilities.showSnackBar('This is a non sortable field')
      console.warn('non sortable field', sortEvent.active);
      return;
    }
    const checkIfExists = this.sortableHeaders.find(field => field.fieldId === sortEvent.active.toUpperCase());
    if (checkIfExists) {
      checkIfExists.order = sortEvent.direction.toUpperCase();
    } else {
      this.sortableHeaders.push({
        fieldId: sortEvent.active.toUpperCase(),
        order: sortEvent.direction.toUpperCase()
      });
    }
    this.filterForm.controls.sortField.setValue(this.sortableHeaders);
    this.getTasks();
  }

  /**
   * This is used to toggle filters component selector
   */
  closeFilters() {
    this.dynamicFiltersVisible = false;
  }

  /**
   * this function calls all the views from the service and
   * sends to column setting component
   */
  getDefaultViews() {
    this.userDetailSubscription = this.userService.getUserDetails()
      .pipe(
        distinctUntilChanged()
      ).subscribe((userDetails: Userdetails) => {
        this.userDetails = userDetails;
        this.taskListSubscription = this.taskListService.getTasklListViews(userDetails.userName).subscribe((tableViewObjects: TaskListViewObject[]) => {
          this.taskListViews.length = 0;
          tableViewObjects.forEach(view => { view.active = false });
          this.taskListViews.push(...tableViewObjects);
          // get the default view on the basis of flag
          let defaultView = this.taskListViews.find(view => view.default);
          // check if user has set any view as active
          if (this.activeViewId) {
            defaultView = this.taskListViews.find(item => item.viewId === this.activeViewId);
          }

          if (defaultView) {
            const defaultColumns = defaultView.fields.map(item => item.fieldId);
            defaultView.active = true;
            this.tableColumns.forEach((column, index) => {
              const positionOfColumnInDefaultView = defaultView.fields.find(item => item.fieldId === column.value);
              if (positionOfColumnInDefaultView) {
                moveItemInArray(this.tableColumns, index, positionOfColumnInDefaultView.order - 1);
              }
              column.visible = defaultColumns.includes(column.value) ? true : false;
            })
          }
          const settingObject = this.tableColumns.find(item => item.value === 'setting');
          this.tableColumns.splice(this.tableColumns.indexOf(settingObject), 1);
          this.tableColumns.push({ value: 'setting', order: 10 })
          if (this.showTaskDetails) {
            this.showOnly2Columns();
          }
        });
      })
  }

  /**
   * This is the main function to perform change in column view
   * @param operationObject The operation object that contains info to perform
   */
  performOperationOnViews(operationObject: { type: string, data: TaskListViewObject }) {
    operationObject.data.plantCode = this.userDetails.plantCode;
    operationObject.data.userCreated = this.userDetails.userName;
    switch (operationObject.type) {
      case 'create':
        this.taskListSubscription = this.taskListService.saveTaskListView(operationObject.data).subscribe(() => {
          this.getDefaultViews();
        })
        break;
      case 'update':
        this.taskListSubscription = this.taskListService.updateTaskListView(operationObject.data).subscribe(() => {
          this.getDefaultViews();
        });
        break;
      case 'delete':
        this.taskListSubscription = this.taskListService.deleteTaskListItem(operationObject.data.viewId).subscribe(() => {
          this.getDefaultViews();
        }); break;
    }
  }

  /**
   * This is used to set the currently active view
   * @param viewId the selected view
   */
  setActiveView(viewId: string) {
    this.activeViewId = viewId;
  }

  openDialog() {
    this.dialog.open(SaveSearchDialogComponent)
  }


  /**
   * Angular Hook
   * Called when component is closed/destroyed/refreshed
   * here all the subscription is getting unsubscribed
   */
  ngOnDestroy() {
    this.taskListSubscription.unsubscribe();
    this.userDetailSubscription.unsubscribe();
    this.filterEmitter.unsubscribe();
    this.enableDragging.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
