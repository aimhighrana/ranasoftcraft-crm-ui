import { Component, OnInit, ViewChild, OnChanges, Inject, LOCALE_ID } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { ReportingWidget, Criteria } from '../../../_models/widget';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportListDownloadModelComponent } from './report-list-download-model/report-list-download-model.component';
import { EndpointService } from '@services/endpoint.service';

@Component({
  selector: 'pros-reporting-list',
  templateUrl: './reporting-list.component.html',
  styleUrls: ['./reporting-list.component.scss']
})
export class ReportingListComponent extends GenericWidgetComponent implements OnInit,OnChanges{

  resultsLength : any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  dataSource : MatTableDataSource<any> = [] as any;
  pageSize = 10;
  pageIndex=0;
  sortingField = '';
  sortingDir = '';
  listData :any[]=new Array();

  /**
   * Columns that need to display
   */
  displayedColumnsId :string[]= ['action','objectNumber'];
  /**
   * Store fieldid & description as key | value
   */
  columnDescs: any = {} as any;

  activeSorts: any = null;

  headerDesc='';
  objectType = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  reportingListWidget : BehaviorSubject<ReportingWidget[]> = new BehaviorSubject<ReportingWidget[]>(null);

  constructor(public widgetService : WidgetService,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog,
    private endpointService: EndpointService,
    private snackbar: MatSnackBar) {
    super(matDialog);
  }

  ngOnChanges():void{
    this.reportingListWidget.subscribe(res=>{
      if(res) {
        this.getListdata(this.pageSize,this.pageIndex,this.widgetId,this.filterCriteria, this.activeSorts);
      }
    });
  }

