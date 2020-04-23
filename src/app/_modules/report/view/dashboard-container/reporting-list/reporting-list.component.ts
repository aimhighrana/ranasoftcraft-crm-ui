import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { ReportingWidget, Criteria } from '../../../_models/widget';

@Component({
  selector: 'pros-reporting-list',
  templateUrl: './reporting-list.component.html',
  styleUrls: ['./reporting-list.component.scss']
})
export class ReportingListComponent extends GenericWidgetComponent implements OnInit,OnChanges{

  public userList : any[];
  public showList =  true;
  displayedColumns: string[] =new Array();
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
  displayedColumnsId :string[]= new Array();
  headerDesc='';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


    reportingListWidget : BehaviorSubject<ReportingWidget> = new BehaviorSubject<ReportingWidget>(null);

  constructor(public widgetService : WidgetService) {
    super();
  }

  ngOnChanges():void{
    this.reportingListWidget.subscribe(res=>{
      if(res) {
        this.getListdata(this.pageSize,this.pageIndex,this.widgetId,this.filterCriteria);
      }
    });
  }

  ngOnInit(): void {
    this.resultsLength =0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getHeaderMetaData();
    this.getListTableMetadata();
  }

  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.headerDesc = returnData.widgetName;
    });
  }


  public getListTableMetadata():void{
    this.widgetService.getListTableMetadata(this.widgetId).subscribe(returnData=>{
      console.log(returnData);
      if(returnData !== undefined && Object.keys(returnData).length>0){
        this.displayedColumns.push('star','ObjectNumber')
         returnData.forEach(singlerow=>{
          this.displayedColumnsId.push(singlerow.fields);
          this.displayedColumns.push(singlerow.fieldDesc);
       });
       this.reportingListWidget.next(returnData);
      }
    });
  }

  public getListdata(pageSize,pageIndex,widgetId:number,criteria:Criteria[]):void{
     this.widgetService.getListdata(String(pageSize),String(pageIndex),String(widgetId),criteria).subscribe(returndata=>{
      this.resultsLength = returndata.hits.total.value;
      returndata.hits.hits.forEach(element => {
        const source =element._source;

        const objectNumber = source.id;
        const obj = {ObjectNumber:objectNumber};

      const hdvs = source.hdvs;
      for(let j=0;j<this.displayedColumnsId.length;j++){
        const fieldDesc = this.displayedColumns[j+2];
        const fieldId = this.displayedColumnsId[j];
        obj[fieldDesc] = hdvs[fieldId].vc;
      }
      this.listData.push(obj);
      });
     this.dataSource = new MatTableDataSource<any>(this.listData);
    });
  }

  getServerData(event):PageEvent {
    console.log(event);
   this.pageSize = event.pageSize;
   this.pageIndex = event.pageIndex;
   this.getListdata(this.pageSize,this.pageIndex,this.widgetId,this.filterCriteria);
    return event;
 }


 emitEvtClick(): void {
  throw new Error('Method not implemented.');
 }
  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

}
