import { Component, OnInit, OnChanges } from '@angular/core';
import { ChartOptions, ChartDataSets, ChartLegendLabelItem } from 'chart.js';
import { Label } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { StackBarChartWidget, Criteria, WidgetHeader, BlockType, ConditionOperator } from '../../../_models/widget';

@Component({
  selector: 'pros-stackedbar-chart',
  templateUrl: './stackedbar-chart.component.html',
  styleUrls: ['./stackedbar-chart.component.scss']
})
export class StackedbarChartComponent extends GenericWidgetComponent implements OnInit ,OnChanges{

  stackBarWidget : BehaviorSubject<StackBarChartWidget> = new BehaviorSubject<StackBarChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  constructor(
    private widgetService : WidgetService
  ) {
    super();
  }

  arrayBuckets :any[];
  listxAxis2 :any[]=new Array();
  barChartLabels: Label[] = new Array();
  barChartColors:Array<any> = [{backgroundColor: ['red', 'yellow', 'green', 'orange','pink']}];
  barChartData: ChartDataSets[] =[{ data: [0,0,0,0,0], label: 'Loading..', stack: 'a' }];
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      position: 'top',
      onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
        // call protype of stacked bar chart componenet
        this.legendClick(legendItem);
      },
    }
  };
  ngOnChanges():void{
    this.stackBarWidget.subscribe(res=>{
      if(res){
        // reset while filter applied
        this.barChartLabels = new Array();
        this.listxAxis2 = new Array();
        this.barChartData = [{ data: [0,0,0,0,0], label: 'Loading..', stack: 'a' }];
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
      this.widgetHeader = returnData;
    },error=> console.error(`Error : ${error}`));
  }

  public getStackChartMetadata():void{
    this.widgetService.getStackChartMetadata(this.widgetId).subscribe(returnData=>{
      if(returnData){
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
        if(this.barChartLabels.indexOf(singleBucket.key[this.stackBarWidget.getValue().groupById]) === -1){
          this.barChartLabels.push(singleBucket.key[this.stackBarWidget.getValue().groupById]);
        }
        if(this.listxAxis2.indexOf(singleBucket.key[this.stackBarWidget.getValue().fieldId]) === -1){
          const mtl = singleBucket.key[this.stackBarWidget.getValue().fieldId];
          const arr:any[]=[0];
          dataObj[mtl]=arr;
          this.listxAxis2.push(singleBucket.key[this.stackBarWidget.getValue().fieldId]);
        }
      });

      this.arrayBuckets.forEach(singleBucket=>{
        const xval1 = singleBucket.key[this.stackBarWidget.getValue().groupById];
        const xval2 = singleBucket.key[this.stackBarWidget.getValue().fieldId];
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

  public getRandomColor():string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * After click on chart legend
   * legendItem
   */
  legendClick(legendItem: ChartLegendLabelItem) {
    const clickedLegend = legendItem.text;
    const fieldId = this.stackBarWidget.getValue().fieldId;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);
      if(appliedFilters.length >0) {
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLegend);
        if(cri.length >0) {
          appliedFilters.splice(appliedFilters.indexOf(cri[0]),1);
        } else {
          const critera1: Criteria = new Criteria();
          critera1.fieldId = fieldId;
          critera1.conditionFieldId = fieldId;
          critera1.conditionFieldValue = clickedLegend;
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          appliedFilters.push(critera1);
        }
      } else {
        appliedFilters = [];
        const critera1: Criteria = new Criteria();
        critera1.fieldId = fieldId;
        critera1.conditionFieldId = fieldId
        critera1.conditionFieldValue = clickedLegend;
        critera1.blockType = BlockType.COND;
        critera1.conditionOperator = ConditionOperator.EQUAL;
        appliedFilters.push(critera1);
      }
      appliedFilters.forEach(app => this.filterCriteria.push(app));
      this.emitEvtFilterCriteria(this.filterCriteria);
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
