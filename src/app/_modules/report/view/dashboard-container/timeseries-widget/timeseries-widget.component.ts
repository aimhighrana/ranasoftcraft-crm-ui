import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { TimeDisplayFormat, ChartDataSets, ChartOptions, ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { BehaviorSubject } from 'rxjs';
import { ButtonArr, ChartLegend, ConditionOperator, Criteria, SeriesWith, TimeSeriesWidget, WidgetColorPalette } from '../../../_models/widget';
import * as zoomPlugin from 'chartjs-plugin-zoom';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

const btnArray:ButtonArr[] = [
  {id:1,value:7,isActive:false},
  {id:2,value:10,isActive:false},
  {id:3,value:20,isActive:false},
  {id:4,value:30,isActive:false}
];

@Component({
  selector: 'pros-timeseries-widget',
  templateUrl: './timeseries-widget.component.html',
  styleUrls: ['./timeseries-widget.component.scss']
})
export class TimeseriesWidgetComponent extends GenericWidgetComponent implements OnInit,OnChanges {

  constructor(
    private widgetService: WidgetService,private fb : FormBuilder,public matDialog: MatDialog) {
    super(matDialog);
  }

  timeDateFormat: TimeDisplayFormat;
  dataSet: ChartDataSets[] = [{data:[]}];
  dataSetlabel: Label[] = [];
  widgetInf:BehaviorSubject<TimeSeriesWidget> = new BehaviorSubject<TimeSeriesWidget>(null);
  public afterColorDefined: BehaviorSubject<WidgetColorPalette> = new BehaviorSubject<WidgetColorPalette>(null);
  timeseriesData : TimeSeriesWidget = {} as TimeSeriesWidget;
  public lineChartPlugins = [zoomPlugin];
  chartLegend: ChartLegend[] = [];
  lablels: string[] = [];
  formGroup : FormGroup;
  dateFilters = btnArray;
  startDateCtrl =new FormControl();
  endDateCtrl =new FormControl();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;


  /**
   * Check for it is group by timeseries
   */
  isGroupByChart = false;

  /**
   * Timeseries chart option config see chart.js for more details
   */
  timeSeriesOption: ChartOptions = {
    responsive: true,
    spanGaps:false,
    title: {
      display: true,
      text: ''
    },
    plugins: {
      datalabels:{
        display:false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          speed: 10,
          threshold: 10,
          // onPan() {                                  /** Event handling while panning */
          // },
          onPanComplete: () =>{
              this.getVisibleValues(this.chart);
          }
        },
        zoom: {
          enabled: true,
          grag: true,
          mode: 'x',
          limits: { max: 10, min: 0.5 },
          onZoom() { console.log('ONZOOM'); },
          onZoomComplete() { console.log('ZOOM Complete'); }
        }
      }
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'lll',
          unit: 'month'
        },
        scaleLabel: {
          display: false,
          labelString: ''
        },
        ticks: {
          maxRotation: 0,
          fontSize: 12,
          showLabelBackdrop:false,
        },

      }],
      yAxes: [{
        scaleLabel: {
          display: false,
          labelString: ''
        },ticks: {
          maxRotation: 0,
          fontSize: 12,
        },

      }]
    },
    legend: {
      display: false,
      onClick : (event: MouseEvent, legendItem: ChartLegendLabelItem)=>{
        console.log('legend clicked..')
        this.legendClick(legendItem);
      }
    }
  };

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      date: new FormControl(''),
    });

    this.startDateCtrl.valueChanges.subscribe(data=>{
        this.emitDateChangeValues();
    });

    this.endDateCtrl.valueChanges.subscribe(data=>{
      this.emitDateChangeValues();
  });
    this.getTimeSeriesMetadata();
    this.widgetInf.subscribe(metadata=>{
      if(metadata){
        this.setChartProperties();
        this.afterColorDefined.next(metadata.timeSeries.widgetColorPalette);
      }
    });
        // after color defined update on widget
    this.afterColorDefined.subscribe(res=>{
      if(res) {
        this.updateColorBasedOnDefined(res);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lablels = [];
    this.chartLegend = [];
    this.widgetInf.subscribe(metadata=>{
      if(metadata){
        this.getwidgetData(this.widgetId);
      }
    });
  }

  /**
   * Method to handle pan events
   */

 getVisibleValues({chart}) {
    const x = chart.scales['x-axis-0'];
    const startdate = moment(moment.unix(Number(x._table[0].time)/1000).format('MM/DD/YYYY HH:mm'));
    const enddate = moment(moment.unix(Number(x._table[1].time)/1000).format('MM/DD/YYYY HH:mm'));
    console.log(startdate + ' --- ' +enddate);
    const strtDate = Date.parse(startdate.toString()).toString();
    const enDate = Date.parse(enddate.toString()).toString();
    this.emitpanAndClickevent(strtDate,enDate);
  }

  /**
   * Method to handle button click events
   */

  updateForm(field:string,value:ButtonArr) {
    this.dateFilters.forEach(ele=>{
      if(ele.id === value.id) {
        value.isActive = true
      } else {
        ele.isActive = false;
      }
    })
     const control = this.formGroup.get(field) as FormControl;
     if(control != null){
        control.patchValue(value.value);
        console.log(this.formGroup.value);
     }
     let endDatemilli :string;
     switch (this.timeseriesData.timeSeries.seriesWith) {
      case SeriesWith.day:
        const date = moment().subtract(value.value, 'd').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(date.toString()).toString();
         break;

      case SeriesWith.hour:
        const hour = moment().subtract(value.value, 'hours').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(hour.toString()).toString();
        break;

      case SeriesWith.millisecond:
        const millisecond = moment().subtract(value.value, 'h').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(millisecond.toString()).toString();
        break;

      case SeriesWith.minute:
        const minute = moment().subtract(value.value, 'minutes').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(minute.toString()).toString();
        break;

      case SeriesWith.month:
        const month = moment().subtract(value.value, 'M').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(month.toString()).toString();
        break;

      case SeriesWith.quarter:
        const quarter = moment().subtract(value.value, 'quarter').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(quarter.toString()).toString();
        break;

      case SeriesWith.second:
        const second = moment().subtract(value.value, 'seconds').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(second.toString()).toString();
        break;

      case SeriesWith.week:
        const week = moment().subtract((value.value*7), 'd').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(week.toString()).toString();
        break;
      default:
        break;
    }
    const strtdatemilli = Date.parse(moment().format('MM/DD/YYYY HH:mm').toString()).toString();
       this.emitpanAndClickevent(endDatemilli,strtdatemilli);
  }

  emitpanAndClickevent(startdate:string,enddate:string):void{
    const fieldId = this.timeseriesData.timeSeries.groupWith;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);
    appliedFilters =[];
      if(appliedFilters.length >0) {
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === fieldId);
        if(cri.length ===0) {
          const critera: Criteria = new Criteria();
          critera.fieldId = fieldId;
          critera.conditionFieldId = fieldId;
          critera.conditionFieldEndValue = enddate;
          critera.conditionFieldStartValue = startdate;
          critera.blockType = BlockType.COND;
          critera.conditionOperator = ConditionOperator.RANGE;
          appliedFilters.push(critera);
        }
      } else {
        appliedFilters = [];
        const critera: Criteria = new Criteria();
        critera.fieldId = fieldId;
        critera.conditionFieldId = fieldId;
        critera.conditionFieldEndValue = enddate;
        critera.conditionFieldStartValue = startdate;
        critera.blockType = BlockType.COND;
        critera.conditionOperator = ConditionOperator.RANGE;
        appliedFilters.push(critera);
      }
      appliedFilters.forEach(app => this.filterCriteria.push(app));
      this.emitEvtFilterCriteria(this.filterCriteria);
  }

  /**
   * Get Metadata of Time series chart
   */

  getTimeSeriesMetadata():void{
    this.widgetService.getTimeseriesWidgetInfo(this.widgetId).subscribe(res=>{
      this.widgetInf.next(res);
      if(res.timeSeries.fieldId === res.timeSeries.groupWith) {
        this.isGroupByChart = true;
      } else {
        this.isGroupByChart = false;
      }
    },error=>console.error(`Error : ${error}`));
  }

  /**
   * Set Chart properties based on metadata
   */
  setChartProperties():void{
    this.timeseriesData = this.widgetInf.getValue();

    /**
     * SET TICKS HERE
     */
    if(this.timeseriesData.timeSeries.scaleFrom !== null && this.timeseriesData.timeSeries.scaleFrom !== undefined
      && this.timeseriesData.timeSeries.scaleTo !== null && this.timeseriesData.timeSeries.scaleTo !== undefined
      && this.timeseriesData.timeSeries.stepSize !== null && this.timeseriesData.timeSeries.stepSize !== undefined) {
         const ticks = {displamin:this.timeseriesData.timeSeries.scaleFrom, max:this.timeseriesData.timeSeries.scaleTo, stepSize:this.timeseriesData.timeSeries.stepSize};
    /**
     * SET SCALES BASED ON CONFIG
     */

      this.timeSeriesOption.scales = {
        xAxes: [{
          type: 'time',
          time: {
            tooltipFormat: 'lll',
            unit: this.timeseriesData.timeSeries.seriesWith
          },
          scaleLabel: {
            display: true,
            labelString: this.timeseriesData.timeSeries.xAxisLabel ? this.timeseriesData.timeSeries.xAxisLabel : ''
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.timeseriesData.timeSeries.yAxisLabel ? this.timeseriesData.timeSeries.yAxisLabel : ''
          },ticks
        }]
      };
  }
    /**
     * NOW SET LEGEND POSITION
     */

    if (this.timeseriesData.timeSeries.isEnableLegend) {
      this.timeSeriesOption.legend = {
        display: true,
        position: this.timeseriesData.timeSeries.legendPosition,
        onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
          // call protype of stacked bar chart componenet
          this.legendClick(legendItem);
        }
      }
    }

    /**
     * SET TITLE OF CHART
     */

    this.timeSeriesOption.title = {
      display: true,
      text: this.timeseriesData.widgetName
    }

  }


  /**
   * Remove old filter criteria for field
   * selectedOptions as parameter
   */
  removeOldFilterCriteria(selectedOptions: Criteria[]) {
    selectedOptions.forEach(option => {
      this.filterCriteria.splice(this.filterCriteria.indexOf(option), 1);
    });
  }

  emitEvtFilterCriteria(critera: Criteria[]): void {
    this.evtFilterCriteria.emit(critera);
  }

  /**
   * Event handle when Clicks on dot
   */

  // timeClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
  //   const option = this.chart.chart.getElementAtEvent(event) as any;
  //   if(option.length > 0){
  //     const clickedIndex = (option[0])._index;
  //     const clickedLagend = this.chartLegend[clickedIndex];
  //     const drpCode = this.chartLegend[clickedIndex] ? this.chartLegend[clickedIndex].code : this.lablels[clickedIndex];
  //   }
  // }

  /**
   * handled for legend click
   */

  legendClick(legendItem: ChartLegendLabelItem):void {
    const clickedLegend =  this.chartLegend[legendItem.datasetIndex] ? this.chartLegend[legendItem.datasetIndex].code : '';
    if(clickedLegend === '') {
      return ;
    }
    const fieldId = this.timeseriesData.timeSeries.fieldId;
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

  public getRandomColor():string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getwidgetData(widgetId:number):void{
    this.dataSet = [{data:[]}];
    this.widgetService.getWidgetData(String(widgetId),this.filterCriteria).subscribe(response=>{
      if(response !== null){
        if(this.isGroupByChart) {
          this.transformForGroupBy(response);
        } else {
          if(this.timeseriesData.timeSeries.chartType === 'BAR'){
           this.dataSet = this.transformDataForComparison(response);
          }else{
            this.dataSet = this.transformDataSets(response);
          }
          if(this.filterCriteria.length === 0){
            this.dateFilters.forEach(ele=>{
                ele.isActive = false;
          });
          this.startDateCtrl.setValue(null);
          this.endDateCtrl.setValue(null);
         }
        }
    }
    });
  }

  transformDataSets(data:any):any{
    const finalOutput = new Object();
    const cordKeys = ['x','y'];
    const aggregation = data.aggregations['date_histogram#date'];
    if(aggregation.buckets !== undefined && aggregation.buckets.length>0){
      aggregation.buckets.forEach(singleBucket => {
        const milliVal = singleBucket.key;
         const arrBuckets = singleBucket['sterms#term'].buckets;
         arrBuckets.forEach(innerBucket => {
             const count = innerBucket.doc_count;
             const label = innerBucket.key;
             if(Object.keys(finalOutput).includes(label)){
              const array = finalOutput[label];
              const objdt = new Object();
              objdt[cordKeys[0]] =  moment(milliVal).format('DD MMM YYYY hh:mm a');
              objdt[cordKeys[1]] =  count;
              array.push(objdt);
              finalOutput[label] = array;
             }else{
               const objdt = new Object();
               objdt[cordKeys[0]] =  moment(milliVal).format('DD MMM YYYY hh:mm a');
               objdt[cordKeys[1]] =  count;
               const array = new Array();
               array.push(objdt);
              finalOutput[label] = array;
             }
         });
      });
    }

    /**
     * TRANSFORM _ DATASETS
     */
    this.chartLegend = [];
    const arrKeys = ['data','id','label','fill','border'];
    const datasets = new Array();
    Object.keys(finalOutput).forEach(status=>{
      const dataSet = new Object();
      dataSet[arrKeys[0]] = finalOutput[status];
      dataSet[arrKeys[1]] = status;
      dataSet[arrKeys[2]] = status;
      dataSet[arrKeys[3]] = false;
      dataSet[arrKeys[4]]= this.getUpdatedColorCode(status);
      const chartLegend = { text: status, code: status, legendIndex: this.chartLegend.length };
      this.chartLegend.push(chartLegend);
      datasets.push(dataSet);
    });

    return datasets;
  }

 /**
  * Transform datasets when need comparison year wise month wise...
  * @param res server res
  */

  transformDataForComparison(res:any){
    const finalOutput = new Array();
    const aggregation = res ?  res.aggregations['date_histogram#date'] : [];
    const arrKeys = ['data','id','label','fill','border'];
   if(aggregation.buckets !== undefined && aggregation.buckets.length>0){
      aggregation.buckets.forEach(singleBucket => {
      const dataSet = new Object();
      const milliVal = singleBucket.key_as_string;
      const arrBuckets = singleBucket['sterms#term'].buckets;
      const arrcount = new Array();
      arrBuckets.forEach(innerBucket => {
        const count = innerBucket.doc_count;
        const label = innerBucket.key;
        arrcount.push(count);
        const chartLegend = { text: label, code: label, legendIndex: this.chartLegend.length };
         const exist  = this.chartLegend.filter(map => map.text === label);
         if(exist.length===0){
          this.chartLegend.push(chartLegend);
          this.dataSetlabel.push(label);
        }
      });
        // Prepare datasets for comparison in timeseries
        dataSet[arrKeys[0]] = arrcount;
        dataSet[arrKeys[2]] =  milliVal;
        finalOutput.push(dataSet);
    });
   }
   this.timeSeriesOption.scales = {xAxes: [{}],yAxes: [{}]};
   this.timeSeriesOption.legend = {display: true,position:'bottom'};
   this.timeSeriesOption.animation = {
  onComplete() {
    // const chartInstance = this.chart;
    // chartInstance.ctx.textAlign = 'center';
    // chartInstance.ctx.textBaseline = 'bottom';

    // this.data.datasets.forEach(function(dataset, i) {
    //   const meta = chartInstance.controller.getDatasetMeta(i);
    //   meta.data.forEach(function(bar, index) {
    //     const data = dataset.data[index];
    //     chartInstance.ctx.fillText(data, bar._model.x, bar._model.y - 5);
    //   });
    // });
  }
};
   return finalOutput;
  }

  /**
   * Transform for timeseries with grp by same fields ..
   * @param res server response
   */
  transformForGroupBy(res: any) {
    const aggregation = res ?  res.aggregations['date_histogram#date'] : [];
    if(aggregation && aggregation.buckets) {
      const yearDoc = {};
      aggregation.buckets.forEach(fil=>{
          let date = fil.key_as_string ? fil.key_as_string : [];
          if(date) {
            date = date.split('-');
            if(yearDoc[date[0]]) {
              yearDoc[date[0]].push(fil);
            } else {
              yearDoc[date[0]] = [fil];
            }
          }
      });
      console.log(yearDoc);

      this.dataSetlabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const finaldata = [];
      if(yearDoc) {
        Object.keys(yearDoc).forEach(yr=>{
          if(yearDoc[yr]) {
            finaldata.push({
              data:this.generatedDataBasedonMonth(yearDoc[yr]),
              label: `${yr}`,
              fill: false
            });
          }
        });
      }
      this.dataSet = finaldata;
      console.log(finaldata);

      this.timeSeriesOption.scales = {xAxes: [{}],yAxes: [{}]};
      this.timeSeriesOption.legend = {display: true,position:'bottom'};
    }
  }
  /**
   * Transformer helper ..
   * @param data year data
   */
  generatedDataBasedonMonth(data: any): any[] {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const finalData = [];
    months.forEach(mon=>{
      const hasdata = data.filter(fil=> fil.key_as_string.indexOf(mon) !==-1)[0];
      finalData.push(hasdata ? hasdata.doc_count : 0)
    });
    return finalData;
  }

/**
 * EMIT EVENT WHEN DATE CHANGES
 */

  emitDateChangeValues() {
    if(this.startDateCtrl.value && this.endDateCtrl.value) {
      const groupwith = this.timeseriesData.timeSeries.groupWith;
      let filterApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === groupwith);
      this.removeOldFilterCriteria(filterApplied);
      if(filterApplied.length) {
        filterApplied[0].conditionFieldStartValue = moment(this.startDateCtrl.value).valueOf().toString();
        filterApplied[0].conditionFieldEndValue = moment(this.endDateCtrl.value).valueOf().toString();
      } else {
        filterApplied = [];
        const critera: Criteria = new Criteria();
        critera.fieldId = groupwith;
        critera.conditionFieldId = groupwith;
        critera.conditionFieldEndValue = moment(this.endDateCtrl.value).valueOf().toString();
        critera.conditionFieldStartValue = moment(this.startDateCtrl.value).valueOf().toString();
        critera.blockType = BlockType.COND;
        critera.conditionOperator = ConditionOperator.RANGE;
        filterApplied.push(critera);
      }
      filterApplied.forEach(op=> this.filterCriteria.push(op));
      this.emitEvtFilterCriteria(this.filterCriteria);
    }
  }

  /**
   * Open Color palette...
   */
  openColorPalette() {
    console.log(this.timeseriesData);
    console.log(this.chartLegend);
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = String(this.widgetId);
    req.reportId = String(this.reportId);
    req.widgetDesc = this.timeseriesData.desc;
    req.colorPalettes = [];
    this.chartLegend.forEach(legend=>{
      req.colorPalettes.push({
        code: legend.code,
        colorCode: this.timeseriesData[0] ? this.timeseriesData[0].backgroundColor[legend.legendIndex] : this.getRandomColor(),
        text: legend.text
      });
    });
    super.openColorPalette(req);
  }

  getUpdatedColorCode(code: string): string {
    if(this.widgetColorPalette && this.widgetColorPalette.colorPalettes) {
      const res = this.widgetColorPalette.colorPalettes.filter(fil => fil.code === code)[0];
      if(res) {
        return res.colorCode;
      }

    }
    return this.getRandomColor();
  }

  /**
   * Update stacked color based on color definations
   */

  updateColorBasedOnDefined(res: WidgetColorPalette) {
    this.widgetColorPalette = res;
  }

 /*
  * download chart data as CSV
  */

 downloadCSV(): void {
  const excelData = [];
  this.chartLegend.forEach(legend=>{
    const obj = {} as any;
    obj[this.timeseriesData.timeSeries.fieldId] = legend.code + '';
    const key = 'id';
    const objdataArr = this.dataSet.filter(data=>data[key] === legend.code)
    if(objdataArr.length>0 && objdataArr[0].data.length>0){
      objdataArr[0].data.forEach(data=>{
        obj.time = data.x;
        obj.count = data.y;
        excelData.push(obj);
      })
    }
    excelData.push(obj);
  });
  this.widgetService.downloadCSV('Time-Chart', excelData);
}
/*
* download chart as image
*/
downloadImage() {
  this.widgetService.downloadImage(this.chart.toBase64Image(), 'Time-Series.png');
}
}