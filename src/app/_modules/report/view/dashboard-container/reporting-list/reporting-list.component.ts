import { Component, OnInit, ViewChild, OnChanges, Inject, LOCALE_ID, OnDestroy, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { ReportingWidget, Criteria, LayoutConfigWorkflowModel } from '../../../_models/widget';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportListDownloadModelComponent } from './report-list-download-model/report-list-download-model.component';
import { EndpointService } from '@services/endpoint.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '@shared/_services/shared-service.service';
import { ReportService } from '@modules/report/_service/report.service';
import { UserService } from '@services/user/userservice.service';

@Component({
  selector: 'pros-reporting-list',
  templateUrl: './reporting-list.component.html',
  styleUrls: ['./reporting-list.component.scss']
})
export class ReportingListComponent extends GenericWidgetComponent implements OnInit, OnChanges, OnDestroy {

  resultsLength: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  dataSource: MatTableDataSource<any> = [] as any;
  pageSize = 10;
  pageIndex = 0;
  sortingField = '';
  sortingDir = '';
  listData: any[] = new Array();
  tablepageSize = 100;

  pageSizeOption=[100, 200, 300, 400];

  /**
   * Columns that need to display
   */
  displayedColumnsId: string[] = ['action', 'objectNumber'];
  /**
   * Store fieldid & description as key | value
   */
  columnDescs: any = {} as any;

  activeSorts: any = null;

  headerDesc = '';
  objectType = '';
  isWorkflowdataSet: boolean;

  plantCode: string;
  roleId: string;

  /**
   * to store data table column meta data
   * when to use.. we will use it when we will open column settings side-sheet to show pre selected fields..
   */
  tableColumnMetaData: ReportingWidget[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  reportingListWidget: BehaviorSubject<ReportingWidget[]> = new BehaviorSubject<ReportingWidget[]>(null);


  /**
   * hold info about layouts ...
   */
  layouts: LayoutConfigWorkflowModel[] = [];
  dateFormat: string;

  constructor(public widgetService: WidgetService,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog,
    private endpointService: EndpointService,
    private snackbar: MatSnackBar,
    private router: Router,
    private sharedService: SharedServiceService,
    private reportService: ReportService,
    private userService: UserService
  ) {
    super(matDialog);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.filterCriteria && changes.filterCriteria.currentValue !== changes.filterCriteria.currentValue.previousValue) {
      this.reportingListWidget.next(this.reportingListWidget.getValue());
    }
  }

  /**
   * ANGULAR HOOK..
   */
  ngOnInit(): void {
    this.resultsLength = 0;
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getUserDetails();
    this.getHeaderMetaData();
    let isRefresh = true;
    this.sharedService.getReportDataTableSetting().subscribe(response => {
      if ((response?.isRefresh === true) || isRefresh) {
        isRefresh = false;
        this.getListTableMetadata();
      }
    })
    this.reportingListWidget.subscribe(res => {
      if (res) {
        this.filterCriteria = [];
        this.getListdata(this.pageSize, this.pageIndex, this.widgetId, this.filterCriteria, this.activeSorts);
      }
    });

  }

  /**
   * function to get logged in user details
   */
  public getUserDetails() {
    this.userService.getUserDetails().subscribe(user => {
      this.plantCode = user.plantCode;
      this.roleId = user.currentRoleId;
      switch (user.dateformat) {
        case 'MM.dd.yy':
          this.dateFormat = 'MMM-dd-yy, h:mm:ss a';
          break;

        case 'dd.MM.yy':
          this.dateFormat = 'dd-MMM-yy, h:mm:ss a';
          break;

        case 'dd M, yy':
          this.dateFormat = 'dd MMM, yy, h:mm:ss a';
          break;

        case 'MM d, yy':
          this.dateFormat = 'MMM d, yy, h:mm:ss a';
          break;

        default:
          break;
      }
    })
  }

