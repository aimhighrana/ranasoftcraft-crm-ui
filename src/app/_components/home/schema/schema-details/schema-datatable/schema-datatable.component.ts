import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Schemadetailstable, SchemaDataTableColumnInfoResponse, SchemaTableData, ResponseFieldList, RequestForSchemaDetailsWithBr, DataTableSourceResponse, SchemaTableViewRequest } from 'src/app/_models/schema/schemadetailstable';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaStatusinfoDialogComponent } from '../schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';

@Component({
  selector: 'pros-schema-datatable',
  templateUrl: './schema-datatable.component.html',
  styleUrls: ['./schema-datatable.component.scss']
})
export class SchemaDatatableComponent implements OnInit {


  tabs = ['All', 'Error', 'Success', 'Skipped', 'Draft', 'Outdated', 'Duplicate'];
  matMenu: any[] = ['Show Details', 'Delete', 'Edit'];
  schemaDetailsTable: Schemadetailstable;
  dataSource: MatTableDataSource<SchemaTableData>;
  displayedColumns: string[];
  allDisplayedColumns: string[] = [];
  allDisplayedColumnsObservable: Observable<string[]>;
  allDisplayedColumnsWithAction: string[] = [];
  allDisplayedColumnsDesc: any = {} as any;
  selection = new SelectionModel<SchemaTableData>(true, []);
  @Input()
  objectId: string;
  @Input()
  schemaId: string;
  @Input()
  totalRecord: number;
  @Input()
  successCount: number;
  @Input()
  errorCount: number;
  @Input()
  dynamicRecordCount: number;


  schemaDetails: SchemaListDetails;
  dataTableDataSource: MatTableDataSource<DataTableSourceResponse>;

