import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Schemadetailstable, SendReqForSchemaDataTableColumnInfo, SchemaDataTableColumnInfoResponse, SchemaTableData, ResponseFieldList, SchemaDataTableResponse } from 'src/app/_models/schema/schemadetailstable';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaDatatableDialogComponent } from '../schema-datatable-dialog/schema-datatable-dialog.component';
import { Any2tsService } from 'src/app/_services/any2ts.service';
import { SchemaStatusinfoDialogComponent } from '../schema-statusinfo-dialog/schema-statusinfo-dialog.component';

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
  allDisplayedColumnsDesc: any = {};
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
  pageSizeOption: number[] = [40, 60, 100];
  pageSize = 40;
  scrollId: string;
  fieldList: ResponseFieldList[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedTabIndex: number;
  schemaStatusRecordCount: any = {};
  dataTableColumnInfo: SchemaDataTableColumnInfoResponse;
  tableData: any;
  queryData: any;
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

  constructor(private schemaDetailsService: SchemaDetailsService, private dialog: MatDialog, private any2tsService: Any2tsService) { }

  ngOnInit() {
    if (this.objectId && this.schemaId) {
      this.setTabSelectionOnLoad();
      this.getSchemaDataTableColumnInfo();
      this.getSchemaDataTableData('');
    }
  }

  manageStatusCount(index: number): boolean {
    if (index < 2) {
      return false;
    } else {
      return true;
    }
  }

  loadSchameDataByStatus(index: number) {
    if (index != null) {
      if (index === 0) {
        this.dynamicRecordCount = this.totalRecord;
        this.getSchemaDataTableData('all');
      } else if (index === 1) {
        this.dynamicRecordCount = this.errorCount;
        this.getSchemaDataTableData('');
      } else if (index === 2) {
        this.dynamicRecordCount = this.successCount;
        this.getSchemaDataTableData('success');
      }
    }
  }

  openChooseColumnDialog() {
    const dialogRef = this.dialog.open(SchemaDatatableDialogComponent, {
      width: '900px',
      data: { schemaId: this.schemaId, objectId: this.objectId, selectedFldIds: this.allDisplayedColumns, fieldLists: this.fieldList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.hasOwnProperty('data')) {
        console.log(result.data);
      }
    });
  }

  private getFieldDescription(fieldId: string): string {
    let fldDesc = '';
    this.dataTableColumnInfo.fieldList.forEach(fldLstData => {
      if (fldLstData.index === fieldId) {
        fldDesc = fldLstData.label;
      }
    });
    return fldDesc;
  }
  manageChips(index: number) {
    return (index === undefined || index < 2) ? true : false;
  }
  getHideStatusCount(status: any) {
    return '+' + (status.length - 2);
  }

  private getSchemaDataTableColumnInfo() {
    const sendData: SendReqForSchemaDataTableColumnInfo = new SendReqForSchemaDataTableColumnInfo();
    sendData.schemaId = this.schemaId;
    sendData.objectId = this.objectId;
    sendData.brIds = JSON.stringify({});
    sendData.sortFields = JSON.stringify({});
    sendData.filterFields = JSON.stringify({});
    sendData.srchRanQry = '';
    sendData.isDataInsight = false;
    sendData.isJQGrid = true;
    sendData.selectedStatus = '';

    this.schemaDetailsService.getSchemaDataTableColumnInfo(sendData)
      .subscribe((response: SchemaDataTableColumnInfoResponse) => {
        this.dataTableColumnInfo = response;
        this.allDisplayedColumns = response.fieldOrder;
        this.allDisplayedColumnsDesc = this.getAllDisplayedColumnOnLoad(response);
        this.fieldList = response.fieldList;
      }, error => {
        console.log('Error while fetching schema data table column info');
      });
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

  public getSchemaDataTableData(selectedStatus: string) {
    const sendData: SendReqForSchemaDataTableColumnInfo = new SendReqForSchemaDataTableColumnInfo();
    sendData.schemaId = this.schemaId;
    sendData.objectId = this.objectId;
    sendData.brIds = JSON.stringify({});
    sendData.sortFields = JSON.stringify({});
    sendData.filterFields = JSON.stringify({});
    sendData.srchRanQry = '';
    sendData.isDataInsight = false;
    sendData.isJQGrid = false;
    sendData.selectedStatus = (selectedStatus !== undefined && selectedStatus !== '') ? selectedStatus : '';
    this.schemaDetailsService.getSchemaTableData(sendData)
      .subscribe(
        (response: SchemaDataTableResponse) => {
          this.tableData = response;
          this.queryData = response.queryData;
          this.dataSource = new MatTableDataSource<SchemaTableData>(response.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.scrollId = response.scrollId;

        }
      );
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
}
