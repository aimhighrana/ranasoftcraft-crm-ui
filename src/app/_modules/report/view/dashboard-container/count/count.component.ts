import { Component, OnInit, OnChanges } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { Count, Criteria } from '../../../_models/widget';

@Component({
  selector: 'pros-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent extends GenericWidgetComponent implements OnInit,OnChanges{

  countWidget : Count;
  constructor( private widgetService : WidgetService) {
    super();
  }
  headerDesc='';
  count = 0;
  arrayBuckets :any[]


  ngOnChanges():void{
    this.getCountData(this.widgetId,this.filterCriteria);
  }

  ngOnInit(): void {
    this.getCountMetadata();
    this.getHeaderMetaData();
  }

  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.headerDesc = returnData.widgetName;
    });
  }

  public getCountMetadata():void{
    this.widgetService.getCountMetadata(this.widgetId).subscribe(returndata=>{
      this.countWidget = returndata;
    }, error=>{
      console.error(`Error : ${error}`);
    });
  }

  public getCountData(widgetid:number,creiteria:Criteria[]):void{
    this.widgetService.getWidgetData(String(widgetid),creiteria).subscribe(returndata=>{
      this.count = 0;
      const res = Object.keys(returndata.aggregations);
      if(res[0] === 'sterms#COUNT' || res[0] === 'lterms#COUNT' || res[0] === 'dterms#COUNT') {
        this.arrayBuckets  = returndata.aggregations[res[0]] ? returndata.aggregations[res[0]].buckets : [];
        this.arrayBuckets.forEach(bucket=>{
          const key = bucket.key;
          const count = bucket.doc_count;
        this.count += count ;
      });
      } else if(res[0] === 'sum#COUNT') {
        this.arrayBuckets  = returndata.aggregations[res[0]] ? returndata.aggregations[res[0]].value : [];
        this.count =  Math.round((this.count + Number.EPSILON)  * 100) / 100;
      } else {
        console.log('Something missing on count widget !!.');
      }

    this.widgetService.updateCount(this.count);
  });
  }

  emitEvtClick(): void {
    throw new Error('Method not implemented.');
  }
  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

}
