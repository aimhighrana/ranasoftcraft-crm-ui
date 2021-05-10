import { Component, OnInit, ViewChild, OnChanges, Inject, LOCALE_ID, OnDestroy, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReportingWidget, Criteria, LayoutConfigWorkflowModel, DisplayCriteria, WidgetHeader } from '../../../_models/widget';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EndpointService } from '@services/endpoint.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '@shared/_services/shared-service.service';
import { ReportService } from '@modules/report/_service/report.service';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';

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
  pageSize = 100;
  pageIndex = 0;
  sortingField = '';
  sortingDir = '';
  listData: any[] = new Array();

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

  widgetHeader: WidgetHeader = new WidgetHeader();

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

  /**
   * To hold subscriptions of component
   */
  subscription: Subscription[] = [];
  returndata: any;
  userDetails: Userdetails;

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
    const sub = this.sharedService.getReportDataTableSetting().subscribe(response => {
      if ((response?.isRefresh === true) || isRefresh) {
        isRefresh = false;
        this.getListTableMetadata();
      }
    });
    this.subscription.push(sub);

    const subs = this.reportingListWidget.subscribe(res => {
      if (res) {
        this.getListdata(this.pageSize, this.pageIndex, this.widgetId, this.filterCriteria, this.activeSorts);
      }
    });
    this.subscription.push(subs);
  }

  /**
   * function to get logged in user details
   */
  public getUserDetails() {
    const sub =  this.userService.getUserDetails().subscribe(user => {
      this.userDetails = user;
      this.plantCode = user.plantCode;
      this.roleId = user.currentRoleId;
      switch (user.dateformat) {
        case 'MM.dd.yy':
          this.dateFormat = 'MM.dd.yyyy, h:mm:ss a';
          break;

        case 'dd.MM.yy':
          this.dateFormat = 'dd.MM.yyyy, h:mm:ss a';
          break;

        case 'dd M, yy':
          this.dateFormat = 'dd MMM, yyyy, h:mm:ss a';
          break;

        case 'MM d, yy':
          this.dateFormat = 'MMMM d, yyyy, h:mm:ss a';
          break;

        default:
          break;
      }
    }, (error)=>{
      console.log('Something went wrong while getting user details.', error.message)
    });
    this.subscription.push(sub);
  }

  /**
   * function to get header meta data of widget
   */
  public getHeaderMetaData(): void {
    const sub = this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData => {
      this.widgetHeader = returnData;
      this.widgetHeader.displayCriteria = returnData.displayCriteria ? returnData.displayCriteria : DisplayCriteria.CODE;
      this.pageSize=returnData.pageDefaultSize || 100;
      if(returnData.pageDefaultSize) {
        this.pageSizeOption = [returnData.pageDefaultSize,100,200,300,400];
      } else {
        this.pageSizeOption = [100,200,300,400];
      }
    }, (error)=> {
      console.log('Something went wrong while getting header meta data', error.message)
    });
    this.subscription.push(sub);
  }

  /**
   * function to get meta data of the columns for data table
   */
  public getListTableMetadata(): void {
    this.displayedColumnsId = ['action'];
    // this.columnDescs = {};
    const fieldsArray=[];
    const sub = this.widgetService.getListTableMetadata(this.widgetId).subscribe(returnData => {
      if (returnData !== undefined && Object.keys(returnData).length > 0) {
        // this.columnDescs.objectNumber = 'Object Number';
        returnData.forEach(singlerow => {
          if (!singlerow.displayCriteria) {
            singlerow.displayCriteria = DisplayCriteria.CODE;
          }
          const obj = { fields: singlerow.fields, fieldOrder: singlerow.fieldOrder }
          fieldsArray.push(obj);
          this.columnDescs[singlerow.fields] = singlerow.fieldDesc ? singlerow.fieldDesc : singlerow.fldMetaData.fieldDescri;
        });
        const sortedFields = this.sortDisplayedColumns(fieldsArray)
        this.displayedColumnsId = [...this.displayedColumnsId, ...sortedFields.map(elm => elm.fields)]
        this.reportingListWidget.next(returnData);
        this.tableColumnMetaData = returnData;
      }
    }, (error)=> {
      console.log('Something went wrong while getting table meta data', error.message)
    });
    this.subscription.push(sub);
  }

  /**
   * function to get sorted meta data of the columns for data table
   */
  sortDisplayedColumns(array: any[]){
    return array.sort((a, b) => a.fieldOrder - b.fieldOrder);
   }



   public getListdata(pageSize, pageIndex, widgetId: number, criteria: Criteria[], soringMap): void {
    this.widgetService.getListdata(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap).subscribe(returndata => {
      this.returndata = returndata;
      this.updateTable(this.returndata);
    });
  }

  private updateTable(returndata) {
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
              let textvalue = valArray.toString();
              const reportingWidget = this.tableColumnMetaData ? this.tableColumnMetaData.find(t => t.fields = column) : null;
              textvalue = textvalue === 'null' ? '' : textvalue
              let codeValue = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0] ? hdvs[column].vc.map(map => map.c).toString() : '' : '';
              codeValue = codeValue === 'null' ? '' : codeValue;
              if(column === 'OVERDUE' || column === 'FORWARDENABLED' || column === 'TIME_TAKEN' || reportingWidget.fldMetaData.picklist === '35') {
                textvalue = this.getFields(column, codeValue);
                codeValue = textvalue;
              }
              const displayCriteria = reportingWidget && reportingWidget.displayCriteria ? reportingWidget.displayCriteria : this.widgetHeader.displayCriteria;
              switch(displayCriteria) {
                case DisplayCriteria.CODE :
                  obj[column] = `${codeValue}`;
                  break;
                case DisplayCriteria.TEXT :
                  obj[column] = `${textvalue ? textvalue : codeValue}`;
                  break;
                case DisplayCriteria.CODE_TEXT :
                  if(this.isDropdownType(column)) {
                    obj[column] = `${(textvalue ? codeValue + ' -- ' + textvalue : codeValue ? codeValue  + ' -- ' + codeValue : '')}`;
                  } else {
                    obj[column] = `${textvalue ? textvalue : codeValue}`;
                  }
                  break;

                default:
                  break;
              }
            }
          }
        }
      });
      this.listData.push(obj);
    });
    this.dataSource = new MatTableDataSource<any>(this.listData);
    this.dataSource.sort = this.sort;
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
      url + 'MDOSF/loginPostProcessor?to=summary&objNum=' + data.objectNumber + '&objectType=' + this.widgetHeader.objectType, 'MDO_TAB');
  }

  /*
  * down report list data as CSV
  *If data less then 5000 then download instant
  *Otherwise open dialog and ask for page from number ..
  *
  */
 downloadCSV(): void {
  this.router.navigate(['', { outlets: { sb: `sb/report/download-widget/${this.widgetId}` } }], {queryParamsHandling: 'preserve'})
}

  /**
   * Use to get sorted column and
   * call http with sorted columns
   * @param sort the event emitted by CDK table
   */
  sortTable(sort: Sort) {
    if (sort) {
      const fld = sort.active;
      const dir = sort.direction as string;
      this.activeSorts = {} as any;
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

  getDateTypeValue(val: string): string {
    return Number(val) ? val : '';
  }

  /**
   * function to open column setting side-sheet
   */
  openTableColumnSideSheet() {
    const sortedColumns=this.sortDisplayedColumns(this.tableColumnMetaData)
    const data = {
      objectType: this.widgetHeader.objectType,
      selectedColumns: sortedColumns.map(columnMetaData => {
        columnMetaData.fldMetaData.sno = columnMetaData.sno;
        columnMetaData.fldMetaData.displayCriteria = columnMetaData.displayCriteria;
        return columnMetaData.fldMetaData
      }),
      isWorkflowdataSet: this.widgetHeader.isWorkflowdataSet,
      isCustomdataSet: this.widgetHeader.isCustomdataSet,
      widgetId: this.widgetId,
      widgetType: this.widgetInfo.widgetType,
      displayCriteria: this.widgetHeader.displayCriteria,
      userDetails: this.userDetails,
      isRefresh: false
    }
    this.sharedService.setReportDataTableSetting(data);
    this.router.navigate(['', { outlets: { sb: `sb/report/column-settings/${this.widgetId}` } }])
  }

  getAlllayouts(row: any) {
    const WFID = row ? row.WFID : '';
    const sub = this.reportService.getAllLayoutsForSummary(this.widgetHeader.objectType, WFID, this.roleId, this.plantCode).subscribe(res => {
      console.log(res);
      this.layouts = res;
    }, error => console.error(`Error : ${error.message}`));
      this.subscription.push(sub);
  }

  ngOnDestroy(){
    this.reportingListWidget.complete();
    this.reportingListWidget.unsubscribe();

    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  isDropdownType(column: string): boolean {
    const val = this.reportingListWidget.getValue() ? this.reportingListWidget.getValue() : [];
    const hasFld = val.filter(fil => fil.fields === column)[0];
    return hasFld ? (hasFld.fldMetaData ? ((hasFld.fldMetaData.picklist === '1' || hasFld.fldMetaData.picklist === '30' || hasFld.fldMetaData.picklist === '37') ? true : false) : false) : false;
  }

}
