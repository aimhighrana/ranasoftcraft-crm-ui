import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskListService } from '@services/task-list.service';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { TaskListViewObject, DropEvent } from '@models/task-list/columnSetting';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'pros-columnsetting',
  templateUrl: './columnsetting.component.html',
  styleUrls: ['./columnsetting.component.scss']
})
export class ColumnsettingComponent implements OnInit {
  /**
   * this is the list of columns
   */
  @Input() tableColumns = [];

  /**
   * this is the emitter for updating columns
   */
  @Output() updateColumns = new EventEmitter();

  /**
   * this is the emitter for closing the component
   */
  @Output() close = new EventEmitter();

  /**
   * This is used to save the current active view
   */
  @Output() activeViewEmitter = new EventEmitter();

  /**
   * This is the list of the task list views
   */
  @Input() taskListViews: TaskListViewObject[] = [];

  /**
   * This is the flag to show or hide the new setting component
   */
  newSettingDivVisible = false;

  /**
   * this function stores the userDetails data
   */
  userDetails: Userdetails;

  /**
   * This is the form group for manipulating the form data
   * using form because the viewname and view details changes from time
   * to time
   */
  saveViewform: FormGroup;

  /**
   * This is the common function to perform operation on views
   */
  @Output() performOperation = new EventEmitter<{ type: string, data: TaskListViewObject }>();

  /**
   * Constructor of @class ColumnsettingComponent
   * @param _taskListService private object to get the data from the APIs
   */
  constructor(private _taskListService: TaskListService, private _userService: UserService) { }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * This function creates the form
   */
  createForm() {
    this.saveViewform = new FormGroup({
      userCreated: new FormControl(),
      viewId: new FormControl(),
      viewName: new FormControl('', [Validators.required]),
      plantCode: new FormControl(),
      default: new FormControl(),
      fields: new FormControl()
    })
  }

  /**
   * This is used to save the toggle status
   * @param column The selected column
   * @param event the toggle event
   */
  saveChange(column, event) {
    column.visible = event.checked;
  }

  /**
   * This function emits the flag to close the modal
   */
  closeSettingColumn() {
    this.close.emit(true)
  }

  /**
   * This function calls the api to
   * create a new view
   */
  addNewView() {
    const fieldOrderData = []
    this.tableColumns.forEach((column, index) => {
      if (column.visible && column.value !== 'setting') {
        const obj = {
          fieldId: column.value,
          order: index + 1
        }
        fieldOrderData.push(obj);
      }
    })
    this.saveViewform.controls.fields.setValue(fieldOrderData);
    this.emitOperation('create', this.saveViewform.value)
  }

  get allTableColumns() {
    return this.tableColumns.map((column) => { return { value: column.fieldId, visible: true } })
  }

  /**
   * This function is used to detect the drop event
   * @param event The DropEvent
   */
  drop(event: DropEvent) {
    moveItemInArray(this.tableColumns, event.previousIndex, event.currentIndex);
  }

  /**
   * This function sets a particular view as active and also toggles the sliders
   * @param taskListViewObject The view which needs to be set active
   */
  setActiveView(taskListViewObject: TaskListViewObject) {
    this.taskListViews.forEach(view => view.active = false);
    taskListViewObject.active = true;
    const activeColumns = taskListViewObject.fields.map(field => field.fieldId);
    this.tableColumns.forEach((column, index) => {
      column.visible = activeColumns.includes(column.value) ? true : false;
      const indexOfColumnInTableColumn = taskListViewObject.fields.find(item => item.fieldId === column.value);
      if (indexOfColumnInTableColumn) {
        moveItemInArray(this.tableColumns, index, indexOfColumnInTableColumn.order - 1);
      }
    });
    this.activeViewEmitter.emit(taskListViewObject.viewId);
    const settingObj = this.tableColumns.find(item => item.value === 'setting');
    this.tableColumns.splice(this.tableColumns.indexOf(settingObj), 1);
    this.tableColumns.push({
      value: 'setting',
      order: 10
    })
  }

  /**
   * this is used to show the update button conditionally
   */
  get isAnyViewActive() {
    return this.taskListViews.find(view => view.active)
  }

  /**
   * This function resets the component view
   */
  resetView() {
    this.tableColumns.forEach(column => column.visible = true);
    this.taskListViews.forEach(view => view.active = false);
  }

  deleteView(view) {
    this.emitOperation('delete', view)
  }

  setAsDefault(view: TaskListViewObject) {
    view.default = true;
    const fieldOrderData = []
    this.tableColumns.forEach((column, index) => {
      if (column.visible && column.value !== 'setting') {
        const obj = {
          fieldId: column.value,
          order: index + 1
        }
        fieldOrderData.push(obj);
      }
    })
    view.fields = fieldOrderData;
    console.log(view);
    this.emitOperation('update', view)
  }

  updateView() {
    const view = this.taskListViews.find(viewObj => viewObj.active);
    const activeColumns = this.tableColumns.filter(column => column.visible).map(column => column.value);
    const fieldOrderData = []
    this.tableColumns.forEach((column, index) => {
      column.visible = activeColumns.includes(column.value) ? true : false;
      if (column.visible && column.value !== 'setting') {
        const obj = {
          fieldId: column.value,
          order: index + 1
        }
        fieldOrderData.push(obj);
      }
    })
    view.fields = fieldOrderData;
    console.log(view)
    this.emitOperation('update', view)
  }

  emitOperation(type, data) {
    const operationObject = {
      type,
      data
    }
    this.performOperation.emit(operationObject);
  }
}
