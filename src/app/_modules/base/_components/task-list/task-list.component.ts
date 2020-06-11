import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { TaskListRow } from '@models/task-list/taskListRow';
import { Filter, DynamicFilter } from '@models/task-list/filter';
import { Pagination } from '@models/task-list/pagination';
import { TaskListService } from '@services/task-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'pros-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource();
  displayedColumns = [
    'task_id',
    'description',
    'requestor',
    'recieved_on',
    'due_date',
    'module',
    'priority',
    'tags'];

  @ViewChild(MatSort) sort: MatSort;

  /**
   * list of tasks from service
   */
  tasks: TaskListRow[] = [];

  /**
   * flag to show dynamic filters
   */
  dynamicFiltersVisible = false;

  taskListSubscription = new Subscription();
  userDetailSubscription = new Subscription();

  /**
   * Filters object from the api
   */
  filters: Filter = {
    staticFilters: {
      status: '',
      priority: '',
      region: '',
      recieved_on: new Date(),
      due_date: new Date(),
      requested_by: ''
    },
    dynamicFilters: [],
    tags: []
  }

  @Output() filterEmitter = new BehaviorSubject({});

  /**
   * list of columns from the service
   */
  tableColumns;

  /**
   * Pagination object
   */
  pagination: Pagination = {
    length: 100,
    per_page: 100,
    page_number: 1
  }

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

  enableDragging = new Subject();

  @ViewChild('rhs', { static: false }) rhs: ElementRef;

  userDetails: Userdetails;

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

  activeTab: string;
  /**
   * construtor of @class TaskListComponent
   * @param taskListService This is the object of the service
   */
  constructor(private taskListService: TaskListService, private _router: Router,
    private _activeRouter: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.getTasks();
    this.getColumns();
    this.getSavedSearches();
    this.filters.staticFilters = this.taskListService.getStaticFilters();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  /**
   * This function listens to changes in the URL and
   * shows the summary page.
   */
  checkForSummaryTaskId() {
    this._activeRouter.params.subscribe((urlParams) => {
      if (urlParams && urlParams.summaryId) {
        this.selectedTaskId = urlParams.summaryId;
        this.showTaskDetails = true;
        if (this.tableColumns) {
          this.hidefirst2Columns(false);
        }
      }
    })
  }
  /**
   * function to get task list from the service
   */
  getTasks() {
    this.taskListSubscription = this.taskListService.getTasks(this.filters, this.pagination).subscribe((response: TaskListRow[]) => {
      this.tasks.length = 0;
      this.tasks = response;
      this.dataSource.data.length = 0;
      this.dataSource.data.push(...this.tasks)
    })
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
          this.taskListService.getDynamicFilters(userDetails)
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
   * Function to get columns from the service
   */
  getColumns() {
    this.taskListService.getColumns().subscribe((response) => {
      this.tableColumns = response;
      this.checkForSummaryTaskId();
    })
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
  updateFilters(filters) {
    console.log(filters)
    // to be done later
    return true;
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
   * function to update table column
   * @param tableColumns updated table column from the column setting component
   */
  updateColumns(tableColumns) {
    console.log(tableColumns);
    this.tableColumns = tableColumns;
  }

  /**
   * function to show or hide column and headers
   * @param columnName name of column
   */
  columnVisible() {
    // const selectedColumn = this.tableColumns.find((column) => column.value === columnName);
    // return selectedColumn.visible;
    return true;
  }

  /**
   * Function to get Saved Searches
   */
  getSavedSearches() {
    this.taskListService.getSavedSearches().subscribe((response) => {
      this.savedSearches = response;
    })
  }

  /**
   * Function to set the value of selected task to
   * send to the details page
   * @param taskId the id of the selected task
   */
  getTaskDetails(taskId: string) {
    this.selectedTaskId = taskId;
    this.updateQueryParam(taskId);
    this.enableDragging.next(true);
    this.showTaskDetails = true;
    this.hidefirst2Columns(false);
  }

  /**
   * Common Function to set the visiblity of column(s)
   * @param show to show oor hide first 2 columns
   * when show the details page
   */
  hidefirst2Columns(show: boolean) {
    this.tableColumns.forEach((column, index) => {
      if (index > 1) {
        column.visible = show;
      }
    })
  }

  /**
   * Function to close the details RHS page
   * @param close the boolean value to hide the RHS
   */
  closeDetailsModal() {
    this.showTaskDetails = false;
    this.hidefirst2Columns(true);
    this.enableDragging.next(false)
    this.updateQueryParam('');
  }

  /**
   * This is a common function to update url
   * @param taskId<string> the task id of the selected task
   */
  updateQueryParam(taskId: string) {
    const paramsURL = taskId ? taskId : '/home/task-list';
    this._router.navigate([paramsURL], { relativeTo: this._activeRouter });
  }

  closeFilters() {
    this.dynamicFiltersVisible = false;
  }

  get getDisplayColumns() {
    // return [this.displayedColumns[0],this.displayedColumns[1]];
    return this.displayedColumns;
  }

  tabChanged(event: MatTabChangeEvent) {
    console.log(event);
    this.activeTab = this.availableTabs[event.index].code
    console.log(this.activeTab);
  }

  /**
   * Event hooks
   * calls on close of component
   */
  ngOnDestroy() {
    this.taskListSubscription.unsubscribe();
    this.userDetailSubscription.unsubscribe();
  }
}
