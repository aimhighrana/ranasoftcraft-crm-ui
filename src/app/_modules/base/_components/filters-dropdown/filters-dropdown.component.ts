import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Filter, FilterListObjectResponse, Tag, FilterRequestObject, FilterListObject } from '@models/task-list/filter';
import { TaskListFiltersService } from '@services/task-list-filters.service';
import { FormGroup, FormControl } from '@angular/forms';

import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import * as moment from 'moment';

@Component({
  selector: 'pros-filters-dropdown',
  templateUrl: './filters-dropdown.component.html',
  styleUrls: ['./filters-dropdown.component.scss'],
})
export class FiltersDropdownComponent implements OnInit, OnDestroy {

  // for recieving filters
  @Input() filters: Filter;

  // this is used to store the static filters
  filterForm: FormGroup;

  userSubscription = new Subscription();
  taskListFiltersSubscription = new Subscription();
  /**
   * this is an observable to detect changes in filter
   */
  @Input() filterObservable = new BehaviorSubject<Filter>({
    staticFilters: {
      status: '',
      priority: '',
      region: '',
      recieved_date: '',
      due_date: '',
      requested_by: '',
      requested_date: ''
    },
    dynamicFilters: [],
    tags: [],
    apiRequestStructure: []
  });

  // for emitting updated filters
  @Output() updateFilters: EventEmitter<Filter> = new EventEmitter<Filter>();

  // for closing filters
  @Output() closeFilterBox: EventEmitter<boolean> = new EventEmitter<boolean>();

  // flag for showing advanced filters
  showAdvancedFilters = false;

  // This is the list of fields, to show the LHS segmented list
  filterFieldList;

  /**
   * This is the object that stores the logged in user details
   */
  userDetails: Userdetails;

  // This is the main filtering object, this is used all over the component for multiple purposes
  filterRequestObject: FilterRequestObject = {
    fieldDesc: '',
    fieldId: '',
    objectDesc: '',
    objectId: '',
    plantCode: '',
    locale: 'en',
    clientId: 738,
    language: 'en',
    fetchCount: 0,
    searchTerm: '',
    fetchSize: 20
  };

  // This is used to store the list for checkbox dropdown
  checkboxList;

  // This is array of selected object from the checkbox
  tagsList: Tag[] = [];

  /**
   * This is main structure that manages all the content and DOM manipulations
   */
  globalStateStructure = {}

  /**
   * this is the object that is used to manage state all over the component
   */
  activeObjects = {
    objectId: '',
    fieldId: '',
    objectDesc: '',
    fieldDesc: ''
  }
  // used to popiulate the pre-selected field
  @Input() selectedFields = {
    priority: '',
    status: ''
  };

  apiRequestStructure = [];
  /**
   * constructor of @class FiltersDropdownComponent
   */
  constructor(public taskListFiltersService: TaskListFiltersService, private userService: UserService) { }

  setFilters(filters: Filter) {
    this.filters = filters;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getUserDetails();
    this.filterObservable.subscribe((filters) => {
      if (filters.staticFilters && filters.dynamicFilters) {
        this.filters = filters;
        const allModules = this.filters.dynamicFilters.filter((r) => r.objectDesc !== 'All Modules' && r.filterFields.length > 0)
        this.filterFieldList = allModules.map((r) => {
          return {
            objectType: r.objectType,
            objectDesc: r.objectDesc,
            filterFields: r.filterFields
          }
        });
        this.makeGlobalStructure();
      }
    });
  }
  /**
   * This function is used to create global structure
   */
  makeGlobalStructure() {
    this.filters.dynamicFilters.forEach((l1Object) => {
      this.globalStateStructure[l1Object.objectType] = {}
      l1Object.filterFields.forEach((l2Fields) => {
        const innerObj = {
          objectId: l2Fields.objectId,
          fieldData: {
            fieldId: l2Fields.fieldId,
            filterList: []
          }
        }
        this.apiRequestStructure.push(innerObj)

        this.globalStateStructure[l1Object.objectType][l2Fields.fieldId] = {
          nextFetchCount: 0,
          noMoreRecords: false,
          list: []
        }
      })
    });
  }


  /**
   * This function listens to the typing and calls the api
   * @param event the inputted text
   */
  searchAndFilter(event: KeyboardEvent) {
    const elementEvent = event.target as HTMLInputElement;
    if (elementEvent) {
      const value = elementEvent.value;
      if (value.length > 0) {
        this.filterRequestObject.searchTerm = value;
      } else {
        this.filterRequestObject.searchTerm = '';
        this.filterRequestObject.fetchCount = 0;
      }

      this.taskListFiltersService.getDynamicList(this.filterRequestObject).subscribe((response: FilterListObjectResponse) => {
        response.filterList.forEach((listItem) => {
          listItem.checked = false;
          listItem.objectId = this.activeObjects.objectId;
          listItem.fieldId = this.activeObjects.fieldId;
          listItem.objectDesc = this.activeObjects.objectDesc;
          listItem.fieldDesc = this.activeObjects.fieldDesc;
        });
        this.globalStateStructure[this.activeObjects.objectId][this.activeObjects.fieldId].list.length = 0;
        this.globalStateStructure[this.activeObjects.objectId][this.activeObjects.fieldId].list.push(...response.filterList);
        this.setAutoSelectedFromTaglist();
      });
    }
  }

