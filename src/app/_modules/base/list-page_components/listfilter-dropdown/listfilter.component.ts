import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ListFilters, Status, Superior, Planner, ListFunctionFilters, FilterListdata, FilterListRequest } from '@models/list-page/listpage';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';
import { TaskListFiltersService } from '@services/task-list-filters.service';
import { FilterListObjectResponse } from '@models/task-list/filter';

@Component({
  selector: 'pros-list-filters-dropdown',
  templateUrl: './listfilter.component.html',
  styleUrls: ['./listfilter.component.scss']
})
export class ListFiltersComponent implements OnInit, AfterViewInit, OnDestroy {
  // for recieving filters
  @Input() filters: ListFilters;
  @Input() funcfilters: ListFunctionFilters[];

  // for emitting updated filters
  @Output() updateFilters: EventEmitter<ListFilters> = new EventEmitter<ListFilters>();

  // for closing filters
  @Output() closeFilterBox: EventEmitter<boolean> = new EventEmitter<boolean>();

  // form group for filters
  showAdvancedFilters = false;
  listfilterform = new FormGroup({
    stateCtrl: new FormControl(),
    outputCtrl: new FormControl([]),
    modified_from_date: new FormControl(),
    modified_to_date: new FormControl(),
    creation_from_date: new FormControl(),
    creation_to_date: new FormControl()
  });
  searchform = new FormGroup({
    searchFilter: new FormControl()
  });
  filteredlist: Observable<any[]>;
  status: Status[];
  superiorsControl = new FormControl([]);
  superiorList: Superior[];
  plannersControl = new FormControl([]);
  plannerList: Planner[];
  listdropdown: any = [];
  tagsList: any = [];
  filterlistpageSubscription = new Subscription();


  /**
   * This is the object that stores the logged in user details
   */
  userDetails: Userdetails;

  // This is the main filtering object, this is used all over the component for multiple purposes
  filterListRequest: FilterListRequest = {
    fieldId: '',
    objectId: '1005',
    plantCode: '',
    clientId: 738,
    language: 'en',
    fetchCount: 0,
    searchTerm: '',
    fetchSize: 20
  };

  // This is used to store the list for checkbox dropdown
  checkboxList;

  /**
   * This is main structure that manages all the content and DOM manipulations
   */
  globalStateStructure = {}

  /**
   * this is the object that is used to manage state all over the component
   */
  activeObjects = {
    objectId: '1005',
    fieldId: '',
  }

  @ViewChild('input', { read: MatAutocompleteTrigger }) autoComplete: MatAutocompleteTrigger;
  funcfilterscpy: any;
  /**
   * constructor of @class FiltersDropdownComponent
   */
  constructor(public taskListFiltersService: TaskListFiltersService, private userService: UserService) { }

  ngOnInit(): void {
    // this.funcfilter(this.funcfilters);

    this.listfilter(this.filters);
    this.getUserDetails();
    this.makeGlobalStructure(this.funcfilters);
  }

  ngAfterViewInit() {
    this.searchform.controls.searchFilter.valueChanges.subscribe((txt) => {
      this.funcfilters = txt ? this.funcfilters.filter(item => item.fieldName.toLowerCase().includes(txt.toLowerCase())) : this.funcfilterscpy;
    })
    if (this.funcfilters) {
      this.funcfilterscpy = {};
      this.funcfilterscpy =  JSON.parse(JSON.stringify(this.funcfilters));
    }
  }

  /**
   * This function is used to create global structure
   */
  makeGlobalStructure(funcfilter) {
    this.funcfilters = funcfilter;
    this.funcfilters.forEach((l1Object) => {
      this.globalStateStructure[l1Object.fieldid] = {}

      this.globalStateStructure[l1Object.fieldid] = {
        nextFetchCount: 0,
        noMoreRecords: false,
        list: []
      }
    });
    console.log(this.globalStateStructure, this.funcfilters, 'global data');
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
        this.filterListRequest.searchTerm = value;
      } else {
        this.filterListRequest.searchTerm = '';
        this.filterListRequest.fetchCount = 0;
      }

