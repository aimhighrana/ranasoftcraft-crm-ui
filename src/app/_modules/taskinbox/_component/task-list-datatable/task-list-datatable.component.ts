import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskListService } from './../../../../_services/task-list.service';
import { take, takeUntil } from 'rxjs/operators';
import { SharedServiceService } from './../../../shared/_services/shared-service.service';
import { ViewsPage } from '@models/list-page/listpage';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

export interface PeriodicElement {
  Records: string;
  setting: number;
  description: number;
  labels: string;
  sent: string;
  dueby: string;
  requestby: string;
  sentby: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    setting: 1,
    Records: 'Hydrogen',
    description: 1.0079,
    labels: 'H',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 2,
    Records: 'Helium',
    description: 4.0026,
    labels: 'He',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 3,
    Records: 'Lithium',
    description: 6.941,
    labels: 'Li',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 4,
    Records: 'Beryllium',
    description: 9.0122,
    labels: 'Be',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 5,
    Records: 'Boron',
    description: 10.811,
    labels: 'B',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 6,
    Records: 'Carbon',
    description: 12.0107,
    labels: 'C',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 7,
    Records: 'Nitrogen',
    description: 14.0067,
    labels: 'N',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 8,
    Records: 'Oxygen',
    description: 15.9994,
    labels: 'O',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 9,
    Records: 'Fluorine',
    description: 18.9984,
    labels: 'F',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 10,
    Records: 'Neon',
    description: 20.1797,
    labels: 'Ne',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
];

