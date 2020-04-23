import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';

@Component({
  selector: 'pros-stackedbar-chart',
  templateUrl: './stackedbar-chart.component.html',
  styleUrls: ['./stackedbar-chart.component.scss']
})
export class StackedbarChartComponent implements OnInit {

  constructor(private widgetService : WidgetService) { }

  @Input() widgetId:any;

  arrayBuckets :any[];
  xAxis1='MATL_TYPE';
  xAxis2='MATL_GROUP';
  listxAxis2 :any[]=new Array();
  mtl='';

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = new Array();
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors:Array<any> = [{
    backgroundColor: ['red', 'yellow', 'green', 'orange','pink']
 }];

    public barChartData: ChartDataSets[] =
     [
       { data: [0,0,0,0,0], label: 'Series A', stack: 'a' }
     ];

  ngOnInit(): void {
    this.getStackChartMetadata();
    this.getstackbarChartData();
  }

  public getStackChartMetadata():void{
    this.widgetService.getStackChartMetadata(this.widgetId).subscribe(returnData=>{

    });
  }

  public getstackbarChartData() : void{
    this.widgetService.getstackbarChartData().subscribe(returnData=>{
      console.log(returnData);
      this.arrayBuckets = returnData.aggregations.total_per_year.buckets
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

      for(let i=0;i<this.listxAxis2.length;i++){
        const singleobj= {} as any;
        singleobj.data=dataObj[this.listxAxis2[i]];
        singleobj.label=this.listxAxis2[i];
        singleobj.stack='a';
        singleobj.backgroundColor=this.barChartColors[0].backgroundColor[i];
        singleobj.borderColor=this.barChartColors[0].backgroundColor[i];
        this.barChartData.push(singleobj);
      }
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


}