  /**
   * This function get the details of the logged in User
   */
  getUserDetails() {
    this.userSubscription = this.userService.getUserDetails().subscribe((userDetails) => {
      this.userDetails = userDetails;
    })
  }

  /**
   * This function is used to set the values of static fields
   */
  initializeForm() {
    this.filterForm = new FormGroup({
      priority: new FormControl(this.selectedFields.priority),
      status: new FormControl(this.selectedFields.status),
      recieved_date: new FormControl(),
      requested_date: new FormControl(),
      due_date: new FormControl(),
      region: new FormControl(),
      requested_by: new FormControl()
    })
  }
  /**
   * This is common function that check which tags is set to pre-selected
   */
  setAutoSelectedFromTaglist() {
    if (this.tagsList && this.tagsList.length > 0) {
      this.tagsList.forEach((tagItem) => {
        const searchInCurrentList = this.globalStateStructure[this.activeObjects.objectId][this.activeObjects.fieldId].list.find((listItem) => listItem.CODE === tagItem.checkBoxCode)
        if (searchInCurrentList) {
          searchInCurrentList.checked = true
        }
      })
    }
  }

  /**
   * function to emit closure of filterbox
   */
  closeFilter() {
    this.closeFilterBox.emit(true);
  }

  /**
   * function to toggle advanced filters
   */
  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  /**
   * function to emit the updated filter to the parent class
   */
  updateFilter() {
    this.filters.staticFilters.priority = this.filterForm.value.priority;
    this.filters.staticFilters.status = this.filterForm.value.status;
    this.filters.staticFilters.due_date = this.createReturnDateFormat(this.filterForm.value.due_date, this.filterForm.value.due_date);
    this.filters.staticFilters.recieved_date = this.createReturnDateFormat(this.filterForm.value.recieved_date, this.filterForm.value.recieved_date)
    this.filters.staticFilters.requested_date = this.createReturnDateFormat(this.filterForm.value.requested_date, this.filterForm.value.requested_date)
    this.filters.staticFilters.requested_by = this.filterForm.value.requested_by;
    this.filters.staticFilters.region = this.filterForm.value.region;
    this.filters.tags = this.tagsList;
    this.filters.apiRequestStructure = this.apiRequestStructure;
    this.updateFilters.emit(this.filters);
  }

  createReturnDateFormat(date1: string, date2: string) {
    return date1 && date2 ? moment(date1).format('DD.MM.YYYY') + '-' + moment(date2).format('DD.MM.YYYY') : '';
  }

  /**
   * This is function that calls the service for the first time
   * when object and fieldID is clicked
   * @param item the selected field
   */
  getDynamicList(item: FilterListObject) {
    this.activeObjects.fieldId = item.fieldId;
    this.activeObjects.objectId = item.objectId;
    this.activeObjects.objectDesc = item.objectDesc;
    this.activeObjects.fieldDesc = item.fieldDesc;
    this.filterRequestObject.fieldId = item.fieldId;
    this.filterRequestObject.objectId = item.objectId;
    this.filterRequestObject.objectDesc = item.objectDesc;
    this.filterRequestObject.fieldDesc = item.fieldDesc;
    this.filterRequestObject.plantCode = this.userDetails.plantCode;
    this.filterRequestObject.fetchCount = this.globalStateStructure[item.objectId][item.fieldId].nextFetchCount;
    if (this.globalStateStructure[item.objectId][item.fieldId].list.length === 0) {
      this.callFilterFieldsAPI(item);
    }
    this.checkboxList = this.globalStateStructure[item.objectId][item.fieldId].list;
  }

  /**
   * This function is used to paginate the list
   */
  paginateDynamicList() {
    const item = this.checkboxList[0];
    this.filterRequestObject.fieldId = item.fieldId;
    this.filterRequestObject.objectId = item.objectId;
    this.filterRequestObject.objectDesc = item.objectDesc;
    this.filterRequestObject.fieldDesc = item.fieldDesc;
    this.filterRequestObject.plantCode = this.userDetails.plantCode;
    this.filterRequestObject.fetchCount = this.globalStateStructure[item.objectId][item.fieldId].nextFetchCount;
    this.callFilterFieldsAPI(item)
  }

