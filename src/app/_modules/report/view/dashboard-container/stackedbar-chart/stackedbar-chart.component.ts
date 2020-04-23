import { Component, OnInit, OnChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { StackBarChartWidget, Criteria } from '../../../_models/widget';

@Component({
  selector: 'pros-stackedbar-chart',
  templateUrl: './stackedbar-chart.component.html',
  styleUrls: ['./stackedbar-chart.component.scss']
})
export class StackedbarChartComponent extends GenericWidgetComponent implements OnInit ,OnChanges{


  stackBarWidget : BehaviorSubject<StackBarChartWidget> = new BehaviorSubject<StackBarChartWidget>(null);

  constructor(
    private widgetService : WidgetService
  ) {
    super();
  }

  arrayBuckets :any[];
  xAxis1='';
  xAxis2='';
  listxAxis2 :any[]=new Array();
  mtl='';

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = new Array();
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  headerDesc='';
  public barChartColors:Array<any> = [{
    backgroundColor: ['red', 'yellow', 'green', 'orange','pink']
 }];

  public barChartData: ChartDataSets[] =
    [
      { data: [0,0,0,0,0], label: 'Series A', stack: 'a' }
    ];

ngOnChanges():void{
  this.stackBarWidget.subscribe(res=>{
    if(res){
      this.getstackbarChartData(this.widgetId,this.filterCriteria);
    }
  });
}

  ngOnInit(): void {
    this.getStackChartMetadata();
    this.getHeaderMetaData();
  }

  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.headerDesc = returnData.widgetName;
    });
  }

  public getStackChartMetadata():void{
    this.widgetService.getStackChartMetadata(this.widgetId).subscribe(returnData=>{
      console.log(returnData);
      if(returnData !== undefined && Object.keys(returnData).length>0){
          this.xAxis2 = returnData.fieldId;
          this.xAxis1= returnData.groupById
          this.stackBarWidget.next(returnData);
         }
        }, error=>{
          console.error(`Error : ${error}`);
      });
  }

  public getstackbarChartData(widgetId:number,criteria:Criteria[]) : void{
    this.widgetService.getWidgetData(String(widgetId),criteria).subscribe(returnData=>{
      console.log(returnData);
      this.arrayBuckets =  returnData.aggregations['composite#STACKED_BAR_CHART'].buckets;
      const dataObj = new Object();
      this.arrayBuckets.forEach(singleBucket=>{
        if(this.barChartLabels.indexOf(singleBucket.key[this.xAxis1]) === -1){
          this.barChartLabels.push(singleBucket.key[this.xAxis1]);
        }

        if(this.listxAxis2.indexOf(singleBucket.key[this.xAxis2]) === -1){
          this.mtl = singleBucket.key[this.xAxis2];
          const arr:any[]=[0];
          dataObj[this.mtl]=arr;
          this.listxAxis2.push(singleBucket.key[this.xAxis2]);
        }
      });

      this.arrayBuckets.forEach(singleBucket=>{
        const xval1 = singleBucket.key[this.xAxis1];
        const xval2 = singleBucket.key[this.xAxis2];
          const arr=  dataObj[xval2];
          const xpos1 = this.barChartLabels.indexOf(xval1);
          const count = singleBucket.doc_count;
          arr[xpos1] = count;
          dataObj[Number(xval2)] = arr;
      });

      this.listxAxis2.forEach(singleLis=>{
        const singleobj= {} as any;
        singleobj.data=dataObj[singleLis];
        singleobj.label=singleLis;
        singleobj.stack='a';
        singleobj.backgroundColor=this.getRandomColor();
        singleobj.borderColor=this.getRandomColor();
        this.barChartData.push(singleobj);
      });
      this.barChartData.splice(0,1);

    });
  }

     // events
   public chartClicked(e:any):void {
    console.log(e);
    // return this.eventClicked.emit(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
    // return this.eventClicked.emit(e);
  }

  public getRandomColor():string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  emitEvtClick(): void {
    throw new Error('Method not implemented.');
  }
  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }


}