  ngOnInit(): void {
    this.resultsLength =0;
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.getHeaderMetaData();
    this.getListTableMetadata();
  }

  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.headerDesc = returnData.widgetName;
      this.objectType = returnData.objectType;
    });
  }


  public getListTableMetadata():void{
    this.widgetService.getListTableMetadata(this.widgetId).subscribe(returnData=>{
      if(returnData !== undefined && Object.keys(returnData).length>0){
        this.columnDescs.objectNumber = 'Object Number';
         returnData.forEach(singlerow=>{
          this.displayedColumnsId.push(singlerow.fields);
          this.columnDescs[singlerow.fields] = singlerow.fieldDesc;
       });
       this.reportingListWidget.next(returnData);
      }
    });
  }

  public getListdata(pageSize,pageIndex,widgetId:number,criteria:Criteria[],soringMap):void{
    this.widgetService.getListdata(String(pageSize),String(pageIndex),String(widgetId),criteria, soringMap).subscribe(returndata=>{
      this.listData =new Array();
      this.resultsLength = returndata.count;
      if(returndata.data){
        returndata = returndata.data;
      }
      returndata.hits.hits.forEach(element => {
        const source =element._source;

        const objectNumber = element._id;
        const obj = {objectNumber};

        const hdvs = source.hdvs !== undefined ? source.hdvs :(source.staticFields !== undefined ?source.staticFields:source);
        if(source.staticFields !== undefined){
           Object.assign(hdvs,source.staticFields);
        }
        let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
        locale = locale.toUpperCase();
        const tblMetadata = this.reportingListWidget.value;
        this.displayedColumnsId.forEach(column=>{

          const metadata = tblMetadata.filter(fil=> fil.fields === column)[0];
          const pickList = (metadata && metadata.fldMetaData) ? metadata.fldMetaData.picklist : 0;

          if(column === 'action' || column === 'objectNumber'){}
          else {
            if (hdvs[column]) {
              // check for dropdown , multiselect , userselection and objectRefrence
              if(pickList === '1' && hdvs[column]) {
                if(metadata.fldMetaData.isCheckList === 'true') {
                  const localVal = hdvs[column].msdv ? (hdvs[column].msdv[0].msdvls ? hdvs[column].msdv[0].msdvls.filter(f=> f.lang === locale)[0] :null) : null;
                  if(localVal) {
                    obj[column] = localVal.val.toString();
                  } else {
                    obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0]?hdvs[column].vc[0].c : '':'';
                  }
                } else {
                  const localVal = hdvs[column].ddv ? (hdvs[column].ddv ? hdvs[column].ddv.filter(f=> f.lang === locale)[0] :null) : null;
                  if(localVal) {
                    obj[column] = localVal.val ? localVal.val : '';
                  } else {
                    obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0]?hdvs[column].vc[0].c+' -- '+hdvs[column].vc[0].t : '':'';
                  }
                }
              } else if(pickList === '37' && hdvs[column]) {
                const localVal = hdvs[column].ddv ? (hdvs[column].ddv ? hdvs[column].ddv.filter(f=> f.lang === locale)[0] :null) : null;
                if(localVal) {
                  obj[column] = localVal.val ? localVal.val : '';
                } else {
                  obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0]?hdvs[column].vc[0].c : '':'';
                }
              } else if(pickList === '30' && hdvs[column]) {
                if(metadata.fldMetaData.isCheckList === 'true') {
                  const localVal = hdvs[column].msdv ? (hdvs[column].msdv[0].msdvls ? hdvs[column].msdv[0].msdvls.filter(f=> f.lang === locale)[0] :null) : null;
                  if(localVal) {
                    obj[column] = localVal.val.toString();
                  } else {
                    obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0]?hdvs[column].vc[0].c : '':'';
                  }
                } else if(hdvs[column]){
                  const localVal = hdvs[column].ddv ? (hdvs[column].ddv ? hdvs[column].ddv.filter(f=> f.lang === locale)[0] :null) : null;
                  if(localVal) {
                    obj[column] = localVal.val ? localVal.val : '';
                  } else {
                    obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0]?hdvs[column].vc[0].c : '':'';
                  }
                }
              }else if(hdvs[column]){
                // case for other fields
                if(hdvs[column] && hdvs[column].vls && hdvs[column].vls[locale]  && hdvs[column].vls[locale].valueTxt){
                  obj[column] = hdvs[column].vls[locale].valueTxt;
                }else{
                  obj[column] = hdvs[column] ? hdvs[column].vc && hdvs[column].vc[0]?hdvs[column].vc[0].c : '':'';
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

  getServerData(event):PageEvent {
   this.pageSize = event.pageSize;
   this.pageIndex = event.pageIndex;
   this.getListdata(this.pageSize,this.pageIndex * this.pageSize,this.widgetId,this.filterCriteria,this.activeSorts);
    return event;
 }

 details(data):void{
  const url = document.getElementsByTagName('base')[0].href.substring(0, document.getElementsByTagName('base')[0].href.indexOf('MDOSF'));
  window.open(
    url+'MDOSF/loginPostProcessor?to=summary&objNum='+data.objectNumber+'&objectType='+this.objectType, 'MDO_TAB');
}

/*
* down report list data as CSV
*If data less then 5000 then download instant
*Otherwise open dialog and ask for page from number ..
*
*/
downloadCSV():void{
  if(this.resultsLength <=5000) {
    this.downloadData(0);
    // this.widgetService.downloadCSV('Report-List',this.listData);
  } else {
    const dialogRef = this.matDialog.open(ReportListDownloadModelComponent, {
       width: '500px',
       data:{
        recCount: this.resultsLength
       }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
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
  if(sort) {
    let fld = sort.active;
    const dir = sort.direction as string;
    this.activeSorts  = {} as any;
    fld = fld === 'objectNumber' ? 'id' : fld;
    this.activeSorts[fld] = dir;
    if(dir === '') {
      this.activeSorts = null;
    }
    this.getListdata(this.pageSize,this.pageIndex * this.pageSize,this.widgetId,this.filterCriteria,this.activeSorts);
  }
}

  /**
   * Download data , call service with filter criteria and page from ...
   */
  downloadData(frm: number) {
    frm = frm*5000;
    const downloadLink = document.createElement('a');
    downloadLink.href = `${this.endpointService.downloadWidgetDataUrl(String(this.widgetId))}?from=${frm}&conditionList=${JSON.stringify(this.filterCriteria)}`;
    downloadLink.setAttribute('target', '_blank');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }


  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

}
