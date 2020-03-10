import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SchemaTableData, ResponseFieldList, RequestForSchemaDetailsWithBr, SchemaTableViewRequest, MetadataModeleResponse, Heirarchy } from 'src/app/_models/schema/schemadetailstable';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataTableReqType } from 'src/app/_models/schema/schemadetailstable';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaStatusinfoDialogComponent } from 'src/app/_modules/schema/_components/schema-details/schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SchemaDataSource } from './schema-data-source';
import { TableColumnSettingsComponent } from 'src/app/_modules/shared/_components/table-column-settings/table-column-settings.component';

@Component({
  selector: 'pros-schema-datatable',
  templateUrl: './schema-datatable.component.html',
  styleUrls: ['./schema-datatable.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaDatatableComponent implements OnInit {

  tabs = ['All', 'Error', 'Success', 'Skipped', 'Corrections', 'Duplicate'];
  matMenu: any[] = ['Show Details', 'Delete', 'Edit'];
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
  startColumns = ['row_more_action', 'row_selection_check2box', 'OBJECTNUMBER'];
  endColumns = ['row_status'];
  allMetaDataFields: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject(new MetadataModeleResponse());
  displayedFields: BehaviorSubject<string[]> = new BehaviorSubject(this.startColumns); // all selected fields across header, selected hierarchy, selected grids
  unselectedFields: string[] = []; // all unselected fields across header, hierarchy, grids
  selectedGridIds: string[] = []; // currently selected grid ids
  selectedHierarchyIds: string[] = []; // currently selected hierarchy ids

  public chooseColumnCtrl: FormControl = new FormControl();
  public chooseColumnFilterCtrl: FormControl = new FormControl();

  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private dialog: MatDialog,
    private schemaListService: SchemalistService

  ) {

  }
  ngOnInit() {
    this.schemaDetails = new SchemaListDetails();
    this.paginator = new MatPaginator(new MatPaginatorIntl(), null);
    this.getMetadataFields();
    this.getSchemaDetails(this.schemaId);
    this.dataTableDataSource = new SchemaDataSource(this.schemaDetailsService);
    this.dataTableRequest(0, 40, DataTableReqType.error);

    this.allMetaDataFields.subscribe((allMDF) => {
      this.calculateDisplayFields();
    });
    this.schemaDetailsService.getAllUnselectedFields(this.schemaId , this.variantId).subscribe(data =>{
      // this.unselectedFields = data ? data : [];
    },error=>{
      console.error(`Error while getting unselected fields : ${error}`);
    })
  }

  calculateDisplayFields(): void {
    const allMDF = this.allMetaDataFields.getValue();
    const fields = [];
    this.startColumns.forEach(col => fields.push(col));
    for (const headerField in allMDF.headers) {
      if (fields.indexOf(headerField) < 0 && this.unselectedFields.indexOf(headerField) < 0) {
        fields.push(headerField);
      }
    }

    for (const hierarchyIdx in allMDF.hierarchy) {
      if (this.selectedHierarchyIds.indexOf(allMDF.hierarchy[hierarchyIdx].heirarchyId) >= 0) {
        for (const hierarchyChildField in allMDF.hierarchyFields[allMDF.hierarchy[hierarchyIdx].heirarchyId]) {
          if (fields.indexOf(allMDF.hierarchy[hierarchyIdx].heirarchyId + '+' + hierarchyChildField) < 0 && this.unselectedFields.indexOf(allMDF.hierarchy[hierarchyIdx].heirarchyId + '+' + hierarchyChildField) < 0) {
            fields.push(allMDF.hierarchy[hierarchyIdx].heirarchyId + '+' + hierarchyChildField);
          }
        }
      }
    }

    for (const gridField in allMDF.grids) {
      if (this.selectedGridIds.indexOf(gridField) >= 0) {
        for (const gridChildField in allMDF.gridFields[gridField]) {
          if (fields.indexOf(gridField + '+' + gridChildField) < 0 && this.unselectedFields.indexOf(gridField + '+' + gridChildField) < 0) {
            fields.push(gridField + '+' + gridChildField);
          }
        }
      }
    }

    this.endColumns.forEach(col => fields.push(col));

    this.displayedFields.next(fields);
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

  public openTableColumnSettings() {
    const dialogRef = this.dialog.open(TableColumnSettingsComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public openStatusInfoDialog() {
    this.dialog.open(SchemaStatusinfoDialogComponent, {
      width: '900px'
    });
  }

  private getSchemaDetails(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(data => {
      this.schemaDetails = data;
    }, error => {
      console.error('Error while getting schema details');
    });
  }

  public dataTableRequest(fetchCount: number, fetchSize: number, requestType: string) {
    const sendRequest: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    sendRequest.schemaId = this.schemaId;
    sendRequest.variantId = this.variantId;
    sendRequest.requestStatus = requestType ? requestType : DataTableReqType.error;
    sendRequest.fetchCount = fetchCount ? fetchCount : 0;
    sendRequest.fetchSize = fetchSize ? fetchSize : 40;
    sendRequest.gridId = this.selectedGridIds ? this.selectedGridIds : [];
    sendRequest.hierarchy = this.selectedHierarchyIds ? this.selectedHierarchyIds : [];
    this.dataTableDataSource.getTableData(sendRequest);
  }

  loadSchameDataByStatus(index: number) {
    // 0, 40 for initial load on each status
    this.selectedTabIndex = index;
    this.dynamicPageSize = this.matChipCountLabel(this.selectedTabIndex);
    this.dataTableRequest(0, 40, this.tabs[index]);
  }

  public chooseColumns(event) {
    // const selectedArray = event.value;
    // console.log(this.getSelectedFields());
    // this.getSchemaTableDetailsForError(this.schemaDetails);
    // this.selectedFields = selectedArray;
    // if (selectedArray) {
      this.persistenceTableView();
    // }
  }

  private persistenceTableView() {
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = this.schemaDetails.schemaId;
    schemaTableViewRequest.variantId = this.schemaDetails.variantId;
    schemaTableViewRequest.unassignedFields = this.unselectedFields;

    this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {
      console.log('Updated view {} is success.', response);
    }, error => {
      console.error('Error while update schema table view');
    });
  }

  private getMetadataFields() {
    this.schemaDetailsService.getMetadataFields(this.objectId).subscribe(response => {
      this.allMetaDataFields.next(response);
    }, error => {
      console.error(`Error while getting headers field and unassigned fields ${error}`);
    });
  }


  public doPagination(pageEvent: PageEvent) {
    this.dataTableRequest(pageEvent.pageIndex, pageEvent.pageSize, this.tabs[this.selectedTabIndex]);
  }


  public dataTableTrackByFun(index, object) {
    return object.key;
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

  public applyGridField(gridId: string, add: boolean) {
    this.selectedHierarchyIds = [];
    this.selectedGridIds = [];
    if(add) {
      this.selectedGridIds.push(gridId);
    }
    this.calculateDisplayFields();
    this.dataTableRequest(0, 40, this.tabs[this.selectedTabIndex]);
  }

  public applyHeirarchyField(hId: string, add: boolean) {
    this.selectedGridIds = [];
    this.selectedHierarchyIds = [];
    if(add) {
      this.selectedHierarchyIds.push(hId);
    }
    this.calculateDisplayFields();
    this.dataTableRequest(0, 40, this.tabs[this.selectedTabIndex]);
  }

  hierarchyTrackBy(hierarchy: Heirarchy): string {
    return hierarchy.heirarchyId;
  }

  gridTrackBy(grid: any): string {
    return grid;
  }

}
