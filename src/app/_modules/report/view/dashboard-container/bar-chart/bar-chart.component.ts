import { Component, OnInit, OnChanges } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BarChartWidget, Criteria, WidgetHeader, ChartLegend, ConditionOperator, BlockType } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';
import { ReportService } from '../../../_service/report.service';
import { ChartOptions, ChartTooltipItem, ChartData } from 'chart.js';

@Component({
  selector: 'pros-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GenericWidgetComponent implements OnInit,OnChanges {

  barWidget: BehaviorSubject<BarChartWidget> = new BehaviorSubject<BarChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  chartLegend : ChartLegend[] = [];
  lablels:string[] = [];

  public barChartOptions:ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks:{
        label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
          return `${tooltipItem.value}`;
        }
      },
      displayColors: false
    },
    onClick: (event?: MouseEvent, activeElements?: Array<{}>) =>{
      this.stackClickFilter(event, activeElements);
    }
  };

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
      label: 'Loding..',
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
      this.lablels = [];
      this.chartLegend = [];
      this.barWidget.next(this.barWidget.getValue());
  }

  ngOnInit(): void {
    this.getBarChartMetadata();
    this.getHeaderMetaData();
    this.barWidget.subscribe(res=>{
      if(res) {
        this.getBarChartData(this.widgetId,this.filterCriteria);
      }
    });
  }


  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.widgetHeader = returnData;
    },error=> console.error(`Error : ${error}`));
  }

  public getBarChartMetadata():void{
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata=>{
      this.barWidget.next(returndata);
    }, error=>{
      console.error(`Error : ${error}`);
    });
  }

  public getBarChartData(widgetId: number, critria: Criteria[]) : void{
    this.widgetService.getWidgetData(String(widgetId),critria).subscribe(returndata=>{
      const arrayBuckets = returndata.aggregations['sterms#BAR_CHART'].buckets;
      const dataSet: string[] = [];
      arrayBuckets.forEach(bucket=>{
        this.lablels.push(bucket.key);
        dataSet.push(bucket.doc_count);
      });
       // update barchartLabels
      if(this.chartLegend.length === 0){
        this.getFieldsMetadaDesc(this.lablels, this.barWidget.getValue().fieldId);
      }else{
        this.lablels = this.chartLegend.map(map => map.text);
      }
      this.barChartData = [{
          label: this.widgetHeader.desc,
          barThickness: 80,
          data: dataSet
      }];
    });
  }

  /**
   * Http call for get description of fields code
   *
   */
  getFieldsMetadaDesc(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res=>{
      this.lablels.forEach(cod=>{
        const hasData = res.filter(fill=> fill.CODE === cod);
        let chartLegend: ChartLegend;
        if(hasData && hasData.length) {
          chartLegend = {text: hasData[0].TEXT,code: hasData[0].CODE,legendIndex: this.chartLegend.length};
        } else {
          chartLegend = {text: cod,code:cod,legendIndex: this.chartLegend.length};
        }
        this.chartLegend.push(chartLegend);
      });
      this.lablels = this.chartLegend.map(map => map.text);
    });
  }

  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
    if(activeElements && activeElements.length) {
      const clickedIndex = (activeElements[0])._datasetIndex;
      const clickedLagend = this.chartLegend[clickedIndex];
      const fieldId = this.barWidget.getValue().fieldId;
      let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
      this.removeOldFilterCriteria(appliedFilters);
        if(appliedFilters.length >0) {
          const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLagend.code);
          if(cri.length ===0) {
            const critera1: Criteria = new Criteria();
            critera1.fieldId = fieldId;
            critera1.conditionFieldId = fieldId;
            critera1.conditionFieldValue = clickedLagend.code;
            critera1.blockType = BlockType.COND;
            critera1.conditionOperator = ConditionOperator.EQUAL;
            appliedFilters.push(critera1);
          }
        } else {
          appliedFilters = [];
          const critera1: Criteria = new Criteria();
          critera1.fieldId = fieldId;
          critera1.conditionFieldId = fieldId
          critera1.conditionFieldValue = clickedLagend.code;
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          appliedFilters.push(critera1);
        }
        appliedFilters.forEach(app => this.filterCriteria.push(app));
        this.emitEvtFilterCriteria(this.filterCriteria);
    }
  }

  /**
   * Remove old filter criteria for field
   * selectedOptions as parameter
   */
  removeOldFilterCriteria(selectedOptions: Criteria[]) {
    selectedOptions.forEach(option=>{
      this.filterCriteria.splice(this.filterCriteria.indexOf(option), 1);
    });
  }


  emitEvtFilterCriteria(critera: Criteria[]): void {
    this.evtFilterCriteria.emit(critera);
  }

}
