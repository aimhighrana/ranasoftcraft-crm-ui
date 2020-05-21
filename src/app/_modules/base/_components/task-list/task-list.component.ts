import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskListRow } from '@models/task-list/taskListRow';
import { Filters } from '@models/task-list/filters';
import { Pagination } from '@models/task-list/pagination';
import { TaskListService } from '@services/task-list.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pros-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  /**
   * list of tasks from service
   */
  tasks: TaskListRow[] = [];

  /**
   * flag to show dynamic filters
   */
  dynamicFiltersVisible = false;

  /**
   * Filters object from the api
   */
  filters: Filters;

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

  enableDragging = new BehaviorSubject(false);
  @ViewChild('rhs', { static: false }) rhs: ElementRef;

  /**
   * construtor of @class TaskListComponent
   * @param taskListService This is the object of the service
   */
  constructor(private taskListService: TaskListService, private _router: Router,
    private _activeRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTasks();
    this.getFilters();
    this.getColumns();
    this.getSavedSearches();
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
    this.taskListService.getTasks(this.filters, this.pagination).subscribe((response: TaskListRow[]) => {
      this.tasks.length = 0;
      this.tasks = response;
    })
  }

  /**
   * function to get filters from the service
   */
  getFilters() {
    this.taskListService.getFilters().subscribe((response: Filters) => {
      this.filters = response;
      this.filters.textInput = '';
    })
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
    this.dynamicFiltersVisible = !this.dynamicFiltersVisible
  }

  /**
   * function to recieve updated filters from child component
   * @param filters The filters object
   */
  updateFilters(filters) {
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
    this.tableColumns = tableColumns;
  }

  /**
   * function to show or hide column and headers
   * @param columnName name of column
   */
  columnVisible(columnName) {
    const selectedColumn = this.tableColumns.find((column) => column.value === columnName);
    return selectedColumn.visible;
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
  closeDetailsModal(close: boolean) {
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
}
