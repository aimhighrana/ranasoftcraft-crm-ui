import { Component, OnInit, ViewChild, Input, NgZone } from '@angular/core';
import { SchemaTableData, ResponseFieldList, RequestForSchemaDetailsWithBr, SchemaTableViewRequest, MetadataModeleResponse, Heirarchy, SchemaBrInfo, FieldExitsResponse, SchemaCorrectionReq } from 'src/app/_models/schema/schemadetailstable';
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
import { Any2tsService } from 'src/app/_services/any2ts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/_modules/shared/_services/shared-service.service';

@Component({
  selector: 'pros-schema-datatable',
  templateUrl: './schema-datatable.component.html',
  styleUrls: ['./schema-datatable.component.scss']
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

  selectedFields: string[] = []; // all selected fields across header, hierarchy, grids
  selectedGridIds: string[] = []; // currently selected grid ids
  selectedHierarchyIds: string[] = []; // currently selected hierarchy ids
  schemaBrInfoList: SchemaBrInfo[] = [];
  metaDataFieldList = {} as any;

  public chooseColumnCtrl: FormControl = new FormControl();
  public chooseColumnFilterCtrl: FormControl = new FormControl();

  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private dialog: MatDialog,
    private schemaListService: SchemalistService,
    private any2TsService: Any2tsService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private sharedServices: SharedServiceService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.sharedServices.getChooseColumnData().subscribe(result=> {
;      if(result){
        this.selectedFields = result.selectedFields ? result.selectedFields : [];
        this.calculateDisplayFields();
      }
    })
    this.schemaDetails = new SchemaListDetails();
    this.paginator = new MatPaginator(new MatPaginatorIntl(), null);
    this.getMetadataFields();
    this.getSchemaBrInfoList();
    this.getSchemaDetails(this.schemaId);
    this.dataTableDataSource = new SchemaDataSource(this.schemaDetailsService, this.any2TsService);
    this.dataTableRequest(0, 40, DataTableReqType.error);

    this.allMetaDataFields.subscribe((allMDF) => {
      this.calculateDisplayFields();
      this.makeMetadataControle();
    });
    this.schemaDetailsService.getAllUnselectedFields(this.schemaId , this.variantId).subscribe(data =>{
      this.selectedFields = data ? data : [];
    },error=>{
      this.snackBar.open(`Exception : ${error}`, 'Close',{duration:2000});
    })
  }

  calculateDisplayFields(): void {
    const allMDF = this.allMetaDataFields.getValue();
    const fields = [];
    this.startColumns.forEach(col => fields.push(col));
    for (const headerField in allMDF.headers) {
      if (fields.indexOf(headerField) < 0 && this.selectedFields.indexOf(headerField) !== -1) {
        fields.push(headerField);
      }
    }


    for (const hierarchyIdx in allMDF.hierarchy) {
      if (this.selectedHierarchyIds.indexOf(allMDF.hierarchy[hierarchyIdx].heirarchyId) >= 0) {
        for (const hierarchyChildField in allMDF.hierarchyFields[allMDF.hierarchy[hierarchyIdx].heirarchyId]) {
          if (fields.indexOf(allMDF.hierarchy[hierarchyIdx].heirarchyId + '+' + hierarchyChildField) < 0 &&  this.selectedFields.indexOf(hierarchyChildField) !== -1) {
            fields.push(allMDF.hierarchy[hierarchyIdx].heirarchyId + '+' + hierarchyChildField);
          }
        }
      }
    }

    for (const gridField in allMDF.grids) {
      if (this.selectedGridIds.indexOf(gridField) >= 0) {
        for (const gridChildField in allMDF.gridFields[gridField]) {
          if (fields.indexOf(gridField + '+' + gridChildField) < 0 && this.selectedFields.indexOf(gridChildField) !== -1) {
            fields.push(gridField + '+' + gridChildField);
          }
        }
      }
    }

    this.endColumns.forEach(col => fields.push(col));

    this.displayedFields.next(fields);
  }

  makeMetadataControle(): void {
    const allMDF = this.allMetaDataFields.getValue();
    if(allMDF) {
      if(allMDF.headers) {
        Object.keys(allMDF.headers).forEach(header =>{
          this.metaDataFieldList[header] = allMDF.headers[header];
        });
      }

      // grid
      if(allMDF.grids) {
        Object.keys(allMDF.grids).forEach(grid =>{
          if(allMDF.gridFields[grid]) {
            Object.keys(allMDF.gridFields[grid]).forEach(fldId => {
              this.metaDataFieldList[fldId] = allMDF.gridFields[grid][fldId];
            });
          }
        });
      }

      // // heirerchy
      if(allMDF.hierarchy) {
        Object.keys(allMDF.hierarchy).forEach(heiId =>{
          const heId = allMDF.hierarchy[heiId].heirarchyId;
          if(allMDF.hierarchyFields[heId]) {
            Object.keys(allMDF.hierarchyFields[heId]).forEach(fldId => {
              this.metaDataFieldList[fldId] = allMDF.hierarchyFields[heId][fldId];
            });
          }
        });
      }
    }
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

  isCorrectionTab(index, item): boolean {
    if(item && item.hasOwnProperty('row_status')) {
      return (item.row_status.fieldData.indexOf('Corrections') !== -1 ? true : false);
    }
    return false;
  }

  public openTableColumnSettings() {
    const data ={schemaId: this.schemaId, fields: this.allMetaDataFields.getValue(), selectedGridIds: this.selectedGridIds, selectedHierarchyIds:this.selectedHierarchyIds, selectedFields:this.selectedFields}
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' } } ]);
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
      this.snackBar.open(`Error : ${error}`, 'Close',{duration:2000});
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
    schemaTableViewRequest.unassignedFields = this.selectedFields;

    this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {
      this.snackBar.open(`Successfully view updated : ${response}`, 'Close',{duration:2000});
    }, error => {
      this.snackBar.open(`Error : ${error}`, 'Close',{duration:2000});
    });
  }

  private getMetadataFields() {
    this.schemaDetailsService.getMetadataFields(this.objectId).subscribe(response => {
      this.allMetaDataFields.next(response);
    }, error => {
      this.snackBar.open(`Error : ${error}`, 'Close',{duration:2000});
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

  public getSchemaBrInfoList() {
    this.schemaDetailsService.getSchemaBrInfoList(this.schemaId).subscribe(data=>{
      this.schemaBrInfoList = data;
    }, error=> this.snackBar.open(`Error : ${error}`, 'Close',{duration:2000}));
  }

  hasError(row: any, fieldId: string): boolean {
    if(row.row_status) {
      const status = row.row_status.fieldData ? row.row_status.fieldData.split(',') : [];
      if(status.indexOf('Error') !== -1) {
        let fields: string[] = [];
        this.schemaBrInfoList.forEach(brInfo =>{
          fields = fields.concat(brInfo.fields);
        });
        if(fields.indexOf(fieldId) !== -1 && !row[fieldId].isCorrected) {
          return true;
        }
      }
    }
    return false;
  }

  isCorrected(row:any, fieldId: string): boolean {
    return row[fieldId] ? row[fieldId].isCorrected : false;
  }

  isEditable(fieldId: string): boolean {
    if(this.metaDataFieldList[fieldId]) {
      const dataType = this.metaDataFieldList[fieldId].dataType;
      const pickList = this.metaDataFieldList[fieldId].picklist;
      return (dataType === 'CHAR' && pickList === '0') ? true : false;
    } else {
      return false;
    }
  }

  showErrorMessages(row: any, fieldId: string): string {
    if(row.row_status) {
      const status = row.row_status.fieldData ? row.row_status.fieldData.split(',') : [];
      if(status.indexOf('Error') !== -1) {
        const errorMsg: string[] = [];
        this.schemaBrInfoList.forEach(brInfo=>{
          if(brInfo.fields.indexOf(fieldId) !== -1) {
            errorMsg.push(brInfo.dynamicMessage);
          }
        });
        return errorMsg.toString();
      }
    }
    return '';
  }
  doCorrection(row: any, fieldId: string, inpValue: string, rowIndex: number) {
    if(row && row.hasOwnProperty(fieldId)) {
      const objctNumber = row.OBJECTNUMBER.fieldData;
      const fldExit: FieldExitsResponse = this.findFieldExitsOnMetaRes(fieldId);
      const request: SchemaCorrectionReq = {id: objctNumber,fldId:fieldId, gridId: fldExit.gridId, heirerchyId: fldExit.hierarchyId, rowSno:null,vc: inpValue};
      this.schemaDetailsService.doCorrection(this.schemaId, request).subscribe(res=>{
        if(res.acknowledge) {
          this.schemaDetails.correctionValue = res.count? res.count : 0;
        }
      }, error=>{
        this.snackBar.open(`Error :: ${error}`, 'Close',{duration:2000});
        console.error(`Error :: ${error}`);
      });
      this.ngZone.runOutsideAngular(() => {
        if(document.getElementById('edit_' + fieldId + '_' + rowIndex)) {
          document.getElementById('edit_' + fieldId + '_' + rowIndex).style.display = 'none';
          const enteredVal = (document.getElementById('edit_inp_' + fieldId + '_' + rowIndex) as HTMLInputElement).value;
          document.getElementById('view_' + fieldId + '_' + rowIndex).style.display = 'block';
          document.getElementById('view_' + fieldId + '_' + rowIndex).innerText = enteredVal;

        }
      });
    }
  }

  findFieldExitsOnMetaRes(fieldId: string): FieldExitsResponse {
    const resposne: FieldExitsResponse = new FieldExitsResponse();

    // check for header
    if(this.selectedGridIds.length<=0 && this.selectedHierarchyIds.length<=0) {
      resposne.fieldId = fieldId;
    }

    // check for grid
    if(this.selectedGridIds.length>0) {
      const grids = this.allMetaDataFields.getValue().gridFields;
      Object.keys(grids).filter(grid =>{
        if(grids[grid][fieldId]) {
          resposne.fieldId = fieldId;
          resposne.gridId = grid;
          return;
        }
      });
    }

    // check for hierarchy
    if(this.selectedHierarchyIds.length>0) {
      const heirarchy = this.allMetaDataFields.getValue().hierarchyFields;
      Object.keys(heirarchy).filter(heiId =>{
        if(heirarchy[heiId][fieldId]) {
          resposne.fieldId = fieldId;
          resposne.hierarchyId = heiId;
          return;
        }
      });
    }
    return resposne;
  }

  editCurrentCell(fieldId: string, rowIndex: number) {
    this.ngZone.runOutsideAngular(() =>{
      if(document.getElementById('edit_' + fieldId + '_' + rowIndex)) {
        document.getElementById('edit_' + fieldId + '_' + rowIndex).style.display = 'block';
        document.getElementById('view_' + fieldId + '_' + rowIndex).style.display = 'none';
      }
    });
  }

  dynamicChipColor(status) {
    status = status.toLocaleLowerCase();
    let cls = '';
    switch (status) {
      case 'error':
        cls = 'errorChip';
        break;
      case 'success':
        cls = 'successChip';
        break;

      case 'corrections':
        cls = 'correctedChip';
        break;
      case 'skipped':
        cls = 'skippedChip';
        break;
      default:
        break;
    }
    return cls;
  }

}