export const NODEFIELDS: { [node: string]: { fldId: string; fldDesc: string }[] } = {
  inbox: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
  in_workflow: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
  rejected: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
  draft: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
  ],
  completed: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
};
export interface INodeChips {
  fldId: string;
  value: any[];
  icon?: string;
  type?: string;
  hasMenu: boolean;
  startvalue?: any;
  endvalue?: any;
  operator?: string;
  parentnode?: string;
}
export interface IFilterSettings {
  fldId: string;
  value: any[];
  startvalue: any;
  endvalue: any;
  operator: string;
  parentnode?: string;
}
export const nodeChips: {
  [node: string]: INodeChips[];
} = {
  inbox: [
    {
      fldId: 'Bookmarked',
      value: [2],
      icon: 'star',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Important',
      value: [4],
      icon: 'long-arrow-up',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Due',
      value: [4],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Unread',
      value: [3],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Label',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Sent',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Requestedby',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
  ],
  in_workflow: [
    {
      fldId: 'Bookmarked',
      value: [2],
      icon: 'star',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Important',
      value: [4],
      icon: 'long-arrow-up',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Unread',
      value: [3],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Label',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Sent',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Requestedby',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
  ],
  rejected: [
    {
      fldId: 'Bookmarked',
      value: [2],
      icon: 'star',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Important',
      value: [4],
      icon: 'long-arrow-up',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Due',
      value: [4],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Unread',
      value: [3],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Sent',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Requestedby',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
  ],
  draft: [
    {
      fldId: 'Bookmarked',
      value: [2],
      icon: 'star',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Important',
      value: [4],
      icon: 'long-arrow-up',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Due',
      value: [4],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Unread',
      value: [3],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Label',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Sent',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
  ],
  completed: [
    {
      fldId: 'Bookmarked',
      value: [2],
      icon: 'star',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Important',
      value: [4],
      icon: 'long-arrow-up',
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Due',
      value: [4],
      hasMenu: false,
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Label',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Sent',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
    {
      fldId: 'Requestedby',
      value: [],
      hasMenu: true,
      type: 'info',
      startvalue: '',
      endvalue: '',
      operator: 'equal',
      parentnode: '',
    },
  ],
};

export const nodeChipsMenuItems: { [fldId: string]: string[] } = {
  Label: ['H', 'He'],
  Sent: ['Long', 'Short'],
  Requestedby: ['Fred', 'Shred'],
};

@Component({
  selector: 'pros-task-list-datatable',
  templateUrl: './task-list-datatable.component.html',
  styleUrls: ['./task-list-datatable.component.scss'],
})
export class TaskListDatatableComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    // 'select',
    // 'setting',
    // 'Records',
    // 'description',
    // 'labels',
    // 'sent',
    // 'dueby',
    // 'requestby',
    // 'sentby',
  ];
  staticColumns: string[] = ['select', 'setting', 'Records'];
  dataSource: MatTableDataSource<PeriodicElement>;
  selection: SelectionModel<PeriodicElement>;
  node: string = null;
  nodeColumns: { fldId: string; fldDesc: string }[] = [];

  currentNodeFilterChips: INodeChips[] = [];
  filteredNodeChipsMenuItems = Object.assign({}, nodeChipsMenuItems);
  currentFilterSettings: IFilterSettings[] = [];

  savedSearchParameters: string = null;
  inlineFilters: string = null;
  pageEvent: { pageIndex: number; pageSize: number; length: number } = {
    pageIndex: 0,
    pageSize: 10,
    length: 0, // totalCount
  };
  isLoadingResults = false;

  viewsList: ViewsPage = new ViewsPage();
  unsubscribeAll$: Subject<boolean> = new Subject<boolean>();

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private sharedServices: SharedServiceService, private taskListService: TaskListService, private matSnackBar: MatSnackBar) {}

  /**route param contains the node
   * node - based on node find the columns the table should have
   * node - based on node find the filter chips the page should have
   * queryParam contains the s and f. f is the filter the current table has now
   * only when the page is first time loaded we check if the url has filter setting in URL. thats why checking currentFilterSettings is less than or equal 0
   * atob the f and expect that contains filterSettings. then updateNodeChips is called to update the current page filter chips status
   * shared service gettaskinboxViewDetailsData contains if any user configuration of the table exist. if exist update table columns with that configuration,
   */
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.node = param.node || null;
      this.nodeColumns = NODEFIELDS[this.node];
      this.updateTableColumns();
      this.updateNodeChips();
      this.saveTasklistVisitByUser(this.node);
    });

    this.route.queryParams.pipe(take(1)).subscribe((queryParam) => {
      this.savedSearchParameters = queryParam.s || null;
      this.inlineFilters = queryParam.f || null;
      if (this.currentFilterSettings.length <= 0 && queryParam.f) {
        const decoded = atob(queryParam.f);
        if (decoded) {
          const settings = JSON.parse(decoded) || [];
          this.updateNodeChips(settings);
          this.currentFilterSettings = JSON.parse(decoded) || [];
        }
      }
    });

    this.sharedServices
      .gettaskinboxViewDetailsData()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((resp) => {
        if (resp && resp.node === this.node) {
          this.nodeColumns = resp.viewDetails;
          this.updateTableColumns();
        } else {
          this.updateTableColumns();
        }
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      // this.paginator.pageIndex = 0;
      this.pageEvent.pageIndex = 0;
    });
  }

  /**update table columns based on node and if user configuration exist
   * 3 fixed column at start 'select', 'setting', 'Records'
   */
  updateTableColumns() {
    this.displayedColumns = this.nodeColumns.map((d) => d.fldId);
    this.displayedColumns.unshift('select', 'setting', 'Records');
    this.getTableData();
  }

  /**filter chips are based on node
   * if browser URL contains f queryParam part, then the method will call with filterFromQueryParam parameter
   * has to update currentNodeFilterChips with the value of filterFromQueryParam
   */
  updateNodeChips(filterFromQueryParam?: IFilterSettings[]) {
    this.currentNodeFilterChips = nodeChips[this.node].slice();
    if (filterFromQueryParam) {
      this.currentNodeFilterChips = this.currentNodeFilterChips.map((d) => {
        const index = filterFromQueryParam.findIndex((p) => p.fldId === d.fldId);
        if (index >= 0) {
          d.value = filterFromQueryParam[index].value; // has some glitch
        }
        return d;
      });
    }
  }

  /**calls from the template on chips click with chip and new value (item)
   * if currentFilterSettings contains any existing settings for the chip we have update that (match with fldId)
   * for existing setting check if the value(item) exist. If exist remove otherwise push the value(item)
   * update currentFilterSettings array with the filterSettingObj at the index
   * also update currentNodeFilterChips array with the latest value(item) of chip(parameter)
   * call updateQueryParameter to add the currentFilterSettings to the f queryParam
   */
  setChipValue(chip: INodeChips, item: any) {
    const index = this.currentFilterSettings.findIndex((d) => d.fldId === chip.fldId);
    if (index >= 0) {
      const filterSettingObj: IFilterSettings = Object.assign({}, this.currentFilterSettings[index]);
      const valueIndex = filterSettingObj.value.findIndex((d) => d === item);
      if (valueIndex >= 0) {
        filterSettingObj.value.splice(valueIndex, 1);
      } else {
        filterSettingObj.value.push(item);
      }
      if (filterSettingObj.value.length <= 0) {
        this.currentFilterSettings.splice(index, 1);
      } else {
        this.currentFilterSettings[index] = filterSettingObj;
      }
    } else {
      const filterSettingObj: IFilterSettings = {
        fldId: chip.fldId,
        value: [item],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      };
      this.currentFilterSettings.push(filterSettingObj);
    }

    this.currentNodeFilterChips = this.currentNodeFilterChips.map((d) => {
      if (d.fldId === chip.fldId) {
        const idx = d.value.indexOf(item);
        if (idx >= 0) {
          d.value.splice(idx, 1);
        } else {
          d.value.push(item);
        }
      }
      return d;
    });
    this.updateQueryParameter();
  }

  /**currentFilterSettings will be stringified and endcoded and added to the f queryParam.
   *
   */
  updateQueryParameter() {
    const encoded = this.currentFilterSettings.length ? btoa(JSON.stringify(this.currentFilterSettings)) : '';
    this.router.navigate([`/home/task/${this.node}/feed`], { queryParams: { f: encoded }, queryParamsHandling: 'merge' });
  }

  /**load chip menu dynamically based on chip and search string (event) from nodeChipsMenuItems
   *
   */
  filterModulesMenu(event, chip) {
    const items: string[] = nodeChipsMenuItems[chip] || [];
    const filtered = items.filter((d) => d.toLowerCase().includes(event.toLowerCase()));
    this.filteredNodeChipsMenuItems[chip] = filtered;
  }
  getTableData() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.selection = new SelectionModel<PeriodicElement>(true, []);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.docLength();
    // return numSelected === numRows;
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected() ? this.selection.clear() : this.dataSource.docValue().forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
  }

  onPageChange(event: PageEvent) {
    this.pageEvent.pageIndex = event.pageIndex;
    // this.getTableData();
  }
  isStaticCol(dynCol) {
    return this.staticColumns.includes(dynCol);
  }
  getFieldDesc(dynCol) {
    const field = this.nodeColumns.find((f) => f.fldId === dynCol);
    return field ? field.fldDesc || 'Unkown' : dynCol || 'Unkown';
  }

  saveTasklistVisitByUser(nodeId: string) {
    if(nodeId) {
      this.taskListService.saveTasklistVisitByUser(nodeId).pipe(take(1)).subscribe(resp => {

      }, err => {
        console.log(err);
      });
    }
  }
  /**open auxilary routing to configure settings of table columns
   *
   */
  openTableViewSettings() {
    this.router.navigate([{ outlets: { sb: `sb/task/view/${this.node}` } }], { queryParamsHandling: 'preserve' });
  }
  openFilterSettingsPanel() {
    this.router.navigate([{ outlets: { sb: `sb/task/filter/${this.node}` } }], { queryParamsHandling: 'preserve' });
  }
  ngOnDestroy() {
    this.unsubscribeAll$.next(true);
    this.unsubscribeAll$.unsubscribe();
  }
}
