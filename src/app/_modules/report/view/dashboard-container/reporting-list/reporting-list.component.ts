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
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModel, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { switchMap, tap } from 'rxjs/operators';

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

  pageSizeOption = [100, 200, 300, 400];

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
  /**
   * To hold meta details for all possible columns
   */
  allColumnMetaDataFields: MetadataModeleResponse;
  /**
   * to store the details of the dispalyed column id
   */
  displayedColumnDetails: any;

  constructor(public widgetService: WidgetService,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog,
    private endpointService: EndpointService,
    private snackbar: MatSnackBar,
    private router: Router,
    private sharedService: SharedServiceService,
    private reportService: ReportService,
    private userService: UserService,
    private schemaDetailsService: SchemaDetailsService
  ) {
    super(matDialog);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.filterCriteria && changes.filterCriteria.currentValue !== changes.filterCriteria.currentValue.previousValue && !this.widgetHeader.isEnableGlobalFilter) {
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
    let isRefresh = true;
    const sub = this.sharedService.getReportDataTableSetting().subscribe(response => {
      if ((response?.isRefresh === true) || isRefresh) {
        isRefresh = false;
        if (!Object.keys(this.widgetHeader).length) {
          const sub1 = this.widgetService.getHeaderMetaData(this.widgetId).pipe(tap(resHeader => this.widgetHeader = resHeader), switchMap(value => this.schemaDetailsService.getMetadataFields(value.objectType))).subscribe(res => {
            this.allColumnMetaDataFields = res;
            this.getHeaderMetaData()
            this.getListTableMetadata();
          }, (error) => {
            console.log('Something went wrong while getting header meta data', error.message)
          })
          this.subscription.push(sub1);
        } else {
          this.getListTableMetadata();
        }
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
    const sub = this.userService.getUserDetails().subscribe(user => {
      this.userDetails = user;
      this.plantCode = user.plantCode;
      this.roleId = user.currentRoleId;
      switch (user.dateformat) {
        case 'mm.dd.yy':
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
    }, (error) => {
      console.log('Something went wrong while getting user details.', error.message)
    });
    this.subscription.push(sub);
  }

  /**
   * function to get header meta data of widget
   */
  public getHeaderMetaData(): void {
    this.widgetHeader.displayCriteria = this.widgetHeader.displayCriteria ? this.widgetHeader.displayCriteria : DisplayCriteria.CODE;
    this.pageSize = this.widgetHeader.pageDefaultSize || 100;
    if (this.widgetHeader.pageDefaultSize) {
      this.pageSizeOption = [this.widgetHeader.pageDefaultSize, 100, 200, 300, 400];
    } else {
      this.pageSizeOption = [100, 200, 300, 400];
    }
  }

  /**
   * function to get meta data of the columns for data table
   */
  public getListTableMetadata(): void {
    this.displayedColumnsId = ['action'];
    const fieldsArray = [];
    const sub = this.widgetService.getListTableMetadata(this.widgetId).subscribe((returnData: ReportingWidget[]) => {
      if (returnData !== undefined && Object.keys(returnData).length > 0) {
        returnData.forEach(singlerow => {
          if (singlerow.fields === 'EVENT_ID') {
            /* setting the picklist of event column as '1' */
            singlerow.fldMetaData.picklist = '1';
          }
          const obj = { fields: singlerow.fields, fieldOrder: singlerow.fieldOrder, ...this.getFieldType(singlerow.fldMetaData) }
          fieldsArray.push(obj);
          this.columnDescs[singlerow.fields] = singlerow.fieldDesc ? singlerow.fieldDesc : singlerow.fldMetaData.fieldDescri;
        });
        const sortedFields = this.sortDisplayedColumns(fieldsArray);
        this.displayedColumnDetails = [...sortedFields];
        this.displayedColumnsId = [...this.displayedColumnsId, ...sortedFields.map(elm => elm.fields)]
        this.tableColumnMetaData = returnData;
        this.reportingListWidget.next(returnData);
      }
    }, (error) => {
      console.log('Something went wrong while getting table meta data', error.message)
    });
    this.subscription.push(sub);
  }

  /**
   * function to get sorted meta data of the columns for data table
   */
  sortDisplayedColumns(array: any[]) {
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
      let objectNumber = source.id ? source.id : source.staticFields && source.staticFields.OBJECT_NUMBER && source.staticFields.OBJECT_NUMBER.vc ? source.staticFields.OBJECT_NUMBER.vc[0].c : element.id;

      if (source.staticFields && source.staticFields.MASSPROCESSING_ID && source.staticFields.MASSPROCESSING_ID.vc && source.staticFields.MASSPROCESSING_ID.vc !== undefined) {
        objectNumber = source.staticFields.OBJECTID && source.staticFields.OBJECTID.vc !== undefined ? source.staticFields.OBJECTID.vc[0].c : objectNumber;
      }
      const obj = { objectNumber };
      const status = source ? source.stat : '';
      if (status !== '' && status !== undefined && this.displayedColumnsId.indexOf('stat') > -1) {
        const colststus = 'stat';
        obj[colststus] = status;
      }
      const hdvs = source.hdvs !== undefined ? source.hdvs : (source.staticFields !== undefined ? source.staticFields : source);
      const hyvs = source.hyvs !== undefined ? source.hyvs : null;
      const gvs = source.gvs !== undefined ? source.gvs : null;


      if (source.staticFields !== undefined) {
        Object.assign(hdvs, source.staticFields);
      }
      const gvsData = [];
      const hvysData = [];
      this.displayedColumnsId.forEach(column => {
        if (column === 'action' || column === 'objectNumber' || column === 'stat') {
          if (column === 'objectNumber') {
            obj[column] = objectNumber;
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
              const reportingWidget = this.tableColumnMetaData ? this.tableColumnMetaData.find(t => t.fields === column) : null;
              textvalue = textvalue === 'null' ? '' : textvalue
              let codeValue = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0] ? hdvs[column].vc.map(map => map.c).toString() : '' : '';
              codeValue = codeValue === 'null' ? '' : codeValue;
              if (column === 'OVERDUE' || column === 'FORWARDENABLED' || column === 'TIME_TAKEN' || reportingWidget.fldMetaData.picklist === '35') {
                textvalue = this.getFields(column, codeValue);
                codeValue = textvalue;
              }
              obj[column] = this.getObjectData(codeValue, textvalue, column);
            }
          } else {
            const selectedDetails = this.displayedColumnDetails.find(columnDetails => columnDetails.fields === column);
            if (selectedDetails.isGrid && gvs && gvs[selectedDetails.parentFieldId]) {
              gvs[selectedDetails.parentFieldId].rows.forEach((row, index) => {
                const val = row[column] && row[column].vc ? row[column].vc : null;
                if (val) {
                  const valArray = [];
                  val.forEach(v => {
                    if (v.t) {
                      valArray.push(v.t);
                    }
                  })

                  let textvalue = valArray.toString();
                  textvalue = textvalue === 'null' ? '' : textvalue;
                  let codeValue = row[column] ? row[column].vc && row[column].vc[0] ? row[column].vc.map(map => map.c).toString() : '' : '';
                  codeValue = codeValue === 'null' ? '' : codeValue;
                  obj[column] = this.getObjectData(codeValue, textvalue, column);
                  if (gvsData[index]) {
                    gvsData[index][column] = obj[column];
                  } else {
                    gvsData.push({ [column]: obj[column] });
                  }
                }
              })
            } else if (selectedDetails.isHierarchy && hyvs && hyvs[selectedDetails.hierarchyId]) {
              hyvs[selectedDetails.hierarchyId].rows.forEach((row, index) => {
                const val = row[column] && row[column].vc ? row[column].vc : null;
                if (val) {
                  const valArray = [];
                  val.forEach(v => {
                    if (v.t) {
                      valArray.push(v.t);
                    }
                  });
                  let textvalue = valArray.toString();
                  textvalue = textvalue === 'null' ? '' : textvalue
                  let codeValue = row[column] ? row[column].vc && row[column].vc[0] ? row[column].vc.map(map => map.c).toString() : '' : '';
                  codeValue = codeValue === 'null' ? '' : codeValue;
                  obj[column] = this.getObjectData(codeValue, textvalue, column);
                  if (hvysData[index]) {
                    hvysData[index][column] = obj[column];
                  } else {
                    hvysData.push({ [column]: obj[column] });
                  }
                }
              })
            }
          }
        }
      });
      const listData: any[] = [];
      if (gvsData.length) {
        gvsData.forEach(gvsdata => {
          Object.keys(gvsdata).forEach(key => {
            obj[key] = gvsdata[key];
          })
          listData.push({ ...obj });
        })
      }
      if (hvysData.length) {
        hvysData.forEach((hvys, index) => {
          Object.keys(hvys).forEach(key => {
            if (listData[index])
              listData[index][key] = hvys[key];
            else {
              obj[key] = hvys[key]
            }
          })

          if(!listData[index]) {
            listData.push({...obj});
          }
        })
      }

      if(listData.length) {
        this.listData.push(...listData);
      }
      if (!gvsData.length && !hvysData.length) {
        this.listData.push({ ...obj });
      }

    });
    this.dataSource = new MatTableDataSource<any>(this.listData);
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
    console.log(this.listData);
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
    this.router.navigate(['', { outlets: { sb: `sb/report/download-widget/${this.widgetId}` } }], { queryParams: { conditionList: `${JSON.stringify(this.filterCriteria)}` }, queryParamsHandling: 'merge' })
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
    const sortedColumns: ReportingWidget[] = this.sortDisplayedColumns(this.tableColumnMetaData)
    const data = {
      objectType: this.widgetHeader.objectType,
      selectedColumns: sortedColumns.map(columnMetaData => {
        (columnMetaData as any).fldMetaData.sno = columnMetaData.sno;
        if (columnMetaData.fldMetaData.picklist === '1' || columnMetaData.fldMetaData.picklist === '30' || columnMetaData.fldMetaData.picklist === '37') {
          columnMetaData.fldMetaData.displayCriteria = columnMetaData.displayCriteria ? columnMetaData.displayCriteria : this.widgetHeader.displayCriteria;
        }
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

  ngOnDestroy() {
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

  /**
   *
   * @param codeValue code for particular column of table
   * @param textvalue text for particular column of table
   * @param column column name of table
   * @returns resultant value with the combination of code and text according to display criteria
   */
  getObjectData(codeValue, textvalue, column) {
    let value;
    const reportingWidget = this.tableColumnMetaData ? this.tableColumnMetaData.find(t => t.fields === column) : null;
    const displayCriteria = reportingWidget && reportingWidget.displayCriteria ? reportingWidget.displayCriteria : this.widgetHeader.displayCriteria;
    switch (displayCriteria) {
      case DisplayCriteria.CODE:
        value = `${codeValue}`;
        break;
      case DisplayCriteria.TEXT:
        value = `${textvalue ? textvalue : codeValue}`;
        break;
      case DisplayCriteria.CODE_TEXT:
        if (this.isDropdownType(column)) {
          value = `${(textvalue ? codeValue + ' -- ' + textvalue : codeValue ? codeValue + ' -- ' + codeValue : '')}`;
        } else {
          value = `${textvalue ? textvalue : codeValue}`;
        }
        break;

      default:
        break;
    }
    return value;
  }

  /**
   *
   * @param fldMetaData fieldMeta data for column
   * @returns object that c
   */
  getFieldType(fldMetaData: MetadataModel) {
    if (fldMetaData.parentField) {
      if (Object.keys(this.allColumnMetaDataFields.grids).indexOf(fldMetaData.parentField) > -1) {
        return { isGrid: true, parentFieldId: fldMetaData.parentField };
      } else {
        const selectedField = this.allColumnMetaDataFields.hierarchy.find(value => value.fieldId === fldMetaData.parentField)
        if (selectedField) {
          return { isHierarchy: true, hierarchyId: selectedField.heirarchyId };
        }
        else {
          return { isHierarchy: false, isGrid: false }
        }
      }
    } else {
      let returnData = {};
      Object.keys(this.allColumnMetaDataFields.grids).some(item => {
        const index = Object.keys(this.allColumnMetaDataFields.gridFields[item]).indexOf(fldMetaData.fieldId);
        if (index > -1) {
          returnData = { isGrid: true, parentFieldId: item }
          return true;
        }
        return false;
      })
      if (Object.keys(returnData).length) {
        return returnData;
      } else {
        this.allColumnMetaDataFields.hierarchy.some(item => {
          const index = Object.keys(this.allColumnMetaDataFields.hierarchyFields[item.heirarchyId]).indexOf(fldMetaData.fieldId);
          if (index > -1) {
            returnData = { isHierarchy: true, hierarchyId: item.heirarchyId };
            return true;
          }
          return false;
        })

        if (Object.keys(returnData).length) {
          return returnData;
        } else {
          return { isHierarchy: false, isGrid: false }
        }
      }
    }
  }

  /**
   *
   * @param objectNumber object number
   * @returns the observable that calls the api of meta deta fields
   */
  getMetaDataFields(objectNumber) {
    return this.schemaDetailsService.getMetadataFields(objectNumber);
  }
}
