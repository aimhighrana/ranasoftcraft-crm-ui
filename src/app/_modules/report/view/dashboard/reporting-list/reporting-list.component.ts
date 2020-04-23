import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { WidgetService } from 'src/app/_services/widgets/widget.service';

@Component({
  selector: 'pros-reporting-list',
  templateUrl: './reporting-list.component.html',
  styleUrls: ['./reporting-list.component.scss']
})
export class ReportingListComponent implements OnInit {
  public userList : any[];
  public showList =  true;
  displayedColumns: string[] = [ 'star','ObjectNumber', 'Material Type', 'Material Group', 'Material Description','Manufacturer'];
  resultsLength : any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  dataSource : MatTableDataSource<any> = [] as any;
  pageSize : 10;
  pageIndex:0;
  sortingField = '';
  sortingDir = '';
  listData :any[]=new Array();
  displayedColumnsId :string[]=['MATL_TYPE','MATL_GROUP','MATL_DESC','MANUFACNAME'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() widgetId:any;

  constructor(public widgetService : WidgetService) { }

  ngOnInit(): void {
    this.resultsLength =200;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getListTableMetadata();
    this.getListdata(10,0);
  }

  public getListTableMetadata():void{
    this.widgetService.getListTableMetadata(this.widgetId).subscribe(returnData=>{

    });
  }

  public getListdata(pageSize,pageIndex):void{
     this.widgetService.getListdata().subscribe(returndata=>{

     const jsondata = JSON.parse(returndata);
      jsondata.hits.hits.array.forEach(element => {
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
   this.getListdata(this.pageSize,this.pageIndex);
    return event;
 }

}