  /**
   * This is the common function that calls the api
   * @param item This is the selected object
   */
  callFilterFieldsAPI(item: FilterListObject) {
    this.taskListFiltersService.getDynamicList(this.filterRequestObject).subscribe((checkBoxlist) => {
      checkBoxlist.filterList.map((listItem) => {
        listItem.checked = false;
        listItem.objectId = item.objectId;
        listItem.fieldId = item.fieldId;
        listItem.fieldDesc = item.fieldDesc;
        listItem.objectDesc = item.objectDesc;
      });
      if (this.globalStateStructure[item.objectId]) {
        this.globalStateStructure[item.objectId][item.fieldId].list.push(...checkBoxlist.filterList);
        this.globalStateStructure[item.objectId][item.fieldId].nextFetchCount++;
        this.setAutoSelectedFromTaglist();
      }
    });
  }

  /**
   * This function manipulates the tags
   * @param item the selected option
   * @param index this is the position of item in the array
   */
  setTags(item, index) {
    item.checked = !item.checked;
    this.globalStateStructure[item.objectId][item.fieldId].checked = !this.globalStateStructure[item.objectId][item.fieldId].checked;
    if (item.checked) {
      const tagObject = {
        objectId: this.globalStateStructure[item.objectId][item.fieldId].list[index].objectId,
        fieldId: this.globalStateStructure[item.objectId][item.fieldId].list[index].fieldId,
        objectDesc: this.globalStateStructure[item.objectId][item.fieldId].list[index].objectDesc,
        fieldDesc: this.globalStateStructure[item.objectId][item.fieldId].list[index].fieldDesc,
        checkBoxText: this.globalStateStructure[item.objectId][item.fieldId].list[index].TEXT,
        checkBoxCode: this.globalStateStructure[item.objectId][item.fieldId].list[index].CODE,
        text: `${this.globalStateStructure[item.objectId][item.fieldId].list[index].objectDesc}-${this.globalStateStructure[item.objectId][item.fieldId].list[index].fieldDesc}-${item.TEXT}`
      }
      this.tagsList.push(tagObject);
      const findExisting = this.apiRequestStructure.find((requestItem) => requestItem.objectId === item.objectId && requestItem.fieldData.fieldId === item.fieldId);
      if (findExisting) {
        if (!findExisting.fieldData.filterList.includes(item.CODE)) {
          findExisting.fieldData.filterList.push(item.CODE);
        }
      }
    } else {
      const selectedOptionIndex = this.tagsList.findIndex((listItem) => listItem.checkBoxCode === item.CODE);
      this.tagsList.splice(selectedOptionIndex, 1);
      const findExisting = this.apiRequestStructure.find((requestItem) => requestItem.objectId === item.objectId && requestItem.fieldData.fieldId === item.fieldId);
      findExisting.fieldData.filterList.splice(findExisting.fieldData.filterList.indexOf(item.CODE), 1)
    }
  }

  /**
   * This function removed the tag
   * @param item the selected tag
   */
  removeTag(item) {
    const selectedItemCodeIndex = this.tagsList.findIndex((listItem) => listItem.checkBoxCode === item.checkBoxCode);
    this.tagsList.splice(selectedItemCodeIndex, 1);
    const selectedOption = this.globalStateStructure[item.objectId][item.fieldId].list.find((listItem) => listItem.CODE === item.checkBoxCode);
    const findExisting = this.apiRequestStructure.find((requestItem) => requestItem.objectId === item.objectId && requestItem.fieldData.fieldId === item.fieldId && requestItem.fieldData.filterList.includes(item.checkBoxCode));
    if (findExisting) {
      findExisting.fieldData.filterList.splice(findExisting.fieldData.filterList.indexOf(item.checkBoxCode), 1)
    }

    if (!selectedOption) return;
    selectedOption.checked = false;
  }

  /**
   * This function is used to scroll the field list to specific module
   * @param module the selected module
   */
  scrollIntoView(module) {
    const el = document.getElementById(`filter-group-${module.objectType}`);
    if (!el) return;
    const scrollDiv = el.offsetTop;
    document.getElementById('filter-group-list').scrollTo({ top: scrollDiv, behavior: 'smooth' });
    this.filters.dynamicFilters.forEach((objects) => objects.colorActive = false);
    module.colorActive = true;
  }

  /**
   * This function resets the tags and
   * static filters
   */
  resetFilters() {
    this.tagsList = [];
    const keys = Object.keys(this.globalStateStructure);
    keys.forEach((key) => {
      const innerKeys = this.globalStateStructure[key];
      const innerObjectKeys = Object.keys(innerKeys);
      innerObjectKeys.forEach((innerObjectKey) => {
        const checked = this.globalStateStructure[key][innerObjectKey].list.filter((innerItems) => innerItems.checked = true);
        if (checked.length > 0) {
          checked.forEach((item) => item.checked = false);
        }
      })
    });
    this.filterForm.reset();
    this.filters.apiRequestStructure = [];
    Object.keys(this.filters.staticFilters).forEach((key) => this.filters.staticFilters[key] = '')
    this.updateFilters.emit(this.filters);
  }

  get today() {
    return new Date();
  }

  /**
   * Angular lifecycle hooks
   * calls when page is closed
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.taskListFiltersSubscription.unsubscribe();
  }
}