  /**
   * function to get header meta data of widget
   */
  public getHeaderMetaData(): void {
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData => {
      this.headerDesc = returnData.widgetName;
      this.objectType = returnData.objectType;
      this.isWorkflowdataSet = returnData.isWorkflowdataSet;
      this.tablepageSize=returnData.pageDefaultSize || 100
    });
  }

  /**
   * function to get meta data of the columns for data table
   */
  public getListTableMetadata(): void {
    this.displayedColumnsId = ['action'];
    // this.columnDescs = {};
    this.widgetService.getListTableMetadata(this.widgetId).subscribe(returnData => {
      if (returnData !== undefined && Object.keys(returnData).length > 0) {
        // this.columnDescs.objectNumber = 'Object Number';
        returnData.forEach(singlerow => {
          this.displayedColumnsId.push(singlerow.fields);
          this.columnDescs[singlerow.fields] = singlerow.fieldDesc ? singlerow.fieldDesc :singlerow.fldMetaData.fieldDescri;
        });
        this.reportingListWidget.next(returnData);
        this.tableColumnMetaData = returnData;
      }
    });
  }

  public getListdata(pageSize, pageIndex, widgetId: number, criteria: Criteria[], soringMap): void {
    this.widgetService.getListdata(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap).subscribe(returndata => {
      this.listData = new Array();
      this.resultsLength = returndata.count;
      if (returndata.data) {
        returndata = returndata.data;
      }
      returndata.hits.hits.forEach(element => {
        const source = element.sourceAsMap;
        let objectNumber = source.staticFields && source.staticFields.OBJECTID && source.staticFields.OBJECTID.vc ? source.staticFields.OBJECTID.vc[0].c : element.id;

      if(source.staticFields && source.staticFields.MASSPROCESSING_ID && source.staticFields.MASSPROCESSING_ID.vc && source.staticFields.MASSPROCESSING_ID.vc !== undefined){
          objectNumber = source.staticFields.OBJECT_NUMBER && source.staticFields.OBJECT_NUMBER.vc !== undefined ?source.staticFields.OBJECT_NUMBER.vc[0].c:objectNumber;
        }
        const obj = { objectNumber };
        const status = source?source.stat:'';
        if(status !=='' && status !== undefined && this.displayedColumnsId.indexOf('stat')>-1){
         const colststus = 'stat';
          obj[colststus]=status;
        }

        const hdvs = source.hdvs !== undefined ? source.hdvs : (source.staticFields !== undefined ? source.staticFields : source);
        if (source.staticFields !== undefined) {
          Object.assign(hdvs, source.staticFields);
        }
        this.displayedColumnsId.forEach(column => {

          if (column === 'action' || column === 'objectNumber' || column === 'stat') {
            if(column === 'objectNumber') {
              obj[column]=objectNumber;
            }
          } else {
            if (hdvs[column]) {
              // check for dropdown , multiselect , userselection and objectRefrence
              const val = hdvs[column].vc ? hdvs[column].vc : null;
              if (val) {
                const valArray = [];
                val.forEach(v => {
                  if (v.t) {
                    valArray.push(v.t);
                  }
                });
                const finalText = valArray.toString();
                if (finalText) {
                  obj[column] = finalText;
                } else {
                  obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0] ? hdvs[column].vc.map(map => map.c).toString() : '' : '';
                }
              }
            }
          }
        });
        this.listData.push(obj);
      });
      this.dataSource = new MatTableDataSource<any>(this.listData);
      this.dataSource.sort = this.sort;
      //  this.widgetService.count.subscribe(count=>{
      //   this.resultsLength = count;
      // })
    });
  }

  getServerData(event): PageEvent {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getListdata(this.pageSize, this.pageIndex * this.pageSize, this.widgetId, this.filterCriteria, this.activeSorts);
    return event;
  }

  details(data): void {
    const url = document.getElementsByTagName('base')[0].href.substring(0, document.getElementsByTagName('base')[0].href.indexOf('MDOSF'));
    window.open(
      url + 'MDOSF/loginPostProcessor?to=summary&objNum=' + data.objectNumber + '&objectType=' + this.objectType, 'MDO_TAB');
  }

  /*
  * down report list data as CSV
  *If data less then 5000 then download instant
  *Otherwise open dialog and ask for page from number ..
  *
  */
  downloadCSV(): void {
    if (this.resultsLength <= 5000) {
      this.downloadData(0);
      // this.widgetService.downloadCSV('Report-List',this.listData);
    } else {
      const dialogRef = this.matDialog.open(ReportListDownloadModelComponent, {
        width: '500px',
        height: '600px',
        data: {
          recCount: this.resultsLength
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.downloadData(result);
        }
      });
    }
  }

  /**
   * Use to get sorted column and
   * call http with sorted columns
   * @param sort the event emitted by CDK table
   */
  sortTable(sort: Sort) {
    if (sort) {
      let fld = sort.active;
      const dir = sort.direction as string;
      this.activeSorts = {} as any;
      fld = fld === 'objectNumber' ? 'id' : fld;
      this.activeSorts[fld] = dir;
      if (dir === '') {
        this.activeSorts = null;
      }
      this.getListdata(this.pageSize, this.pageIndex * this.pageSize, this.widgetId, this.filterCriteria, this.activeSorts);
    }
  }

  /**
   * Download data , call service with filter criteria and page from ...
   */
  downloadData(frm: number) {
    frm = frm * 5000;
    const downloadLink = document.createElement('a');
    downloadLink.href = `${this.endpointService.downloadWidgetDataUrl(String(this.widgetId))}?from=${frm}&conditionList=${JSON.stringify(this.filterCriteria)}`;
    downloadLink.setAttribute('target', '_blank');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }


  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

  isDateType(column: string): boolean {
    const val = this.reportingListWidget.getValue() ? this.reportingListWidget.getValue() : [];
    const hasFld = val.filter(fil => fil.fields === column)[0];
    return hasFld ? (hasFld.fldMetaData ? ((hasFld.fldMetaData.dataType === 'DATS' || hasFld.fldMetaData.dataType === 'DTMS') ? true : false) : false) : false;
  }

  /**
   * function to open column setting side-sheet
   */
  openTableColumnSideSheet() {
    const data = {
      objectType: this.objectType,
      selectedColumns: this.tableColumnMetaData.map(columnMetaData => columnMetaData.fldMetaData),
      isWorkflowdataSet: this.isWorkflowdataSet,
      widgetId: this.widgetId,
      isRefresh: false
    }
    this.sharedService.setReportDataTableSetting(data);
    this.router.navigate(['', { outlets: { sb: `sb/report/column-settings/${this.widgetId}` } }])
  }

  getAlllayouts(row: any) {
    console.log(this.objectType);
    console.log(row);
    const WFID = row ? row.WFID : '';
    this.reportService.getAllLayoutsForSummary(this.objectType, WFID, this.roleId, this.plantCode).subscribe(res => {
      console.log(res);
      this.layouts = res;
    }, error => console.error(`Error : ${error.message}`));

  }

  ngOnDestroy(){
    this.reportingListWidget.complete();
    this.reportingListWidget.unsubscribe();
  }

}
