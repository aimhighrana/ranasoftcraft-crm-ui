import { Component, OnInit, OnChanges, OnDestroy, ViewChild, LOCALE_ID, Inject, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartLegendLabelItem } from 'chart.js';
import { Label, BaseChartDirective } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StackBarChartWidget, Criteria, WidgetHeader, BlockType, ConditionOperator, ChartLegend, Orientation, OrderWith, WidgetColorPalette, DisplayCriteria, WidgetType, AlignPosition } from '../../../_models/widget';
import { ReportService } from '../../../_service/report.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';

@Component({
  selector: 'pros-stackedbar-chart',
  templateUrl: './stackedbar-chart.component.html',
  styleUrls: ['./stackedbar-chart.component.scss']
})
export class StackedbarChartComponent extends GenericWidgetComponent implements OnInit ,OnChanges, OnDestroy{

  displayCriteriaOptions = [
    {
      key: DisplayCriteria.TEXT,
      value: 'Text'
    },
    {
      key: DisplayCriteria.CODE,
      value: 'Code'
    },
    {
      key: DisplayCriteria.CODE_TEXT,
      value: 'Code and Text'
    }
  ];
  displayCriteriaOption = this.displayCriteriaOptions[0];
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
  barChartData: any[] =[{ data: [0,0,0,0,0], label: 'Loading..', stack: 'a' }];
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          scaleLabel:{
            display : false
          }
        }
      ],
      yAxes : [
        {
          scaleLabel:{
            display : false
          }
        }
      ]
    }
  };
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  returnData: any;
  subscriptions: Subscription[] = [];

  constructor(
    private widgetService : WidgetService,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog
  ) {
    super(matDialog);
  }

  ngOnDestroy(): void {
    this.stackBarWidget.complete();
    this.stackBarWidget.unsubscribe();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
  ngOnChanges(changes: SimpleChanges):void{
    if (changes && changes.filterCriteria && changes.filterCriteria.currentValue !== changes.filterCriteria.currentValue.previousValue && !this.widgetHeader.isEnableGlobalFilter) {
      this.stackBarWidget.next(this.stackBarWidget.getValue());
    }

    if(changes && changes.boxSize && changes.boxSize.previousValue !== changes.boxSize.currentValue) {
      this.boxSize = changes.boxSize.currentValue;
    }
  }

  ngOnInit(): void {
    this.getStackChartMetadata();
    this.getHeaderMetaData();
    this.stackBarWidget.subscribe(res=>{
      if(res){
        this.resetChart();
        this.getstackbarChartData(this.widgetId,this.filterCriteria);
      }
    });

    this.stackBardata.subscribe(data=>{
      if(data && this.barChartData.length=== 0){
        if(Object.keys(this.codeTextaxis1).length === 0 && (this.stackBarWidget.getValue().groupByIdMetaData.picklist === '0' && (this.stackBarWidget.getValue().groupByIdMetaData.dataType === 'DATS' || this.stackBarWidget.getValue().groupByIdMetaData.dataType === 'DTMS'))) {
          this.getDateFieldsDesc1(this.stackBarWidget.getValue().groupById);
        } else if(Object.keys(this.codeTextaxis1).length === 0 && (this.stackBarWidget.getValue().groupByIdMetaData.picklist === '1' || this.stackBarWidget.getValue().groupByIdMetaData.picklist === '37' || this.stackBarWidget.getValue().groupByIdMetaData.picklist === '30')){
          this.getFieldsMetadaDescaxis1(this.stackBarWidget.getValue().groupById);
        } else if (Object.keys(this.codeTextaxis1).length === 0 && this.stackBarWidget.getValue().groupByIdMetaData.picklist === '0') {
          this.getFieldsMetadaDescaxis1ForNonFld(this.stackBarWidget.getValue().groupById);
        }
        else{
          this.updateLabelsaxis1();
        }

        if(Object.keys(this.codeTextaxis2).length === 0 && (this.stackBarWidget.getValue().fieldIdMetaData.picklist === '0' && (this.stackBarWidget.getValue().fieldIdMetaData.dataType === 'DATS' || this.stackBarWidget.getValue().fieldIdMetaData.dataType === 'DTMS'))) {
          this.getDateFieldsDesc2(this.stackBarWidget.getValue().fieldId);
        } else if(Object.keys(this.codeTextaxis2).length === 0 && this.stackBarWidget.getValue().fieldIdMetaData !=null && (this.stackBarWidget.getValue().fieldIdMetaData.picklist === '1' || this.stackBarWidget.getValue().fieldIdMetaData.picklist === '37' || this.stackBarWidget.getValue().fieldIdMetaData.picklist === '30')){
          this.getFieldsMetadaDescaxis2(this.stackBarWidget.getValue().fieldId);
        }else if(Object.keys(this.codeTextaxis2).length === 0 && this.stackBarWidget.getValue().fieldIdMetaData !=null && this.stackBarWidget.getValue().fieldIdMetaData.picklist === '0') {
          this.getFieldsMetadaDescaxis2Nondef(this.stackBarWidget.getValue().fieldId);
        } else{
          this.updateLabelsaxis2();
        }
    }else{
      this.updateLabelsaxis1();
    }

    // update chart after data sets change
    if(this.chart) {
      try{
        this.chart.update();
      }catch(ex){console.error(`Error : ${ex}`)}
    }

    });

    // after color defined update on widget
    const afterColorDefined = this.afterColorDefined.subscribe(res=>{
      if(res) {
        this.updateColorBasedOnDefined(res);
      }
    });
    this.subscriptions.push(afterColorDefined);

    const getDisplayCriteria = this.widgetService.getDisplayCriteria(this.widgetInfo.widgetId, this.widgetInfo.widgetType).subscribe(res => {
      this.displayCriteriaOption = this.displayCriteriaOptions.find(d => d.key === res.displayCriteria);
    }, error => {
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(getDisplayCriteria);
  }

  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.widgetHeader = returnData;
    },error=> console.error(`Error : ${error}`));
  }

  public getStackChartMetadata():void{
    this.widgetService.getStackChartMetadata(this.widgetId).subscribe(returnData=>{
      if(returnData){
        this.widgetColorPalette = returnData.widgetColorPalette;
          this.stackBarWidget.next(returnData);
         this.getBarConfigurationData();
         }
        }, error=>{
          console.error(`Error : ${error}`);
      });
  }

  public getBarConfigurationData() : void {
    // bar orientation based on orientation value
    this.orientation = this.stackBarWidget?.getValue()?.orientation === 'VERTICAL' ? 'bar' : 'horizontalBar';

    // if showLegend flag will be true it show legend on Stacked bar widget
    if (this.stackBarWidget.getValue().isEnableLegend) {
      this.barChartOptions.legend = {
        ...this.barChartOptions.legend,
        display: true,
        position: this.stackBarWidget.getValue().legendPosition,
      };
      if (this.chart) {
        this.chart.options.legend = this.barChartOptions.legend;
        this.chart.chart.options.legend = this.barChartOptions.legend;
      }
    }
    // if showCountOnStack flag will be true it show datalables on stack and position of datalables also configurable
    if (this.stackBarWidget.getValue().isEnableDatalabels) {
      this.barChartOptions.plugins.datalabels = {
        ...this.barChartOptions.plugins.datalabels,
        align: this.stackBarWidget.getValue().datalabelsPosition,
        anchor: this.stackBarWidget.getValue().datalabelsPosition,
        display: 'auto'
      };
      if (this.stackBarWidget.getValue().datalabelsPosition === AlignPosition.END) {
        // Datalabel was being cut off the screen when the height was small.
        this.barChartOptions.plugins.datalabels.offset = -4;
        this.barChartOptions.plugins.datalabels.padding = 0;
      }
      if (this.chart) {
        this.chart.options.plugins.datalabels = this.barChartOptions.plugins.datalabels;
        this.chart.chart.options.plugins.datalabels = this.barChartOptions.plugins.datalabels;
      }
    }
    // show axis labels and scales range
    this.setChartAxisAndScaleRange();
  }

  public getstackbarChartData(widgetId:number,criteria:Criteria[]) : void{
    this.widgetService.getWidgetData(String(widgetId),criteria).subscribe(returnData=>{
      this.returnData = returnData;
      this.updateChart(this.returnData);
    });
  }

  private resetChart() {
    // reset while filter applied
    this.stackbarLegend = [];
    this.stachbarAxis = [];
    this.barChartLabels = new Array();
    this.listxAxis2 = new Array();
    this.labels = [];
    this.codeTextaxis1 = {};
    this.codeTextaxis2 = {};
    this.barChartData = [{ data: [0,0,0,0,0], label: 'Loading..', stack: 'a',  barThickness: 'flex' }];
  }

  private updateChart(returnData) {
    const res = Object.keys(returnData.aggregations);
    this.arrayBuckets  = returnData.aggregations[res[0]] ? returnData.aggregations[res[0]].buckets : [];
     this.dataObj = new Object();
     this.labels = [];
     this.barChartLabels = new Array();
     // transform data before go for render
     this.arrayBuckets =  this.transformDataSets(this.arrayBuckets);
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
        this.dataObj[mtl === ''?this.stackBarWidget.value.blankValueAlias!==undefined?this.stackBarWidget.value.blankValueAlias:mtl:mtl]=arr;
        this.listxAxis2.push(mtl);
        this.stackbarLegend.push({code: mtl,legendIndex:this.stackbarLegend.length,text:mtl})
      }
    });

     // maintaining alias here
     this.stackbarLegend.forEach(legend=>{
      if(legend.code === ''){
        legend.code = this.stackBarWidget.value.blankValueAlias !== undefined?this.stackBarWidget.value.blankValueAlias:'';
      }
    });

    for(let i=0;i<this.listxAxis2.length;i++){
      if(this.listxAxis2[i] === ''){
        this.listxAxis2[i] = this.stackBarWidget.value.blankValueAlias !== undefined?this.stackBarWidget.value.blankValueAlias:'';
    }
    }

    if(Object.keys(this.dataObj).length!==0){
      this.arrayBuckets.forEach(singleBucket=>{
        const xval1 = singleBucket.key[this.stackBarWidget.getValue().groupById];
        let xval2 = singleBucket.key[this.stackBarWidget.getValue().fieldId];
        xval2 = xval2 === ''?this.stackBarWidget.value.blankValueAlias !== undefined?this.stackBarWidget.value.blankValueAlias:xval2:xval2;
          const arr=  this.dataObj[xval2] ? this.dataObj[xval2] : {};
          const xpos1 = this.barChartLabels.indexOf(xval1);
          const count = singleBucket.doc_count;
          arr[xpos1] = count;
          this.dataObj[xval2] = arr;
      });

      this.barChartData.splice(0,1);
    }
    this.stackBardata.next(returnData);
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
    let clickedLegend =  this.stackbarLegend[legendItem.datasetIndex] ? this.stackbarLegend[legendItem.datasetIndex].code : '';
    if(clickedLegend === this.stackBarWidget.value.blankValueAlias){
      clickedLegend ='';
    }
    const fieldId = this.stackBarWidget.getValue().fieldId;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);
      if(appliedFilters.length >0) {
        const res = appliedFilters.filter(fill=> fill.fieldId === fieldId && fill.widgetType === WidgetType.STACKED_BAR_CHART && this.widgetHeader.isEnableGlobalFilter);
        if(res.length !== 0) {
          res.forEach(val=> {
            val.conditionFieldValue = clickedLegend;
          })
        }
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLegend);
        if(cri.length ===0) {
          const critera1: Criteria = new Criteria();
          critera1.fieldId = fieldId;
          critera1.conditionFieldId = fieldId;
          critera1.conditionFieldValue = clickedLegend;
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          critera1.widgetType = WidgetType.STACKED_BAR_CHART;
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
        critera1.widgetType = WidgetType.STACKED_BAR_CHART;
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

  getFieldsMetadaDescaxis1ForNonFld(fieldId: string) {
    this.arrayBuckets.forEach(bucket=>{
      const key = bucket.key[fieldId];
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          valArray.push(this.checkTextCode(v));
        });
        const finalText = valArray.toString();
        if(finalText) {
          this.codeTextaxis1[key] = finalText;
        } else {
          this.codeTextaxis1[key] = key;
        }
      } else {
        this.codeTextaxis1[key] = key;
      }
    });
    this.updateLabelsaxis1();
  }

  getFieldsMetadaDescaxis1(fieldId: string) {
    this.arrayBuckets.forEach(bucket=>{
      const key = bucket.key[fieldId];
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val !== null) {
        const valArray = [];
        val.forEach(v=>{
          valArray.push(this.checkTextCode(v));
        });
        const finalText = valArray.toString();
        if(finalText) {
          this.codeTextaxis1[key] = finalText;
        } else {
          this.codeTextaxis1[key] = key;
        }
      } else {
        this.codeTextaxis1[key] = key;
      } if(fieldId === 'OVERDUE' || fieldId === 'FORWARDENABLED' || fieldId === 'TIME_TAKEN') {
        this.codeTextaxis1[key] = this.getFields(fieldId, key);
      }
    });
    this.updateLabelsaxis1();
  }

  getDateFieldsDesc1(fieldId: string){
    this.arrayBuckets.forEach(bucket=>{
      const key = bucket.key[fieldId];
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val !== null) {
        const valArray = [];
        val.forEach(v=>{
          valArray.push(this.checkTextCode(v));
        });
        const finalText = Number(valArray);
        if(finalText) {
          this.codeTextaxis1[key] = new Date(finalText).toLocaleDateString();
        } else {
          this.codeTextaxis1[key] = new Date(key).toLocaleDateString();
        }
      } else {
        this.codeTextaxis1[key] = new Date(key).toLocaleDateString();
      }
    });
    this.updateLabelsaxis1();
  }

  updateLabelsaxis1():void{
    for(let i=0;i<this.barChartLabels.length;i++){
      const lbl = this.barChartLabels[i] as any;
      this.barChartLabels[i] = this.codeTextaxis1[lbl] ? this.codeTextaxis1[lbl] : lbl;
    }


    if (this.stackBarWidget.getValue() !== null && this.stackBarWidget.getValue().dataSetSize) {
      this.barChartLabels = _.take(this.barChartLabels, this.stackBarWidget.getValue().dataSetSize);
    }
  }


  getFieldsMetadaDescaxis2Nondef(fieldId: string) {
    this.arrayBuckets.forEach(bucket=>{
      const key = bucket.key[fieldId];
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          valArray.push(this.checkTextCode(v));
          });
          const finalText = valArray.toString();
          if(finalText) {
            this.codeTextaxis2[key] = finalText;
          } else {
            this.codeTextaxis2[key] = key;
          }
      } else {
        this.codeTextaxis2[key] = key;
      }
    });
    this.updateLabelsaxis2();
  }

  getDateFieldsDesc2(fieldId: string) {
    let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
    locale = locale.toUpperCase();
    this.arrayBuckets.forEach(bucket=>{
      const key = bucket.key[fieldId];
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          valArray.push(this.checkTextCode(v));
          });
          const finalText = Number(valArray);
          if(finalText) {
            this.codeTextaxis2[key] = new Date(finalText).toLocaleDateString();
          } else {
            this.codeTextaxis2[key] = new Date(key).toLocaleDateString();
          }
      } else {
        this.codeTextaxis2[key] = new Date(key).toLocaleDateString();
      }
    });
    this.updateLabelsaxis2();
  }

  getFieldsMetadaDescaxis2(fieldId: string) {
    let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
    locale = locale.toUpperCase();
    this.arrayBuckets.forEach(bucket=>{
      const key = bucket.key[fieldId];
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          valArray.push(this.checkTextCode(v));
          });
          const finalText = valArray.toString();
          if(finalText) {
            this.codeTextaxis2[key] = finalText;
          } else {
            this.codeTextaxis2[key] = key;
          }
      } else {
        this.codeTextaxis2[key] = key;
      } if(fieldId === 'OVERDUE' || fieldId === 'FORWARDENABLED' || fieldId === 'TIME_TAKEN') {
        this.codeTextaxis2[key] = this.getFields(fieldId, key);
      }
    });
    this.updateLabelsaxis2();
  }

  updateLabelsaxis2():void{
    this.barChartData = [];
    this.listxAxis2.forEach(singleLis=>{
        const singleobj= {} as any;
        singleobj.data=this.dataObj[singleLis];
        if(singleLis) {
          singleobj.label=this.codeTextaxis2[singleLis] !== undefined &&  this.codeTextaxis2[singleLis] !== null?this.codeTextaxis2[singleLis]:singleLis;
        } else {
          singleobj.label= singleLis;
        }
        singleobj.fieldCode = singleLis;
        singleobj.stack='a';
        // singleobj.backgroundColor=this.getRandomColor();
        singleobj.backgroundColor=this.getUpdatedColorCode(singleobj.fieldCode);
        singleobj.borderColor=this.getRandomColor();


        this.barChartData.push(singleobj);
      });
      for(let i=0;i<this.barChartLabels.length;i++){
        const lbl = this.barChartLabels[i] as any;
        this.barChartLabels[i] = this.codeTextaxis1[lbl] ? this.codeTextaxis1[lbl] : lbl;
      }
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
            const res = appliedFilters.filter(fill => fill.fieldId === fieldId && fill.widgetType === WidgetType.STACKED_BAR_CHART && this.widgetHeader.isEnableGlobalFilter);
            if (res.length !== 0) {
              res.forEach(val => {
                val.conditionFieldValue = xvalCode1;
              })
            }
            const cri = appliedFilters.filter(fill => fill.conditionFieldValue === xvalCode1);
            if(cri.length ===0) {
              const critera1: Criteria = new Criteria();
              critera1.fieldId = fieldId;
              critera1.conditionFieldId = fieldId;
              critera1.conditionFieldValue = xvalCode1;
              critera1.blockType = BlockType.COND;
              critera1.conditionOperator = ConditionOperator.EQUAL;
              critera1.widgetType = WidgetType.STACKED_BAR_CHART;
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
            critera1.widgetType = WidgetType.STACKED_BAR_CHART;
            appliedFilters.push(critera1);
          }
          appliedFilters.forEach(app => this.filterCriteria.push(app));
          fieldId = this.stackBarWidget.getValue().groupById;
          appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
          this.removeOldFilterCriteria(appliedFilters);
          // for xaxis2
          if(appliedFilters.length >0) {
            const res = appliedFilters.filter(fill => fill.fieldId === fieldId && fill.widgetType === WidgetType.STACKED_BAR_CHART && this.widgetHeader.isEnableGlobalFilter);
            if (res.length !== 0) {
              res.forEach(val => {
                val.conditionFieldValue = xvalCode2;
              })
            }
            const cri = appliedFilters.filter(fill => fill.conditionFieldValue === xvalCode2);
            if(cri.length ===0) {
              const critera1: Criteria = new Criteria();
              critera1.fieldId = fieldId;
              critera1.conditionFieldId = fieldId;
              critera1.conditionFieldValue = xvalCode2;
              critera1.blockType = BlockType.COND;
              critera1.conditionOperator = ConditionOperator.EQUAL;
              critera1.widgetType = WidgetType.STACKED_BAR_CHART;
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
            critera1.widgetType = WidgetType.STACKED_BAR_CHART;
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
      obj[this.stackBarWidget.getValue().fieldIdMetaData ?this.stackBarWidget.getValue().fieldIdMetaData.fieldDescri : this.stackBarWidget.getValue().fieldId] = this.codeTextaxis2 ? this.codeTextaxis2[singleBucket.key[this.stackBarWidget.getValue().fieldId]] + '\t' : '';
      obj[this.stackBarWidget.getValue().groupByIdMetaData ?this.stackBarWidget.getValue().groupByIdMetaData.fieldDescri : this.stackBarWidget.getValue().groupById] = this.codeTextaxis1 ? this.codeTextaxis1[singleBucket.key[this.stackBarWidget.getValue().groupById]] + '\t' : '';
      obj[this.stackBarWidget.getValue().aggregationOperator ? this.stackBarWidget.getValue().aggregationOperator === 'GROUPBY' ? 'Value' : this.stackBarWidget.getValue().aggregationOperator : this.stackBarWidget.getValue().aggregationOperator] = singleBucket.doc_count;
      excelData.push(obj);
    });
    this.widgetService.downloadCSV('StackBar-Chart',excelData);
  }

  downloadImage(){
      this.widgetService.downloadImage(this.chart.toBase64Image(),'StackBar-Chart.png');
  }

  emitEvtFilterCriteria(critera: Criteria[]): void {
    this.evtFilterCriteria.emit(critera);
  }

  /**
   * Before render chart transformation
   * @param resBuckets response from server
   */
  transformDataSets(resBuckets: any[]): any[] {
    // ckeck configuration
    let finalDataSet: any[] = [];
    const groupBY = this.stackBarWidget.getValue().groupById;
    // perform sort
    const orderWith = this.stackBarWidget.getValue().orderWith;
    if(orderWith) {
      if(orderWith === OrderWith.ROW_ASC) {
        resBuckets = this.sortByRow(groupBY,resBuckets);
      } else if(orderWith === OrderWith.ROW_DESC) {
        resBuckets = this.sortByRow(groupBY,resBuckets);
        resBuckets.reverse();
      } else if(orderWith === OrderWith.COL_ASC) {
        resBuckets = this.sortByColumnAsc(groupBY,resBuckets);
      } else if(orderWith === OrderWith.COL_DESC) {
        resBuckets = this.sortByColumnDesc(groupBY,resBuckets);
      }
    }
    if (this.stackBarWidget.getValue().scaleFrom !== null && this.stackBarWidget.getValue().scaleFrom !== undefined
      && this.stackBarWidget.getValue().scaleTo !== null && this.stackBarWidget.getValue().scaleTo !== undefined
      && this.stackBarWidget.getValue().stepSize !== null && this.stackBarWidget.getValue().stepSize !== undefined) {

      const insideRange = resBuckets.filter(bucket => {
        if (this.stackBarWidget.getValue().scaleFrom <= bucket.doc_count && this.stackBarWidget.getValue().scaleTo >= bucket.doc_count) {
          return bucket;
        }
      });
      finalDataSet = insideRange;
    } else {
      finalDataSet = resBuckets;
    }
    return finalDataSet;
  }

  /**
   * Use for set scale range and axis labels
   */
  setChartAxisAndScaleRange() {
    if(this.stackBarWidget.getValue().scaleFrom !== null && this.stackBarWidget.getValue().scaleFrom !== undefined
      && this.stackBarWidget.getValue().scaleTo !== null && this.stackBarWidget.getValue().scaleTo !== undefined
      && this.stackBarWidget.getValue().stepSize !== null && this.stackBarWidget.getValue().stepSize !== undefined) {
        const ticks = {min:this.stackBarWidget.getValue().scaleFrom, max:this.stackBarWidget.getValue().scaleTo, stepSize:this.stackBarWidget.getValue().stepSize};
        if(this.stackBarWidget?.getValue()?.orientation === Orientation.HORIZONTAL) {
          this.barChartOptions.scales = {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.stackBarWidget.getValue().xAxisLabel ? this.stackBarWidget.getValue().xAxisLabel : ''
              },ticks
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.stackBarWidget.getValue().yAxisLabel ? this.stackBarWidget.getValue().yAxisLabel : ''
              },
              ticks : {
                padding: this.stackBarWidget.getValue().isEnableDatalabels && (this.stackBarWidget.getValue().datalabelsPosition === 'start' || this.stackBarWidget.getValue().datalabelsPosition === 'center') ?  40 : 0
              }
            }]
          }
        } else {
          this.barChartOptions.scales = {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.stackBarWidget.getValue().xAxisLabel ? this.stackBarWidget.getValue().xAxisLabel : ''
              },
              ticks : {
                padding: this.stackBarWidget.getValue().isEnableDatalabels && (this.stackBarWidget.getValue().datalabelsPosition === 'start' || this.stackBarWidget.getValue().datalabelsPosition === 'center') ?  20 : 0
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.stackBarWidget.getValue().yAxisLabel ? this.stackBarWidget.getValue().yAxisLabel : ''
              },ticks
            }]
          }
        }
    } else {
      this.barChartOptions.scales = {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.stackBarWidget.getValue().xAxisLabel ? this.stackBarWidget.getValue().xAxisLabel : ''
          },
          ticks: {
            padding: this.stackBarWidget.getValue().isEnableDatalabels && (this.stackBarWidget.getValue().orientation === Orientation.VERTICAL) && (this.stackBarWidget.getValue().datalabelsPosition === 'start' || this.stackBarWidget.getValue().datalabelsPosition === 'center') ? 20 : 0
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.stackBarWidget.getValue().yAxisLabel ? this.stackBarWidget.getValue().yAxisLabel : ''
          },
          ticks: {
            padding: this.stackBarWidget.getValue().isEnableDatalabels && (this.stackBarWidget.getValue().orientation === Orientation.HORIZONTAL) && (this.stackBarWidget.getValue().datalabelsPosition === 'start' || this.stackBarWidget.getValue().datalabelsPosition === 'center') ? 20 : 0
          }
        }],
      }
    }
    if (this.chart) {
      this.chart.options.scales = this.barChartOptions.scales;
      this.chart.chart.options.scales = this.barChartOptions.scales;
    }
  }

  /**
   * Open color palette ..
   */
  openColorPalette() {
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = String(this.widgetId);
    req.reportId = String(this.reportId);
    req.widgetDesc = this.widgetHeader.desc;
    req.colorPalettes = [];
    this.barChartData.forEach(row=>{
      req.colorPalettes.push({code:row.fieldCode,colorCode:row.backgroundColor,text:row.label});
    });
    console.log(req);
    super.openColorPalette(req);
  }

  /**
   * Update stacked color based on color definations
   * @param res updated color codes
   */
  updateColorBasedOnDefined(res: WidgetColorPalette) {
    this.widgetColorPalette = res;
    console.log(res);
    this.stackBarWidget.next(this.stackBarWidget.getValue());
  }

  /**
   * Update color on widget based on defined
   * If not defined the pick random color
   * @param code resposne code
   */
  getUpdatedColorCode(code: string): string {
    if(this.widgetColorPalette && this.widgetColorPalette.colorPalettes) {
      const res = this.widgetColorPalette.colorPalettes.filter(fil => fil.code === code)[0];
      if(res) {
        return res.colorCode;
      }

    }
    return this.getRandomColor();
  }

  checkTextCode(v: { c: string; t: string; }): string {
    switch (this.displayCriteriaOption.key) {
      case DisplayCriteria.CODE:
        if(v.c) {
          return v.c;
        }
        break;
        case DisplayCriteria.TEXT:
          if(v.t) {
            return v.t;
          }
        break;
        default:
          return `${v.c || ''} -- ${v.t || ''}`;
        break;
    }
    return '';
  }

  saveDisplayCriteria() {
    const saveDisplayCriteria = this.widgetService.saveDisplayCriteria(this.widgetInfo.widgetId, this.widgetInfo.widgetType, this.displayCriteriaOption.key).subscribe(res => {
      this.resetChart();
      this.updateChart(this.returnData);
    }, error => {
      console.error(`Error : ${error}`);
      this.snackBar.open(`Something went wrong`, 'Close', { duration: 3000 });
    });
    this.subscriptions.push(saveDisplayCriteria);
  }

  sortByRow(groupBY: string, resBuckets: any[]) {
    const sortedGroups = _.sortBy(resBuckets, (e) => {
      return e.doc_count;
    });

    const groupedArray = _.groupBy(sortedGroups, (e) => {
      return e.key[groupBY];
    });

    const mappedGroups = _.map(groupedArray, (x) => {
      return _.assign({}, {
        name: x[0].key[groupBY],
        total: _.sumBy(x, 'doc_count')
      });
    });

    const sortMapped = _.sortBy(mappedGroups, (e) => {
      return e.total;
    });
    return _.sortBy(resBuckets, x => _.findIndex(sortMapped, y => x.key[groupBY] === y.name));
  }

  sortByColumnAsc(groupBY: string, resBuckets: any[]) {
    resBuckets.sort((a, b) => {
      if (isNaN(parseFloat(a.key[groupBY]))) {
        return a?.key[groupBY]?.localeCompare(b.key[groupBY]);
      } else {
        return parseInt(a.key[groupBY], 10) - parseInt(b.key[groupBY], 10);
      }
    })
    return resBuckets;
  }

  sortByColumnDesc(groupBY: string, resBuckets: any[]) {
    resBuckets.sort((a, b) => {
      if (isNaN(parseFloat(a.key[groupBY]))) {
        return b?.key[groupBY]?.localeCompare(a.key[groupBY]);
      } else {
        return parseInt(b.key[groupBY], 10) - parseInt(a.key[groupBY], 10);
      }
    })
    return resBuckets;
  }
}
