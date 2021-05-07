import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { Count, Criteria, WidgetHeader } from '../../../_models/widget';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent extends GenericWidgetComponent implements OnInit,OnChanges,OnDestroy{

  countWidget : Count;
  constructor( private widgetService : WidgetService) {
    super();
  }

  widgetHeader: WidgetHeader = new WidgetHeader();
  count = 0;
  arrayBuckets :any[]

  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnChanges(changes: SimpleChanges):void{
    if (changes && changes.filterCriteria && changes.filterCriteria.previousValue !== changes.filterCriteria.currentValue) {
      this.getCountData(this.widgetId,this.filterCriteria);
    }
  }

  ngOnInit(): void {
    this.getCountMetadata();
    this.getHeaderMetaData();
  }

  public getHeaderMetaData():void{
    const HeaderMetadataSub = this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.widgetHeader = returnData;
    }, error=>{
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(HeaderMetadataSub);
  }

  public getCountMetadata():void{
    const CountMetadataSub = this.widgetService.getCountMetadata(this.widgetId).subscribe(returndata=>{
      this.countWidget = returndata;
    }, error=>{
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(CountMetadataSub);
  }

  public getCountData(widgetid:number,creiteria:Criteria[]):void{
    const widgetDataSub = this.widgetService.getWidgetData(String(widgetid),creiteria).subscribe(returndata=>{
      this.count = 0;
      const res = Object.keys(returndata.aggregations);
      if(res[0] === 'value_count#COUNT' || res[0] === 'scripted_metric#COUNT') {
        this.count  = returndata.aggregations[res[0]] ? returndata.aggregations[res[0]].value : 0;
      } else if(res[0] === 'sum#COUNT') {
        const sumCnt  = returndata.aggregations[res[0]] ? returndata.aggregations[res[0]].value : 0;
        this.count =  Math.round((sumCnt + Number.EPSILON)  * 100) / 100;
      } else {
        console.log('Something missing on count widget !!.');
      }
      this.widgetService.updateCount(this.count);
    }, error=>{
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(widgetDataSub);
  }

  emitEvtClick(): void {
    throw new Error('Method not implemented.');
  }
  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

}
