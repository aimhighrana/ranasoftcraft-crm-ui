import { Component, OnInit, OnChanges } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BarChartWidget, Criteria } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';
import { ReportService } from '../../../_service/report.service';

@Component({
  selector: 'pros-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GenericWidgetComponent implements OnInit,OnChanges {

  barWidget: BehaviorSubject<BarChartWidget> = new BehaviorSubject<BarChartWidget>(null);
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
  public fieldId = '';
  public codeText ={} as any;

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
    private widgetService : WidgetService,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnChanges():void{
      this.mbarChartLabels = new Array();
      this.countList = new Array();
      this.barWidget.subscribe(res=>{
        if(res){
          this.getBarChartData(this.widgetId,this.filterCriteria);
        }
      });
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
      this.fieldId = returndata.fieldId;
      this.barWidget.next(returndata);
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
      });

       // update barchartLabels
       if(Object.keys(this.codeText).length === 0){
        this.getFieldsMetadaDesc(this.mbarChartLabels,this.fieldId);
      }else{
        this.updateLabels();
      }

   this.barChartData = [
           {
             label: this.chartName,
             barThickness: 80,
             data: this.countList
           },
         ];

    });
  }

  getFieldsMetadaDesc(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res=>{
      res.forEach(data=>{
        this.codeText[data.CODE] =data.TEXT;
      });
      this.updateLabels();
    });
  }

  public updateLabels():void{
    for(let i=0;i<this.mbarChartLabels.length;i++){
      if(this.codeText[this.mbarChartLabels[i]] !== undefined && this.codeText[this.mbarChartLabels[i]] !== ''){
          this.mbarChartLabels[i] = this.codeText[this.mbarChartLabels[i]];
      }
    }
  }

  emitEvtClick(): void {
    throw new Error('Method not implemented.');
  }
  emitEvtFilterCriteria(): void {
    throw new Error('Method not implemented.');
  }

}
