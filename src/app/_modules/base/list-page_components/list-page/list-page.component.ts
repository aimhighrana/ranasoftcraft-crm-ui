import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ListPageService } from '@services/list-page.service';
import { FormGroup } from '@angular/forms';
import { ListPageRow, ListDynamicPageRow, TableColumndata, ListFilters } from '@models/list-page/listpage';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { Subscription } from 'rxjs';



/**
 * @title Table with selection
 */
@Component({
  selector: 'pros-list-page',
  styleUrls: ['list-page.component.scss'],
  templateUrl: 'list-page.component.html',
})
export class ListPageComponent implements OnInit, OnDestroy {

  /**
   * construtor of @class ListPageComponent
   * @param listPageService This is the object of the service
   */
  constructor(private listPageService: ListPageService, private userService: UserService) {
    this.dslistdata = new MatTableDataSource<ListPageRow>();
  }

  lists: ListPageRow[] = [];
  dslistdata: MatTableDataSource<ListPageRow>;
  tableColumns: TableColumndata[] = [];
  tableStaticColumn;
  selection = new SelectionModel<ListPageRow>(true, []);
  dynamicFiltersVisible = false;
  savedSearches;
  filters: ListFilters;
  funcfilters: ListDynamicPageRow[] = [];
  dynamicstaticTable: Array<ListDynamicPageRow> = [];
  // dynamicstaticTable:Array<{}> = [];
  addstaticTable: any = [];
  public profileForm: FormGroup;
  dynamicList: ListDynamicPageRow[] = [];
  listpageSubscription = new Subscription();
  userDetailSubscription = new Subscription();
  listPagecolumnSubscription = new Subscription();
  filterPageSubscription = new Subscription();
  /**
   * flag to show Column setting pop-up
   */
  showColumnSettingPopUp = false;
  tableColumnstatic = [
    {
      fieldName: 'star',
      fieldText: 'star',
      visible: true,
      disabled: true,
      colWidth: 50,
      criteriaDisplay: null,
      dataType: null,
      descField: null,
      enableEditing: false,
      filterCritera: null,
      ischeckList: null,
      pickList: null,
      textAlign: 'CNTR'
    },
    {
      fieldName: 'select',
      fieldText: 'select',
      visible: true,
      disabled: true,
      colWidth: 50,
      criteriaDisplay: null,
      dataType: null,
      descField: null,
      enableEditing: false,
      filterCritera: null,
      ischeckList: null,
      pickList: null,
      textAlign: 'CNTR'
    }
  ]

  /** Select list view. */

  listview = [
    { value: 'list-1', viewValue: 'List View' },
    { value: 'list-2', viewValue: 'List-2' },
    { value: 'list-3', viewValue: 'List-3' }
  ];

  /** Select tab view. */

  listTabview = [
    { id: 'tab-1', name: 'All records' },
    { id: 'tab-2', name: 'My records' },
    { id: 'tab-3', name: 'Draft records' }
  ];

  selectedValue: string = this.listview[0].value;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  columnDefinitions = [];
  datalist;
  displaylist = [];


