import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListPageFilters, ListPageViewDetails, SortDirection, ViewsPage } from '@models/list-page/listpage';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { BehaviorSubject, concat, of, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ListDataSource } from './list-data-source';
import { FieldMetaData, ObjectType } from '@models/core/coreModel';
import { CoreService } from '@services/core/core.service';
import { sortBy } from 'lodash';
import { GlobaldialogService } from '@services/globaldialog.service';
import { ResizableColumnDirective } from '@modules/shared/_directives/resizable-column.directive';
import { MatSort } from '@angular/material/sort';
import { catchError, map, skip } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FilterSaveModalComponent } from '../filter-save-modal/filter-save-modal.component';


@Component({
  selector: 'pros-list-datatable',
  templateUrl: './list-datatable.component.html',
  styleUrls: ['./list-datatable.component.scss']
})
export class ListDatatableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(ResizableColumnDirective, { read: ElementRef }) columnsList: QueryList<ElementRef>;

  @ViewChild(MatSort) sort: MatSort;

  /**
   * hold current module id
   */
  moduleId: string;

  /**
   * Hold current module details
   */
  objectType: ObjectType;

  /**
   * hold current view
   */
  currentView: ListPageViewDetails = new ListPageViewDetails();

  /**
   * Default view to display if there is no configured view
   */
  defaultView = {
    viewName: 'Default view',
    isSystemView: false,
    fieldsReqList: [
      { fieldId: 'APPDATE' }, // created on
      { fieldId: 'USERCREATED' }, // created by
      { fieldId: 'STATUS' }, // status

    ]
  } as ListPageViewDetails;

  /**
   * hold views list
   */
  viewsList: ViewsPage = new ViewsPage();

  /**
   * for views list paging
   */
  viewsPageIndex = 0;

  /**
   * default datatable page size
   */
  recordsPageSize = 50;

  /**
   * Hold total records count
   */
  totalCount = 0;

  /**
   * Flag for show hide global filter sections
   */
  showGlobalFilter = false;

  /**
   * for table records paging
   */
  recordsPageIndex = 1;

  staticColumns: string[] = ['_select', '_settings', 'OBJECTNUMBER'];

  displayedColumns: BehaviorSubject<string[]> = new BehaviorSubject(this.staticColumns);

  dataSource: ListDataSource;

  selection = new SelectionModel<any>(true, []);

  subscriptionsList: Subscription[] = [];

  metadataFldLst: FieldMetaData[] = [];


  filtersList: ListPageFilters = new ListPageFilters();

  isPageRefresh = true;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private sharedServices: SharedServiceService,
    private listService: ListService,
    private coreService: CoreService,
    private glocalDialogService: GlobaldialogService,
    private matDialog: MatDialog) {

    this.dataSource = new ListDataSource(this.listService);

  }


  ngOnInit(): void {

    this.activatedRouter.params.subscribe(params => {
      this.dataSource.reset();
      this.viewsPageIndex = 0;
      this.recordsPageIndex = 1;
      this.totalCount = 0;
      this.viewsList = new ViewsPage();
      this.currentView = new ListPageViewDetails();
      this.moduleId = params.moduleId;
      this.getTotalCount();
      this.getViewsList();
      this.getObjectTypeDetails();
    });

    this.activatedRouter.queryParams.pipe(
      map(params => {
        if (params.f) {
          try {
            const filters = JSON.parse(atob(params.f));
            return filters;
          } catch (err) {
            console.error(err);
            return new ListPageFilters();
          }
        } else {
          return new ListPageFilters();
        }
      })
    )
      .subscribe(filters => {
        this.filtersList = filters;
        console.log(this.filtersList);
        if (!this.isPageRefresh) {

          this.getTotalCount();
          this.getTableData();
        }
        this.isPageRefresh = false;
      });

    this.sharedServices.getViewDetailsData().subscribe(resp => {
      if (resp && resp.isUpdate) {
        this.currentView = resp.viewDetails;
        this.updateTableColumns();
      } else {
        this.getViewsList();
      }
    })

  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(res => {
      const col = this.currentView.fieldsReqList.find(c => c.fieldId === res.active);
      if (col) {
        col.sortDirection = SortDirection[res.direction] || null;
        // update default column sort direction
        const sub = this.listService.upsertListPageViewDetails(this.currentView, this.moduleId).subscribe(resp => {
          this.recordsPageIndex = 1;
          this.getTableData();
        });
        this.subscriptionsList.push(sub);
      }

    });

  }

  /**
   * get available views list
   */
  getViewsList(loadMore?) {

    if (loadMore) {
      this.viewsPageIndex++;
    } else {
      this.viewsPageIndex = 0;
    }
    const sub = this.listService.getAllListPageViews(this.moduleId, this.viewsPageIndex)
      .subscribe(views => {

        if (views && ((views.userViews && views.userViews.length) || (views.systemViews && views.systemViews.length))) {
          if (loadMore) {
            this.viewsList.userViews = this.viewsList.userViews.concat(views.userViews || []);
            this.viewsList.systemViews = this.viewsList.systemViews.concat(views.systemViews || []);
          } else {
            this.viewsList = views;
            const defaultViewId = this.getDefaultViewId();
            this.getViewDetails(defaultViewId);
          }
        } else if (!loadMore) {
          this.currentView = this.defaultView;
          this.updateTableColumns();
        } else {
          this.viewsPageIndex--;
        }
      }, error => {
        console.error(`Error :: ${error.message}`);
        if (!loadMore) {
          this.currentView = this.defaultView;
          this.updateTableColumns();
        }
      });

    this.subscriptionsList.push(sub);
  }

  /**
   * get view details by id
   */
  getViewDetails(viewId) {
    const view = this.userViews.concat(this.systemViews).find(v => v.viewId === viewId);
    const defaultViewObs = view && !view.default ?
       this.listService.updateDefaultView(this.moduleId, viewId).pipe(catchError(err => of(viewId))) : of(viewId);
    const sub = concat(
      defaultViewObs,
      this.listService.getListPageViewDetails(viewId, this.moduleId)
     ).pipe(skip(1))
      .subscribe(response => {
        this.currentView = response;
        this.currentView.fieldsReqList = sortBy(this.currentView.fieldsReqList, 'fieldOrder');
        this.updateTableColumns();
      }, error => {
        console.error(`Error : ${error.message}`);
      });
    this.subscriptionsList.push(sub);
  }

  /**
   * delete a view
   * @param viewId to delete
   */
  deleteView(viewId: string) {

    if (!viewId || viewId === 'default') {
      return;
    }

    this.glocalDialogService.confirm({ label: 'Are you sure to delete ?' }, (resp) => {
      if (resp && resp === 'yes') {
        const sub = this.listService.deleteListPageView(viewId, this.moduleId)
          .subscribe(response => {
            this.getViewsList();
          }, error => {
            console.error(`Error :: ${error.message}`);
          });

        this.subscriptionsList.push(sub);
      }
    });

  }

  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata(fieldsList: string[]) {
    if (!fieldsList || !fieldsList.length) {
      this.metadataFldLst = [];
      return;
    }
    const sub = this.coreService.getMetadataByFields(fieldsList).subscribe(response => {
      this.metadataFldLst = response;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * get current module details
   */
  getObjectTypeDetails() {
    const sub = this.coreService.getObjectTypeDetails(this.moduleId).subscribe(response => {
      this.objectType = response;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * get total records count
   */
  getTotalCount() {
    const subs = this.listService.getDataCount(this.moduleId, this.filtersList.filterCriteria).subscribe(count => {
      this.totalCount = count;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(subs);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.docLength();
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.docValue().forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

  }

  /**
   * open view config sidesheet
   */
  openTableViewSettings(edit?: boolean) {
    const viewId = edit && this.currentView.viewId ? this.currentView.viewId : 'new';
    this.router.navigate([{ outlets: { sb: `sb/list/table-view-settings/${this.moduleId}/${viewId}` } }], { queryParamsHandling: 'preserve' });
  }

  /**
   * update displayed columns on view change
   */
  updateTableColumns() {

    if (this.currentView && this.currentView.fieldsReqList) {

      const fieldsList = this.currentView.fieldsReqList.map(field => field.fieldId);
      this.getFldMetadata(fieldsList);
      this.getTableData();

      const activeColumns: string[] = this.currentView.fieldsReqList.map(field => field.fieldId);
      this.displayedColumns.next(this.staticColumns.concat(activeColumns));
    }

  }

  /**
   * get table data records
   */
  getTableData() {
    const viewId = this.currentView.viewId ? this.currentView.viewId : '';
    this.dataSource.getData(this.moduleId, viewId, this.recordsPageIndex, this.filtersList.filterCriteria);
  }

  /**
   * get page records
   */
  onPageChange(event: PageEvent) {
    this.recordsPageIndex = event.pageIndex;
    this.getTableData();
  }


  /**
   * get system views list
   */
  get systemViews() {
    return this.viewsList.systemViews || [];
  }

  /**
   * get user views list
   */
  get userViews() {
    return this.viewsList.userViews || [];
  }

  /**
   * get user's default view id
   */
  getDefaultViewId(): string {
    const view = this.userViews.concat(this.systemViews).find(v => v.default);
    return view ? view.viewId : this.userViews.concat(this.systemViews)[0].viewId;
  }

  /**
   * get field description based on field id
   * @param fieldId field id
   * @returns field description
   */
  getFieldDesc(fieldId: string): string {
    const field = this.metadataFldLst.find(f => f.fieldId === fieldId);
    return field ? field.fieldDescri || 'Unkown' : fieldId || 'Unkown';
  }

  /**
   * check if a column is static
   * @param colId column id
   */
  isStaticCol(colId: string) {
    return this.staticColumns.includes(colId);
  }

  rowHasWarning(row): boolean {
    return row.purchase && row.purchase < 300 ? true : false;
  }

  /**
   * Check if the row has error based on the data
   * @param row pass the row object for analysis
   * @returns boolean
   */
  rowHasError(row): boolean {
    return row.purchase && row.purchase > 800 ? true : false;
  }

  isLargeHeader(fieldId: string) {
    return this.getFieldDesc(fieldId) && this.getFieldDesc(fieldId).length > 50;
  }

  isLargeCell(row: any, fieldId: string) {
    return row[fieldId] && row[fieldId].fieldData && row[fieldId].fieldData > 50;
  }

  get displayedRecordsRange(): string {
    const endRecord = this.recordsPageIndex * this.recordsPageSize < this.totalCount ? this.recordsPageIndex * this.recordsPageSize : this.totalCount;
    return this.totalCount ? `${((this.recordsPageIndex - 1) * this.recordsPageSize) + 1} to ${endRecord} of ${this.totalCount}` : '';
  }

  /**
   * update view columns width
   * @param event new column width
   */
  onColumnsResize(event) {
    const column = this.currentView.fieldsReqList.find(c => c.fieldId === event.columnId);
    if (column) {
      column.width = event.width;

      const sub = this.listService.upsertListPageViewDetails(this.currentView, this.moduleId).subscribe(resp => {
        console.log(resp);
      });
      this.subscriptionsList.push(sub);
    }
  }

  getColumnWidth(fieldId) {
    const col = this.currentView.fieldsReqList.find(c => c.fieldId === fieldId);
    return col ? +col.width || 100 : 100;
  }

  /**
   * table width based on displayed columns width
   */
  get tableWidth() {

    let width = this.staticColumns.length * 100;
    this.currentView.fieldsReqList.forEach(col => {
      width += +col.width || 100;
    });

    return width;
  }

  /**
   * get initial sort direction for a column
   * @param fieldId column
   * @returns column sort direction
   */
  getColumnSortDir(fieldId) {
    const col = this.currentView.fieldsReqList.find(c => c.fieldId === fieldId);
    return col && col.sortDirection ? Object.keys(SortDirection).find(key => SortDirection[key] === col.sortDirection) : '';
  }

  /**
   * open filter settings sidesheet
   */
  openFiltersSideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/list/filter-settings/${this.moduleId}` } }], { queryParamsHandling: 'preserve' });
  }

  /**
   * upsert filters
   */
  saveFilterCriterias() {

    const dialogCloseRef = this.matDialog.open(FilterSaveModalComponent, {
      data: { filterName: this.filtersList.description },
      width: '400px'
    });
    dialogCloseRef.afterClosed().subscribe(res => {
      if (res) {
        this.filtersList.moduleId = this.moduleId;
        this.filtersList.description = res;
        const sub = this.listService.upsertListFilters(this.filtersList).subscribe(resp => {
          if (resp && resp.filterId) {
            this.filtersList.filterId = resp.filterId;
            this.router.navigate([], { queryParams: { f: btoa(JSON.stringify(this.filtersList)) } });
          }
        }, error => {
          console.error(`Error : ${error.message}`);
        });
        this.subscriptionsList.push(sub);
      }
    });

  }

  resetAllFilters() {
    this.router.navigate([], { queryParams: {} });
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(subs => subs.unsubscribe());
  }

}
