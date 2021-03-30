import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListPageViewDetails, ViewsPage } from '@models/list-page/listpage';
import { Userdetails } from '@models/userdetails';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { UserService } from '@services/user/userservice.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ListDataSource } from './list-data-source';
import { FieldMetaData } from '@models/core/coreModel';
import { CoreService } from '@services/core/core.service';


@Component({
  selector: 'pros-list-datatable',
  templateUrl: './list-datatable.component.html',
  styleUrls: ['./list-datatable.component.scss']
})
export class ListDatatableComponent implements OnInit, OnDestroy {

  /**
   * hold current module id
   */
  moduleId: string;

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
      { fieldId: 'APPDATE'}, // created on
      { fieldId: 'USERCREATED'}, // created by
      { fieldId: 'STATUS'}, // status

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

  userDetails = new Userdetails();

  metadataFldLst: FieldMetaData[] = [];


  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private sharedServices: SharedServiceService,
    private userService: UserService,
    private listService: ListService,
    private coreService: CoreService) {

    this.dataSource = new ListDataSource(this.listService);

  }


  ngOnInit(): void {

    this.userService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });

    this.activatedRouter.params.subscribe(params => {
      this.dataSource.reset();
      this.viewsPageIndex = 0;
      this.recordsPageIndex = 1;
      this.currentView = new ListPageViewDetails();
      this.moduleId = params.moduleId;
      this.getTotalCount();
      this.getViewsList();
      this.getFldMetadata();
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

  /**
   * get available views list
   */
  getViewsList(loadMore?) {

    if (loadMore) {
      this.viewsPageIndex++;
    } else {
      this.viewsPageIndex = 1;
    }
    const sub = this.listService.getAllListPageViews(this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId, this.viewsPageIndex)
      .subscribe(views => {

        if(views && ((views.userViews && views.userViews.length) || (views.systemViews && views.systemViews.length))) {
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
        }
      }, error => {
        console.error(`Error :: ${error.message}`);
        if(!loadMore) {
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
    const sub =  this.listService.getListPageViewDetails(viewId, this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId)
      .subscribe(response => {
          this.currentView = response;
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

    if(!viewId || viewId === 'default' ) {
      return;
    }
    const sub = this.listService.deleteListPageView(viewId, this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId)
      .subscribe(resp => {
        this.getViewsList();
      }, error => {
        console.error(`Error :: ${error.message}`);
      });

    this.subscriptionsList.push(sub);
  }

  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }
    const sub = this.coreService.getAllFieldsForView(this.moduleId).subscribe(response => {
      this.metadataFldLst = response;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

  /**
   * get total records count
   */
  getTotalCount() {
    const subs = this.listService.getDataCount(this.moduleId, []).subscribe(count => {
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
    const viewId = edit && this.currentView.viewId ?  this.currentView.viewId : 'new';
    this.router.navigate([{ outlets: { sb: `sb/list/table-view-settings/${this.moduleId}/${viewId}` } }], { queryParamsHandling: 'preserve' });
  }

  /**
   * update displayed columns on view change
   */
  updateTableColumns() {

    if (this.currentView && this.currentView.fieldsReqList) {

      this.getTableData();

      const activeColumns: string[] = this.currentView.fieldsReqList.map(field => field.fieldId);
      this.displayedColumns.next(this.staticColumns.concat(activeColumns));
    }

  }

  /**
   * get table data records
   */
  getTableData() {
    const viewId = this.currentView.viewId ?  this.currentView.viewId : '';
    this.dataSource.getData(this.moduleId, viewId, this.recordsPageIndex);
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
    return field ? field.fieldDescri || 'Unkown': fieldId || 'Unkown';
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

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(subs => subs.unsubscribe());
  }

}
