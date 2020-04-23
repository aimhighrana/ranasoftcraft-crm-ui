import { Component, OnInit, Input } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';

@Component({
  selector: 'pros-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {


 // @Output() eventClicked = new EventEmitter();

  constructor(private widgetService : WidgetService) { }


  @Input() chartName = 'Company1';
  @Input() backgroundColor = 'rgba(105,159,177,0.2)';
  @Input() borderColor = 'rgba(105,159,177,1)';
  @Input() pointBackgroundColor = 'rgba(105,159,177,1)';
  @Input() pointBorderColor = '#fafafa';
  @Input() pointHoverBackgroundColor = '#fafafa';
  @Input() pointHoverBorderColor = 'rgba(105,159,177)';
  @Input() barThickness :any = 80;
  @Input() widgetId:any;

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
      backgroundColor: this.backgroundColor,
      borderColor: this.borderColor,
      pointBackgroundColor: this.pointBackgroundColor,
      pointBorderColor: this.pointBorderColor,
      pointHoverBackgroundColor: this.pointHoverBackgroundColor,
      pointHoverBorderColor: this.pointBorderColor
    }
  ];

  public barChartData:any[] = [
    {
      label: this.chartName,
      barThickness: this.barThickness,
      data: [0,0,0,0,0,0,0]
    },
  ];

  ngOnInit(): void {
    this.getBarChartMetadata();
    this.getBarChartData();
  }

  public getBarChartMetadata():void{
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata=>{

    });
  }

  public getBarChartData() : void{
    this.widgetService.getBarChartData().subscribe(returndata=>{
      console.log(returndata);
      // this.mbarChartLabels = data.MRP;


      this.arrayBuckets = returndata.aggregations.total_per_year.buckets
      this.arrayBuckets.forEach(bucket=>{
        const key = bucket.key;
        const count = bucket.doc_count;
        this.mbarChartLabels.push(key);
        this.countList.push(count);
      })

   this.barChartData = [
           {
             label: this.chartName,
             barThickness: this.barThickness,
             data: this.countList
           },
         ];

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

}