  ngOnInit() {
    this.dslistdata.paginator = this.paginator;
    this.dslistdata.sort = this.sort;
    this.getLists();
    this.getUserDetail();
    // this.getColumns();
    this.getSavedSearches();
    this.getFilters();
    // this.getFuncFilters();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dslistdata.data.length;
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dslistdata.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ListPageRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.MaterialID + 1}`;
  }

  /**
   * function to toggle dynamic filters
   */
  toggleDynamicFilters() {
    this.dynamicFiltersVisible = !this.dynamicFiltersVisible
  }

  /**
   * reciever from child component to close filter box
   * @param value the current value
   */
  closeFilterBox() {
    this.dynamicFiltersVisible = true;
  }

  /**
   * function to call service data
   */

  getLists() {
    this.listpageSubscription = this.listPageService.getLists()
      .subscribe(
        (response: ListPageRow[]) => {
          // this.lists.length = 0;
          this.lists = response;
          this.listpagedata(response);
        })
  }

  listpagedata(response) {
    this.dslistdata.data = response;
  }

  /**
   * function to remove rows settings pop up
   */

  removeSelectedRows() {
    const data = this.dslistdata.data;
    this.selection.selected.forEach(item => {
      const index: number = data.findIndex(d => d === item);
      this.dslistdata.data.splice(index, 1);

      this.dslistdata = new MatTableDataSource<ListPageRow>(this.dslistdata.data);
      this.dslistdata.paginator = this.paginator;
    });
    this.selection = new SelectionModel<ListPageRow>(true, []);
  }


  /**
   * function to toggle columns settings pop up
   */
  toggleColumnSettingPopUp() {
    this.showColumnSettingPopUp = !this.showColumnSettingPopUp;
  }

  /**
   * Function to get columns from the service
   */
  // getColumns() {
  //     this.listPageService.getColumns().subscribe((response) => {
  //       this.tableStaticColumn = response;
  //     })
  // }

  getUserDetail() {
    this.userDetailSubscription = this.userService.getUserDetails()
      .subscribe((userDetails: Userdetails) => {
        this.getmetacolumnlist(userDetails);
        this.getDynamicFiltermeta(userDetails);
      })
  }

  getmetacolumnlist(userDetails) {
    this.listPagecolumnSubscription = this.listPageService.getDynamiclistcolumn(userDetails)
      .subscribe((dynamicLists: ListDynamicPageRow[]) => {
        this.addstaticTable.length = 0;
        this.dynamicstaticTable.length = 0;
        this.dynamicstaticTable.push(...dynamicLists);
        this.dynamicstaticTable.forEach((item) => {
          this.addstaticTable.push({ ...item, visible: true, disabled: false });
        })
        this.getDisplayedColumns();
      })
  }

  getDisplayedColumns(): string[] {
    this.tableColumns = [];
    this.columnDefinitions = [];
    this.tableColumns.push(...this.tableColumnstatic, ...this.addstaticTable);
    this.updateColumns(this.tableColumns);
    for (const cd of this.tableColumns) {
      const lot = { cd };
      this.columnDefinitions.push(lot);
    }
    this.datalist = this.columnDefinitions;
    return this.datalist.filter(tableColumn => tableColumn.visible).map(tableColumn => tableColumn.fieldName);
  }


  /**
   * Function to get Saved Searches
   */
  getSavedSearches() {
    this.listPageService.getSavedSearches().subscribe((response) => {
      this.savedSearches = response;
    })
  }

  updateColumns(tableColumns) {
    this.tableColumns = tableColumns;
    this.displaylist = [];
    for (const list of tableColumns) {
      if (list.visible === true) {
        this.displaylist.push(list.fieldName);
      }
    }
    this.displaylist.push('setting');
  }

  /**
   * function to show or hide column and headers
   * @param columnName name of column
   */
  // columnVisible(columnName) {
  //   console.log(columnName,"column name");
  //     const selectedColumn = this.tableColumns.find((column) => column.fieldName === columnName);
  //     return selectedColumn.visible;
  // }
  getFilters() {
    this.listPageService.getFilters().subscribe(response => {
      this.filters = response;
      this.filters.textInput = '';
    })
  }

  getDynamicFiltermeta(userDetails) {
    this.filterPageSubscription = this.listPageService.getDynamicFiltermeta(userDetails)
      .subscribe((dynamicFiltermeta: ListDynamicPageRow[]) => {
        this.funcfilters.length = 0;
        this.funcfilters.push(...dynamicFiltermeta);
      })
  }


  /**
   * Angular Hook
   * Called when component is closed/destroyed/refreshed
   * here all the subscription is getting unsubscribed
   */
  ngOnDestroy() {
    this.listpageSubscription.unsubscribe();
    this.userDetailSubscription.unsubscribe();
    this.listPagecolumnSubscription.unsubscribe();
    this.filterPageSubscription.unsubscribe();
  }

  /**
   * function to recieve updated filters from child component
   * @param filters The filters object
   */
  updateFilters(filters) {
    // to be done later
    return true;
  }

}

