import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SchemaTableData, ResponseFieldList, RequestForSchemaDetailsWithBr, SchemaTableViewRequest, MetadataModeleResponse } from 'src/app/_models/schema/schemadetailstable';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MetadataModel, DataTableReqType } from 'src/app/_models/schema/schemadetailstable';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaStatusinfoDialogComponent } from 'src/app/_modules/schema/_components/schema-details/schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { FormControl } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';
import { SchemaDataSource } from './schema-data-source';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'pros-schema-datatable',
  templateUrl: './schema-datatable.component.html',
  styleUrls: ['./schema-datatable.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaDatatableComponent implements OnInit {


  tabs = ['All', 'Error', 'Success', 'Skipped', 'Corrections', 'Duplicate'];
  matMenu: any[] = ['Show Details', 'Delete', 'Edit'];
  allDisplayedColumns: string[] = [];
  allDisplayedColumnsObservable: Observable<Map<string,MetadataModel>>;
  selectedFields: string[];
  allDisplayedColumnsDesc: any = {} as any;
  selection = new SelectionModel<SchemaTableData>(true, []);
  @Input()
  objectId: string;
  @Input()
  schemaId: string;
  @Input()
  variantId: string;
  @Input()
  totalRecord: number;
  @Input()
  successCount: number;
  @Input()
  errorCount: number;
  @Input()
  dynamicRecordCount: number;


  schemaDetails: SchemaListDetails;
  dataTableDataSource: SchemaDataSource;

  pageSizeOption: number[] = [40, 60, 100];
  pageSize = 40;
  scrollId: string;
  fieldList: ResponseFieldList[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedTabIndex = 1; // Defaut error status should be visible
  dynamicPageSize: number;
  allMetaDataFields: MetadataModeleResponse;
  selectedGridId: string;
  selectedHeiField: string;

  public chooseColumnCtrl: FormControl = new FormControl();
  public chooseColumnFilterCtrl: FormControl = new FormControl();
  private onDestroy = new Subject<void>();


  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private dialog: MatDialog,
    private schemaListService: SchemalistService

  ) {
    this.schemaDetails = new SchemaListDetails();
    // this.allDisplayedColumnsObservable = of([]);
    this.paginator = new MatPaginator(new MatPaginatorIntl(), null);
    this.allMetaDataFields = {grids:null, gridFields: null,headers: null,hierarchy: null,hierarchyFields: null};
    this.selectedFields = [];
  }

  ngOnInit() {
    if (this.objectId && this.schemaId) {
      this.getMetadataFields();
      this.getSchemaDetails(this.schemaId);
      this.dataTableDataSource = new SchemaDataSource(this.schemaDetailsService);
      this.dataTableRequest(0, 40, DataTableReqType.error, null, null);
    }

    // this.chooseColumnFilterCtrl.valueChanges
    //   .pipe(takeUntil(this.onDestroy))
    //   .subscribe((newVal) => {
    //     // if (newVal && newVal !== '') {
    //     //   this.allDisplayedColumnsObservable = of(this.chooseColumnFields.filter(data => data.fieldDescri.toLocaleLowerCase().indexOf(newVal.toLocaleLowerCase()) === 0));
    //     // } else {
    //     //   this.allDisplayedColumnsObservable = of(this.chooseColumnFields);
    //     // }
    //   }).unsubscribe();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.totalRecord;
    return numSelected === numRows;
  }
  masterToggle() {
    // this.isAllSelected() ?
    //   this.selection.clear() :
    //   this.dataTableDataSource.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: SchemaTableData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.fieldId + 1}`;
  }
  isGroup(index, item): boolean {
    return item.isGroup;
  }

  manageStatusCount(index: number): boolean {
    if (index < 2) {
      return false;
    } else {
      return true;
    }
  }

  manageChips(index: number) {
    return (index === undefined || index < 2) ? true : false;
  }
  getHideStatusCount(status: any) {
    return '+' + (status.length - 2);
  }


  public openStatusInfoDialog() {
    const dialogRef = this.dialog.open(SchemaStatusinfoDialogComponent, {
      width: '900px',
      data: { schemaId: this.schemaId, objectId: this.objectId, selectedFldIds: this.allDisplayedColumns, fieldLists: this.fieldList }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  private getSchemaDetails(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(data => {
      this.schemaDetails = data;

    });
  }

  public dataTableRequest(fetchCount: number, fetchSize: number, requestType: string, selectedGridId: string, selectedHeiId: string) {
    const sendRequest: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    sendRequest.schemaId = this.schemaId;
    sendRequest.variantId = this.variantId;
    sendRequest.requestStatus = requestType ? requestType : DataTableReqType.error;
    sendRequest.fetchCount = fetchCount ? fetchCount : 0;
    sendRequest.fetchSize = fetchSize ? fetchSize : 40;
    sendRequest.gridId = selectedGridId;
    sendRequest.hierarchy = selectedHeiId;
    this.dataTableDataSource.getTableData(sendRequest);
  }

  loadSchameDataByStatus(index: number) {
    // 0, 40 for initial load on each status
    this.selectedTabIndex = index;
    this.dynamicPageSize = this.matChipCountLabel(this.selectedTabIndex);
    this.dataTableRequest(0, 40, this.tabs[index], this.selectedGridId, this.selectedHeiField);
  }

  public chooseColumns(event) {
    const selectedArray = event.value;
    // console.log(this.getSelectedFields());
    // this.getSchemaTableDetailsForError(this.schemaDetails);
    this.selectedFields = selectedArray;
    if (selectedArray) {
      //  this.allDisplayedColumns = selectedArray.map(fld => fld.fieldId);
      //  this.allDisplayedColumns.splice(0, 0, 'row_more_action');
      //  this.allDisplayedColumns.splice(1, 0, 'row_selection_check2box');
      //  this.allDisplayedColumns.splice(2, 0, 'OBJECTNUMBER');
      this.selectedFields.splice(0, 0, 'row_more_action');
      this.selectedFields.splice(1, 0, 'row_selection_check2box');
      this.selectedFields.splice(2, 0, 'OBJECTNUMBER');
      // this.changeDetectonRef.detectChanges();
      this.updateTableView();
    }
  }

  private updateTableView() {
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = this.schemaDetails.schemaId;
    schemaTableViewRequest.variantId = this.schemaDetails.variantId;
    schemaTableViewRequest.unassignedFields = this.getAllUnassignedFields();

    this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {
      console.log('Updated view {} is success.', response);
    }, error => {
      console.error('Error while update schema table view');
    });
  }

  private getAllUnassignedFields(): string[] {
    const unassignedFields: string[] = [];
    const selectedFields: string[] = this.chooseColumnCtrl.value.map(fld => fld.fieldId);
    this.allMetaDataFields.headers.forEach(fld => {
      if (selectedFields.indexOf(fld.fieldId) === -1) {
        unassignedFields.push(fld.fieldId);
      }
    });
    return unassignedFields;
  }

  private getMetadataFields() {
    this.schemaDetailsService.getMetadataFields(this.objectId).subscribe(response => {
      this.allMetaDataFields = response;
      this.allDisplayedColumnsObservable = of(response.headers);
      this.selectedFields = [];
      if(response.headers) {
        this.selectedFields = Object.keys(response.headers);
      }
      this.chooseColumnCtrl.setValue(this.selectedFields);
      // this.allDisplayedColumns = response.headers.map(fld => fld.fieldId);

      //  // add static column to table
      //  this.allDisplayedColumns.splice(0, 0, 'row_more_action');
      //  this.allDisplayedColumns.splice(1, 0, 'row_selection_check2box');
      //  this.allDisplayedColumns.splice(2, 0, 'OBJECTNUMBER');
      // //  this.allDisplayedColumns.splice(0,0,'OBJECTNUMBER');
      // //  response.headers.forEach(element => {
      // //    this.allDisplayedColumnsDesc[element.fieldId] = element.fieldDescri;
      // //  });
      //  this.allDisplayedColumnsDesc.OBJECTNUMBER = 'Object Number';
      this.selectedFields.splice(0, 0, 'row_more_action');
      this.selectedFields.splice(1, 0, 'row_selection_check2box');
      this.selectedFields.splice(2, 0, 'OBJECTNUMBER');
    }, error => {
      console.error(`Error while getting headers field and unassigned fields ${error}`);
    });
  }


  public doPagination(pageEvent: PageEvent) {
    this.dataTableRequest(pageEvent.pageIndex, pageEvent.pageSize, this.tabs[this.selectedTabIndex], null, null);
  }


  public dataTableTrackByFun(index, object) {
    if (object) {
      return object.fieldId;
    } else {
      return null;
    }
  }

  public matChipCountLabel(tabIndex: number) {
    const label = this.tabs[tabIndex].toLocaleLowerCase();
    let dynCount = 0;
    switch (label) {
      case 'error':
        dynCount = this.schemaDetails.errorCount ? this.schemaDetails.errorCount : 0;
        break;
      case 'success':
        dynCount = this.schemaDetails.successCount ? this.schemaDetails.successCount : 0;
        break;
      case 'all':
        dynCount = this.schemaDetails.totalCount ? this.schemaDetails.totalCount : 0;
        break;

      case 'skipped':
        dynCount = this.schemaDetails.skippedValue ? this.schemaDetails.skippedValue : 0;
        break;
      case 'corrections':
        dynCount = this.schemaDetails.correctionValue ? this.schemaDetails.correctionValue : 0;
        break;

      case 'duplicate':
        dynCount = this.schemaDetails.duplicateValue ? this.schemaDetails.duplicateValue : 0;
        break;

      default:
        dynCount = 0;
        break;
    }
    return dynCount;
  }

  public applyGridField(event: MatButtonToggleChange) {
    const selectedGridId = event.value;
    if (selectedGridId) {
        this.selectedGridId = selectedGridId;
        this.selectedHeiField = '';
        // const gridFld = this.allMetaDataFields.gridFields.get(selectedGridId);


          // this.chooseColumnCtrl.setValue(this.chooseColumnCtrl.value.concat(keys));
          // this.selectedFields =  ['ADD_ZZELU'];//this.chooseColumnCtrl.value;
          // this.allDisplayedColumnsObservable = of(this.allMetaDataFields.headers.concat(gridFld));
          // this.allDisplayedColumns = (this.allMetaDataFields.headers.concat(gridFld)).map(fld => fld.fieldId);
          // this.allDisplayedColumns.splice(0, 0, 'row_more_action');
          // this.allDisplayedColumns.splice(1, 0, 'row_selection_check2box');
          // this.allDisplayedColumns.splice(2, 0, 'OBJECTNUMBER');
          // this.dataTableRequest(0, 40, this.tabs[this.selectedTabIndex], selectedGridId, null);
    }
  }

  public applyHeirarchyField(event: MatButtonToggleChange) {
    const selectedHeiId = event.value;
    if (selectedHeiId) {
      this.selectedGridId = '';
      this.selectedHeiField = selectedHeiId;
      const heiFld = this.allMetaDataFields.hierarchyFields.get(selectedHeiId);

        const selectedFld = []; // this.chooseColumnCtrl.value;
        heiFld.forEach(fld => {
            selectedFld.push(fld);
            this.allDisplayedColumnsDesc[fld.fieldId] = fld.fieldDescri;
          });
          // this.chooseColumnCtrl.setValue(this.allMetaDataFields.headers.concat(heiFld));
          // this.selectedFields = this.chooseColumnCtrl.value;
          // this.allDisplayedColumnsObservable = of(this.allMetaDataFields.headers.concat(heiFld));
          // this.allDisplayedColumns = (this.allMetaDataFields.headers.concat(heiFld)).map(fld => fld.fieldId);
          this.allDisplayedColumns.splice(0, 0, 'row_more_action');
          this.allDisplayedColumns.splice(1, 0, 'row_selection_check2box');
          this.allDisplayedColumns.splice(2, 0, 'OBJECTNUMBER');
          this.dataTableRequest(0, 40, this.tabs[this.selectedTabIndex], selectedHeiId, null);
    }
    console.log(selectedHeiId);
  }

  chooseColumnTrackBy(index, object) {
    if(object) {
      return object.fieldId;
    } else{
      return null;
    }
  }


}