  pageSizeOption: number[] = [40, 60, 100];
  pageSize = 40;
  scrollId: string;
  fieldList: ResponseFieldList[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedTabIndex: number;
  schemaStatusRecordCount: any = {};

  /**
   * control for choose columns   *
   */
  public chooseColumnCtrl: FormControl = new FormControl();
  public chooseColumnFilterCtrl: FormControl = new FormControl();
  private onDestroy = new Subject<void>();
  allColumnsListOnLoad: string[] = [];

  private setTabSelectionOnLoad() {
    this.selectedTabIndex = this.tabs.indexOf('Error');
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.totalRecord;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: SchemaTableData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.fieldId + 1}`;
  }

  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private dialog: MatDialog,
    private schemaListService: SchemalistService

  ) {
    this.schemaDetails = new SchemaListDetails();
    this.allDisplayedColumnsObservable = of([]);
  }

  ngOnInit() {
    if (this.objectId && this.schemaId) {
      this.getSchemaDetails(this.schemaId);
      this.setTabSelectionOnLoad();
      // this.getSchemaDataTableColumnInfo();
      // this.getSchemaDataTableData('');

    }

    this.chooseColumnFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe((newVal) => {
        if (newVal && newVal !== '') {
          this.allDisplayedColumnsObservable = of(this.allDisplayedColumns.filter(data => data.toLocaleLowerCase().indexOf(newVal.toLocaleLowerCase()) === 0));
        } else {
          this.allDisplayedColumnsObservable = of(this.allDisplayedColumns);
        }
      });
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


  private getAllDisplayedColumnOnLoad(resData: SchemaDataTableColumnInfoResponse): any {
    const dispColumnLabel: any = {};
    resData.fieldOrder.forEach(element => {
      resData.fieldList.forEach(fldEle => {
        if (element === fldEle.index) {
          dispColumnLabel[element] = fldEle.label;
        }
      });

    });
    return dispColumnLabel;
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

  private getSchemaTableDetailsForError(schemaDetails: SchemaListDetails) {
    const sendRequest: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    sendRequest.schemaId = schemaDetails.schemaId;
    sendRequest.runId = schemaDetails.runId;
    sendRequest.brId = schemaDetails.brInformation[schemaDetails.brInformation.length - 1] ? schemaDetails.brInformation[schemaDetails.brInformation.length - 1].brId : '';
    sendRequest.variantId = schemaDetails.variantId;
    sendRequest.requestStatus = 'error';
    this.schemaDetailsService.getSchemaTableDetailsByBrId(sendRequest).subscribe(resposne => {
      this.dataTableDataSource = new MatTableDataSource<DataTableSourceResponse>(resposne.data);
      this.dataTableDataSource.paginator = this.paginator;
      this.dataTableDataSource.sort = this.sort;
      this.allDisplayedColumns = this.allDisplayedColumnsFun(resposne.data[0]);
      this.allDisplayedColumnsDesc = this.allDisplayedColumnsDescFun(resposne.data[0]);
    }, error => {
      console.error('Error while fetching schema table details');
    });
  }

  private getSchemaTableDetailsForSuccess(schemaDetails: SchemaListDetails) {
    const sendRequest: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    sendRequest.schemaId = schemaDetails.schemaId;
    sendRequest.runId = schemaDetails.runId;
    sendRequest.brId = schemaDetails.brInformation[schemaDetails.brInformation.length - 1] ? schemaDetails.brInformation[schemaDetails.brInformation.length - 1].brId : '';
    sendRequest.variantId = schemaDetails.variantId;
    sendRequest.requestStatus = 'success';
    this.schemaDetailsService.getSchemaTableDetailsByBrId(sendRequest).subscribe(resposne => {
      this.dataTableDataSource = new MatTableDataSource<DataTableSourceResponse>(resposne.data);
      this.dataTableDataSource.paginator = this.paginator;
      this.dataTableDataSource.sort = this.sort;
      this.allDisplayedColumns = this.allDisplayedColumnsFun(resposne.data[0]);
      this.allDisplayedColumnsDesc = this.allDisplayedColumnsDescFun(resposne.data[0]);
    }, error => {
      console.error('Error while fetching schema table details');
    });
  }

  private getSchemaTableDetailsForAll(schemaDetails: SchemaListDetails) {
    const sendRequest: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    sendRequest.schemaId = schemaDetails.schemaId;
    sendRequest.runId = schemaDetails.runId;
    sendRequest.brId = schemaDetails.brInformation[schemaDetails.brInformation.length - 1] ? schemaDetails.brInformation[schemaDetails.brInformation.length - 1].brId : '';
    sendRequest.variantId = schemaDetails.variantId;
    sendRequest.requestStatus = 'all';
    sendRequest.executionStartDate = String(schemaDetails.executionStartTime);
    this.schemaDetailsService.getSchemaTableDetailsByBrId(sendRequest).subscribe(resposne => {
      this.dataTableDataSource = new MatTableDataSource<DataTableSourceResponse>(resposne.data);
      this.dataTableDataSource.paginator = this.paginator;
      this.dataTableDataSource.sort = this.sort;
      this.allDisplayedColumns = this.allDisplayedColumnsFun(resposne.data[0]);
      this.allDisplayedColumnsDesc = this.allDisplayedColumnsDescFun(resposne.data[0]);
    }, error => {
      console.error('Error while fetching schema table details');
    });
  }

  private getSchemaDetails(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(data => {
      this.schemaDetails = data;
      console.table(data);
      this.getSchemaTableDetailsForError(data);
    });
  }

  private allDisplayedColumnsFun(data: any): string[] {
    const allDisColumns: string[] = [];
    if (data) {
      Object.keys(data).forEach(key => {
        allDisColumns.push(key);
      });
    }
    this.chooseColumnCtrl.setValue(allDisColumns);
    this.allDisplayedColumnsObservable = of(allDisColumns);
    this.allColumnsListOnLoad = allDisColumns;
    allDisColumns.splice(0, 0, 'row_action');
    allDisColumns.splice(1, 0, 'row_selection_check2box');
    return allDisColumns;
  }
  private allDisplayedColumnsDescFun(data: any): any {
    const returnData: any = {} as any;
    if (data) {
      Object.keys(data).forEach(key => {
        returnData[key] = data[key].fieldDesc;
      });
    }
    return returnData;
  }

  loadSchameDataByStatus(index: number) {
    if (index != null) {
      if (index === 0) {
        this.getSchemaTableDetailsForAll(this.schemaDetails);
      } else if (index === 1) {
        this.getSchemaTableDetailsForError(this.schemaDetails);
      } else if (index === 2) {
        this.getSchemaTableDetailsForSuccess(this.schemaDetails);
      }
    }
  }

  public chooseColumns(event) {
    const selectedArray = event.value;
    if (selectedArray) {
      this.allDisplayedColumns = selectedArray;
      this.allDisplayedColumns.splice(0, 0, 'row_action');
      this.allDisplayedColumns.splice(1, 0, 'row_selection_check2box');
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
    this.allColumnsListOnLoad.forEach(fldId => {
        if (this.allDisplayedColumns.indexOf(fldId) === -1) {
         unassignedFields.push(fldId);
        }
    });
    return unassignedFields;
  }

}
