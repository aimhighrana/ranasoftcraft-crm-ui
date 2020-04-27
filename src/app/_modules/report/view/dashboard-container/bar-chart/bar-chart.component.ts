import { Component, OnInit, OnChanges } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BarChartWidget, Criteria } from '../../../_models/widget';

@Component({
  selector: 'pros-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GenericWidgetComponent implements OnInit,OnChanges {

  barWidget: BarChartWidget;
  chartName = '';


  countList:any[] = new Array();
  arrayBuckets :any[]

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public mbarChartLabels:string[] = new Array();
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)'
    }
  ];

  public barChartData:any[] = [
    {
      label: this.chartName,
      barThickness: 80,
      data: [0,0,0,0,0,0,0]
    },
  ];

  constructor(
    private widgetService : WidgetService
  ) {
    super();
  }

  ngOnChanges():void{
      this.mbarChartLabels = new Array();
       this.getBarChartData(this.widgetId,this.filterCriteria);
  }

  ngOnInit(): void {
    this.getHeaderMetaData();
   this.getBarChartMetadata();

  }


  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.chartName = returnData.widgetName;
    });
  }

  public getBarChartMetadata():void{
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata=>{
      this.barWidget = returndata;
    }, error=>{
      console.error(`Error : ${error}`);
    });
  }

  public getBarChartData(widgetId: number, critria: Criteria[]) : void{
    this.widgetService.getWidgetData(String(widgetId),critria).subscribe(returndata=>{
      this.arrayBuckets = returndata.aggregations['sterms#BAR_CHART'].buckets;
      this.arrayBuckets.forEach(bucket=>{
        const key = bucket.key;
        const count = bucket.doc_count;
        this.mbarChartLabels.push(key);
        this.countList.push(count);
      })

   this.barChartData = [
           {
             label: this.chartName,
             barThickness: 80,
             data: this.countList
           },
         ];

    });
  }

  public randomize():void {
    const data = [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      (Math.random() * 100),
      Math.round(Math.random() * 100),
      (Math.random() * 100),
      Math.round(Math.random() * 100)];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
  }


  emitEvtClick(): void {
    throw new Error('Method not implemented.');
  }
  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

}
