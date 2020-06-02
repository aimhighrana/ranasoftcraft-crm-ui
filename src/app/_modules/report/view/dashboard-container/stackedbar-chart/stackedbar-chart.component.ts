import { Component, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { ChartOptions, ChartLegendLabelItem } from 'chart.js';
import { Label, BaseChartDirective } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { StackBarChartWidget, Criteria, WidgetHeader, BlockType, ConditionOperator, ChartLegend } from '../../../_models/widget';
import { ReportService } from '../../../_service/report.service';
import   ChartDataLables from 'chartjs-plugin-datalabels';

@Component({
  selector: 'pros-stackedbar-chart',
  templateUrl: './stackedbar-chart.component.html',
  styleUrls: ['./stackedbar-chart.component.scss']
})
export class StackedbarChartComponent extends GenericWidgetComponent implements OnInit ,OnChanges, OnDestroy{

  orientation = 'bar';
  stackBarWidget : BehaviorSubject<StackBarChartWidget> = new BehaviorSubject<StackBarChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  stackBardata : BehaviorSubject<any> = new BehaviorSubject<any>(null);
  stackbarLegend : ChartLegend[] = [];
  stachbarAxis: ChartLegend[] = [];
  public codeTextaxis1 ={} as any;
  public codeTextaxis2 ={} as any;
   dataObj = new Object();
   labels : string[] = new Array();
  arrayBuckets :any[];
  listxAxis2 :any[]=new Array();
  barChartLabels: Label[] = new Array();
  barChartColors:Array<any> = [{backgroundColor: ['red', 'yellow', 'green', 'orange','pink']}];
  barChartData: any[] =[{ data: [0,0,0,0,0], label: 'Loading..', stack: 'a' }];
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false,
      onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
        // call protype of stacked bar chart componenet
        this.legendClick(legendItem);
      }
    },
    onClick: (event?: MouseEvent, activeElements?: Array<{}>) =>{

      this.stackClickFilter(event, activeElements);
    },
    plugins: {
      datalabels: {
        display: false
      }
    },
    scales : {
      xAxes : [
        {
          display : true
        }
      ],
      yAxes : [
        {
          display : true
        }
      ]
    }
  };
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor(
    private widgetService : WidgetService,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.stackBarWidget.complete();
    this.stackBarWidget.unsubscribe();
  }
  ngOnChanges():void{
    this.stackBarWidget.next(this.stackBarWidget.getValue());
  }

  ngOnInit(): void {
    this.getStackChartMetadata();
    this.getHeaderMetaData();
    this.stackBarWidget.subscribe(res=>{
      if(res){
        // reset while filter applied
        this.stackbarLegend = [];
        this.stachbarAxis = [];
        this.barChartLabels = new Array();
        this.listxAxis2 = new Array();
        this.barChartData = [{ data: [0,0,0,0,0], label: 'Loading..', stack: 'a',  barThickness: 'flex' }];
        this.getstackbarChartData(this.widgetId,this.filterCriteria);
        this.stackBardata.subscribe(data=>{
          if(data && this.barChartData.length=== 0){
            if(Object.keys(this.codeTextaxis1).length === 0 && (this.stackBarWidget.getValue().groupByIdMetaData.picklist === '1' || this.stackBarWidget.getValue().groupByIdMetaData.picklist === '37')){
              this.getFieldsMetadaDescaxis1(this.labels,this.stackBarWidget.getValue().groupById);
            }else{
              this.updateLabelsaxis1();
            }
            if(Object.keys(this.codeTextaxis2).length === 0 && (this.stackBarWidget.getValue().fieldIdMetaData.picklist === '1' || this.stackBarWidget.getValue().fieldIdMetaData.picklist === '37')){
              this.getFieldsMetadaDescaxis2(this.listxAxis2,this.stackBarWidget.getValue().fieldId);
            }else{
              this.updateLabelsaxis2();
            }
        }
        });
      }
    });

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
         this.getBarConfigurationData();
         }
        }, error=>{
          console.error(`Error : ${error}`);
      });
  }

  public getBarConfigurationData() : void {
     // bar orientation based on orientation value

     this.orientation = this.stackBarWidget.getValue().orientation === 'VERTICAL' ? 'bar' : 'horizontalBar';

     // if showLegend flag will be true it show legend on Stacked bar widget
     if (this.stackBarWidget.getValue().isEnableLegend) {
       this.barChartOptions.legend= {
         display: true,
         position: this.stackBarWidget.getValue().legendPosition,
         onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
          // call protype of stacked bar chart componenet
          this.legendClick(legendItem);
        }
       }
     }
     // if showCountOnStack flag will be true it show datalables on stack and position of datalables also configurable
     if (this.stackBarWidget.getValue().isEnableDatalabels) {
       this.barChartOptions.plugins = {
        ChartDataLables,
         datalabels: {
           align:  this.stackBarWidget.getValue().datalabelsPosition,
           anchor: this.stackBarWidget.getValue().anchorPosition
         }
       }
     }
      // show axis labels
      this.barChartOptions.scales = {
        xAxes: [{
          scaleLabel: {
            display : true,
            labelString: this.stackBarWidget.getValue().xAxisLabel,
          }
        }],
        yAxes: [{
          scaleLabel: {
            display : true,
           labelString: this.stackBarWidget.getValue().yAxisLabel,
          }
        }]
      }
  }

  public getstackbarChartData(widgetId:number,criteria:Criteria[]) : void{
    this.widgetService.getWidgetData(String(widgetId),criteria).subscribe(returnData=>{
      this.arrayBuckets =  returnData.aggregations['composite#STACKED_BAR_CHART'].buckets;
       this.dataObj = new Object();
      this.arrayBuckets.forEach(singleBucket=>{
        if(this.barChartLabels.indexOf(singleBucket.key[this.stackBarWidget.getValue().groupById]) === -1){
          this.barChartLabels.push(singleBucket.key[this.stackBarWidget.getValue().groupById]);
          this.stachbarAxis.push({legendIndex: this.stachbarAxis.length,code:singleBucket.key[this.stackBarWidget.getValue().groupById],text: singleBucket.key[this.stackBarWidget.getValue().groupById]});
          if(singleBucket.key[this.stackBarWidget.getValue().groupById] !== '' && this.labels.indexOf(singleBucket.key[this.stackBarWidget.getValue().groupById]) === -1){
            this.labels.push(singleBucket.key[this.stackBarWidget.getValue().groupById]);
          }
        }
        if(this.listxAxis2.indexOf(singleBucket.key[this.stackBarWidget.getValue().fieldId]) === -1){
          const mtl = singleBucket.key[this.stackBarWidget.getValue().fieldId];
          const arr:any[]=[0];
          this.dataObj[mtl]=arr;
          this.listxAxis2.push(mtl);
          this.stackbarLegend.push({code: mtl,legendIndex:this.stackbarLegend.length,text:mtl})
        }
      });

      this.arrayBuckets.forEach(singleBucket=>{
        const xval1 = singleBucket.key[this.stackBarWidget.getValue().groupById];
        const xval2 = singleBucket.key[this.stackBarWidget.getValue().fieldId];
          const arr=  this.dataObj[xval2];
          const xpos1 = this.barChartLabels.indexOf(xval1);
          const count = singleBucket.doc_count;
          arr[xpos1] = count;
          this.dataObj[Number(xval2)] = arr;
      });

      this.barChartData.splice(0,1);
      this.stackBardata.next(returnData);
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
    const clickedLegend =  this.stackbarLegend[legendItem.datasetIndex] ? this.stackbarLegend[legendItem.datasetIndex].code : '';
    if(clickedLegend === '') {
      return false;
    }
    const fieldId = this.stackBarWidget.getValue().fieldId;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);
      if(appliedFilters.length >0) {
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLegend);
        if(cri.length ===0) {
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

  getFieldsMetadaDescaxis1(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res=>{
      res.forEach(data=>{
        this.codeTextaxis1[data.CODE] =data.TEXT;
      });
      this.updateLabelsaxis1();
    });
  }

  updateLabelsaxis1():void{
    for(let i=0;i<this.barChartLabels.length;i++){
      const lbl = this.barChartLabels[i] as any;
      this.barChartLabels[i] = this.codeTextaxis1[lbl] ? this.codeTextaxis1[lbl] : lbl;
    }

  }


  getFieldsMetadaDescaxis2(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res=>{
      res.forEach(data=>{
        this.codeTextaxis2[data.CODE] =data.TEXT;
      });
      this.updateLabelsaxis2();
    });
  }

  updateLabelsaxis2():void{
    this.listxAxis2.forEach(singleLis=>{
        const singleobj= {} as any;
        singleobj.data=this.dataObj[singleLis];
        if(singleLis) {
          singleobj.label=this.codeTextaxis2[singleLis] !== undefined ?this.codeTextaxis2[singleLis]:singleLis;
        } else {
          singleobj.label= singleLis;
        }
        singleobj.fieldCode = singleLis;
        singleobj.stack='a';
        singleobj.backgroundColor=this.getRandomColor();
        singleobj.borderColor=this.getRandomColor();


        this.barChartData.push(singleobj);
      });
  }

  /**
   * Aftre click on chart stack
   */
  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
     if(this.chart && activeElements.length>0) {
      const option = this.chart.chart.getElementAtEvent(event) as any;
      const xval1Index = (option[0])._datasetIndex;
      const xval2Index = (option[0])._index;

      const xvalCode1 = this.stackbarLegend[xval1Index] ? this.stackbarLegend[xval1Index].code : null;
      const xvalCode2 = this.stachbarAxis[xval2Index] ? this.stachbarAxis[xval2Index].code : null;
      if(xvalCode1 && xvalCode2) {
        let fieldId = this.stackBarWidget.getValue().fieldId;
        let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
        this.removeOldFilterCriteria(appliedFilters);
          // for xaxis 1
          if(appliedFilters.length >0) {
            const cri = appliedFilters.filter(fill => fill.conditionFieldValue === xvalCode1);
            if(cri.length ===0) {
              const critera1: Criteria = new Criteria();
              critera1.fieldId = fieldId;
              critera1.conditionFieldId = fieldId;
              critera1.conditionFieldValue = xvalCode1;
              critera1.blockType = BlockType.COND;
              critera1.conditionOperator = ConditionOperator.EQUAL;
              appliedFilters.push(critera1);
            }
          } else {
            appliedFilters = [];
            const critera1: Criteria = new Criteria();
            critera1.fieldId = fieldId;
            critera1.conditionFieldId = fieldId
            critera1.conditionFieldValue = xvalCode1;
            critera1.blockType = BlockType.COND;
            critera1.conditionOperator = ConditionOperator.EQUAL;
            appliedFilters.push(critera1);
          }
          appliedFilters.forEach(app => this.filterCriteria.push(app));
          fieldId = this.stackBarWidget.getValue().groupById;
          appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
          this.removeOldFilterCriteria(appliedFilters);
          // for xaxis2
          if(appliedFilters.length >0) {
            const cri = appliedFilters.filter(fill => fill.conditionFieldValue === xvalCode2);
            if(cri.length ===0) {
              const critera1: Criteria = new Criteria();
              critera1.fieldId = fieldId;
              critera1.conditionFieldId = fieldId;
              critera1.conditionFieldValue = xvalCode2;
              critera1.blockType = BlockType.COND;
              critera1.conditionOperator = ConditionOperator.EQUAL;
              appliedFilters.push(critera1);
            }
          } else {
            appliedFilters = [];
            const critera1: Criteria = new Criteria();
            critera1.fieldId = fieldId;
            critera1.conditionFieldId = fieldId
            critera1.conditionFieldValue = xvalCode2;
            critera1.blockType = BlockType.COND;
            critera1.conditionOperator = ConditionOperator.EQUAL;
            appliedFilters.push(critera1);
          }
          appliedFilters.forEach(app => this.filterCriteria.push(app));
          this.emitEvtFilterCriteria(this.filterCriteria);
      }
    }
  }

  downloadCSV():void{
    const excelData = [];
    this.arrayBuckets.forEach(singleBucket=>{
      const obj = {};
      obj[this.stackBarWidget.getValue().fieldId] = singleBucket.key[this.stackBarWidget.getValue().fieldId];
      obj[this.stackBarWidget.getValue().groupById] = singleBucket.key[this.stackBarWidget.getValue().groupById];
      obj[this.stackBarWidget.getValue().aggregationOperator] = singleBucket.doc_count;
      excelData.push(obj)
    });
    this.widgetService.downloadCSV('StackBar-Chart',excelData);
  }

  downloadImage(){
      this.widgetService.downloadImage(this.chart.toBase64Image(),'StackBar-Chart.png');
  }

  emitEvtFilterCriteria(critera: Criteria[]): void {
    this.evtFilterCriteria.emit(critera);
  }


}
