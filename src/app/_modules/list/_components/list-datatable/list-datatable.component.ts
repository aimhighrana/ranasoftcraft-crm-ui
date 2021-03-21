import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListPageViewDetails } from '@models/list-page/listpage';
import { Userdetails } from '@models/userdetails';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserService } from '@services/user/userservice.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { PageEvent } from '@angular/material/paginator';
import { ListDataSource } from './list-data-source';


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
   * Default view to display
   */
  defaultView = {
    viewId: 'default',
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
  viewsList: ListPageViewDetails[] = [];

  /**
   * for views list paging
   */
  viewsPageIndex = 0;

  /**
   * Hold total records count
   */
  totalCount = 0;

  /**
   * for table records paging
   */
  recordsPageIndex = 0;

  staticColumns: string[] = ['_select', '_settings', 'OBJECTNUMBER'];

  displayedColumns: BehaviorSubject<string[]> = new BehaviorSubject(this.staticColumns);

  dataSource: ListDataSource;

  selection = new SelectionModel<any>(true, []);

  subscriptionsList: Subscription[] = [];

  userDetails = new Userdetails();

  metadataFldLst: MetadataModeleResponse;


  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private sharedServices: SharedServiceService,
    private userService: UserService,
    private listService: ListService,
    private schemaDetailsService: SchemaDetailsService) {

    this.dataSource = new ListDataSource(this.listService);

  }


  ngOnInit(): void {

    this.userService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });

    this.activatedRouter.params.subscribe(params => {
      this.dataSource.reset();
      this.viewsPageIndex = 0;
      this.recordsPageIndex = 0;
      this.currentView = new ListPageViewDetails();
      this.moduleId = params.moduleId;
      this.getTotalCount();
      this.getViewsList();
      this.getFldMetadata();
    });

    this.sharedServices.getViewDetailsData().subscribe(view => {
      if (view && view.viewId) {
        const index = this.viewsList.findIndex(v => v.viewId === view.viewId);
        if (index !== -1) {
          this.viewsList[index] = view;
        } else {
          this.viewsList.push(view);
        }

        this.updateTableColumns(view.viewId);
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
      this.viewsPageIndex = 0;
    }
    const sub = this.listService.getAllListPageViews(this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId, this.viewsPageIndex, 5)
      .subscribe(views => {

        if (views && views.length) {
          if (loadMore) {
            this.viewsList = this.viewsList.concat(views);
          } else {
            this.viewsList = views;
            this.updateTableColumns(this.viewsList[0].viewId);
          }
        } else if (!loadMore) {
            this.viewsList = [this.defaultView];
            this.updateTableColumns(this.viewsList[0].viewId);
        }

      }, error => {
        console.error(`Error :: ${error.message}`);
        if(!loadMore) {
          this.viewsList = [this.defaultView];
          this.updateTableColumns(this.viewsList[0].viewId);
        }
      });

    this.subscriptionsList.push(sub);
  }

  /**
   * delete a view
   * @param viewId to delete
   */
  deleteView(viewId: string) {
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
    const sub = this.schemaDetailsService.getMetadataFields(this.moduleId).subscribe(response => {
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
    const viewId = edit && this.currentView.viewId &&  this.currentView.viewId !== 'default' && !this.currentView.viewId.includes('view') ?  this.currentView.viewId : 'new';
    this.router.navigate([{ outlets: { sb: `sb/list/table-view-settings/${this.moduleId}/${viewId}` } }], { queryParamsHandling: 'preserve' });
  }

  /**
   * update displayed columns on view change
   * @param viewId selected view id
   */
  updateTableColumns(selectedViewId: string) {
    const activeView = this.viewsList.find(v => v.viewId === selectedViewId);
    if (activeView && activeView.fieldsReqList) {

      this.currentView = activeView;
      this.getTableData();

      const activeColumns: string[] = activeView.fieldsReqList.map(field => field.fieldId);
      this.displayedColumns.next(this.staticColumns.concat(activeColumns));
    }

  }

  /**
   * get table data records
   */
  getTableData() {
    const viewId = this.currentView.viewId &&  this.currentView.viewId !== 'default' && !this.currentView.viewId.includes('view') ?  this.currentView.viewId : '';
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
    return this.viewsList.filter(view => view.isSystemView);
  }

  /**
   * get user views list
   */
  get userViews() {
    return this.viewsList.filter(view => !view.isSystemView);
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
