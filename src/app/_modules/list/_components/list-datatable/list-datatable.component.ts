import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ListPageViewDetails } from '@models/list-page/listpage';
import { SchemaListDetails } from '@models/schema/schemalist';
import { Userdetails } from '@models/userdetails';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { UserService } from '@services/user/userservice.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';

@Component({
  selector: 'pros-list-datatable',
  templateUrl: './list-datatable.component.html',
  styleUrls: ['./list-datatable.component.scss']
})
export class ListDatatableComponent implements OnInit {

  /**
   * hold current module id
   */
   moduleId = '1807970304';

   /**
    * hold current schema id
    */
   schemaId = '';

   /**
    * hold current displayed view id
    */
   currentViewId: string;

   /**
    * hold current view name
    */
   currentViewName: string;

   /**
    * Current schema info
    */
   schemaInfo: SchemaListDetails;

   /**
    * Default view to display
    */
   defaultView = {
     viewId: 'default',
     viewName: 'Default view',
     isSystemView: false,
     fieldsReqList: [
       { fieldId: 'OBJECTNUMBER' }
     ]
   } as ListPageViewDetails;

   /**
    * hold views list
    */
   viewsList: ListPageViewDetails[] = [this.defaultView];

   /**
    * for views list paging
    */
   pageIndex = 0;

   staticColumns: string[] = ['select', 'option'];

   displayedColumns: BehaviorSubject<string[]> = new BehaviorSubject(this.staticColumns);

   dataSource = new MatTableDataSource<any>();
   selection = new SelectionModel<any>(true, []);


   subscriptionsList: Subscription[] = [];

   userDetails = new Userdetails();

   metadataFldLst: MetadataModeleResponse;


   constructor(
     private activatedRouter: ActivatedRoute,
     private router: Router,
     private sharedServices: SharedServiceService,
     private schemaService: SchemaService,
     private matDialog: MatDialog,
     private schemaListService: SchemalistService,
     private userService: UserService,
     private listService: ListService,
     private schemaDetailsService: SchemaDetailsService) { }

   ngOnInit(): void {

     this.userService.getUserDetails().subscribe(userDetails => {
       this.userDetails = userDetails;
     });

     this.getViewsList();
     this.getSchemaDetails();
     this.getFldMetadata();

     /* this.activatedRouter.params.subscribe(params => {
       this.moduleId = params.moduleId;
       this.schemaId = params.schemaId;
       this.getViewsList();
       this.getSchemaDetails();
     }); */

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
    * get current schema details
    */
   getSchemaDetails() {
     const sub =  this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
        this.schemaInfo = res;
      }, error => console.error(`Error : ${error.message}`));
      this.subscriptionsList.push(sub);
   }

   /**
    * get available views list
    */
   getViewsList(loadMore?) {

     if (loadMore) {
      this.pageIndex++;
     } else {
      this.pageIndex = 0;
     }
     const sub = this.listService.getAllListPageViews(this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId, this.pageIndex, 5)
      .subscribe(views => {

       if(views && views.length) {
         if (loadMore) {
           this.viewsList = this.viewsList.concat(views) ;
         } else {
           this.viewsList = views;
           this.updateTableColumns(this.viewsList[0].viewId);
         }
       }

     }, error => {
       console.error(`Error :: ${error.message}`);
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
    const sub =  this.schemaDetailsService.getMetadataFields(this.moduleId).subscribe(response => {
      this.metadataFldLst = response;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptionsList.push(sub);
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
     const numSelected = this.selection.selected.length;
     const numRows = this.dataSource.data.length;
     return numSelected === numRows;
   }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
     this.isAllSelected() ?
         this.selection.clear() :
         this.dataSource.data.forEach(row => this.selection.select(row));
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
     const viewId = edit ? this.currentViewId : 'new';
     this.router.navigate([{ outlets: {sb: `sb/list/table-view-settings/${this.moduleId}/${viewId}`}}], {queryParamsHandling: 'preserve'});
   }

   /**
    * update displayed columns on view change
    * @param viewId selected view id
    */
   updateTableColumns(viewId: string) {

     const activeView = this.viewsList.find(v => v.viewId === viewId);
     if (activeView && activeView.fieldsReqList) {
       this.currentViewId = viewId;
       this.currentViewName = activeView.viewName;
       const activeColumns: string[] = activeView.fieldsReqList.map( field => field.fieldId);
       console.log(this.staticColumns.concat(activeColumns));
       this.displayedColumns.next(this.staticColumns.concat(activeColumns));
     }

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

}