      this.taskListFiltersService.getDynamicList(this.filterListRequest).subscribe((response: FilterListObjectResponse) => {
        response.filterList.forEach((listItem) => {
          listItem.checked = false;
          listItem.fieldId = this.activeObjects.fieldId;
        });
        this.globalStateStructure[this.activeObjects.fieldId].list.length = 0;
        this.globalStateStructure[this.activeObjects.fieldId].list.push(...response.filterList);
        this.setAutoSelectedFromTaglist();
      });
    }
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe((userDetails) => {
      this.userDetails = userDetails;
    })
  }

  listfilter(status) {
    this.status = status.status;
    this.superiorList = status.superior;
    this.plannerList = status.planner;
    this.listdropdown.push(...this.superiorList, ...this.plannerList);
    this.filteredlist = this.listfilterform.controls.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(statuses => statuses ? this.filterStates(statuses) : this.status.slice())
      );
  }

  getDynamicList(item: FilterListdata) {
    this.activeObjects.fieldId = item.fieldid;
    this.filterListRequest.fieldId = item.fieldid;
    this.filterListRequest.plantCode = this.userDetails.plantCode;
    this.filterListRequest.fetchCount = this.globalStateStructure[item.fieldid].nextFetchCount;
    if (this.globalStateStructure[item.fieldid].list.length === 0) {
      this.callFilterFieldsAPI(item);
    }
    this.checkboxList = this.globalStateStructure[item.fieldid].list;
  }

  /**
   * This function is used to paginate the list
   */
  paginateDynamicList() {
    const item = this.checkboxList[0];
    this.filterListRequest.fieldId = item.fieldId;
    this.filterListRequest.plantCode = this.userDetails.plantCode;
    this.filterListRequest.fetchCount = this.globalStateStructure[item.fieldId].nextFetchCount;
    this.callFilterFieldsAPI(item)
  }

  /**
   * This is the common function that calls the api
   * @param item This is the selected object
   */
  callFilterFieldsAPI(item: FilterListdata) {
    this.filterlistpageSubscription = this.taskListFiltersService.getDynamicList(this.filterListRequest).subscribe((checkBoxlist) => {
      checkBoxlist.filterList.map((listItem) => {
        listItem.checked = false;
        listItem.fieldId = item.fieldid;
      });
      if (this.globalStateStructure[item.fieldid]) {
        this.globalStateStructure[item.fieldid].list.push(...checkBoxlist.filterList);
        this.globalStateStructure[item.fieldid].nextFetchCount++;
        this.setAutoSelectedFromTaglist();
      }
    });
  }

  /**
   * This is common function that check which tags is set to pre-selected
   */
  setAutoSelectedFromTaglist() {
    if (this.tagsList && this.tagsList.length > 0) {
      this.tagsList.forEach((tagItem) => {
        const searchInCurrentList = this.globalStateStructure[this.activeObjects.fieldId].list.find((listItem) => listItem.CODE === tagItem.checkBoxCode)
        if (searchInCurrentList) {
          searchInCurrentList.checked = true
        }
      })
    }
  }


  setTags(item, index) {
    item.checked = !item.checked;
    this.globalStateStructure[item.checked] = !this.globalStateStructure[item.checked];
    if (item.checked) {
      const tagObject = {
        fieldId: this.globalStateStructure[item.fieldId].list[index].fieldId,
        checkBoxText: this.globalStateStructure[item.fieldId].list[index].TEXT,
        checkBoxCode: this.globalStateStructure[item.fieldId].list[index].CODE,
        text: `${item.TEXT}`
      }
      this.tagsList.push(tagObject);
    }
    else {
      const Selectedindex = this.tagsList.findIndex((listItem) => listItem.checkBoxCode === item.CODE);
      this.tagsList.splice(Selectedindex, 1);
    }
    console.log(item, 'checked or not');
  }

  removeTag(item) {
    const selectedItemCodeIndex = this.tagsList.findIndex((listItem) => listItem.checkBoxCode === item.checkBoxCode);
    this.tagsList.splice(selectedItemCodeIndex, 1);
    const selectedOption = this.globalStateStructure[item.fieldId].list.find((listItem) => listItem.CODE === item.checkBoxCode);
    if (!selectedOption) return;
    selectedOption.checked = false;
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

  onSuperiorPlanRemoved(supr: string) {
    const superslist = this.superiorsControl.value as string[];
    this.removeFirst(superslist, supr);
    this.superiorsControl.setValue(superslist); // To trigger change detection
  }


  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }


  /**
   * function to show the value of selected name
   */

  optionSelected(selected) {
    const outputValues: string[] = this.listfilterform.controls.outputCtrl.value;
    const index: number = outputValues.indexOf(selected.option.value);

    if (index >= 0) {
      outputValues.splice(index, 1);
    } else {
      outputValues.push(selected.option.value);
    }
    this.listfilterform.controls.stateCtrl.setValue('');
    setTimeout(() => {
      this.autoComplete.openPanel();
    });
  }

  /**
   * function to display filter search
   */

  filterStates(display: string) {
    return this.status.filter(status =>
      status.display.toLowerCase().indexOf(display.toLowerCase()) === 0);
  }

  isSelected(value) {
    return this.listfilterform.controls.outputCtrl.value.indexOf(value) >= 0;
  }

  /**
   * Angular Hook
   * Called when component is closed/destroyed/refreshed
   * here all the subscription is getting unsubscribed
   */
  ngOnDestroy() {
    this.filterlistpageSubscription.unsubscribe();
  }

  /**
   * function to emit the updated filter to the parent class
   */
  updateFilter() {
    this.updateFilters.emit(this.filters);
  }


}
