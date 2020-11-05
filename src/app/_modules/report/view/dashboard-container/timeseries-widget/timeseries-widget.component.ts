import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import ChartDataLables from 'chartjs-plugin-datalabels';

const btnArray: ButtonArr[] = [
  { id: 0, value: 'millisecond', isActive: false },
  { id: 1, value: '7', isActive: false },
  { id: 2, value: '10', isActive: false },
  { id: 3, value: '20', isActive: false },
  { id: 4, value: '30', isActive: false }
];

@Component({
  selector: 'pros-timeseries-widget',
  templateUrl: './timeseries-widget.component.html',
  styleUrls: ['./timeseries-widget.component.scss']
})
export class TimeseriesWidgetComponent extends GenericWidgetComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private widgetService: WidgetService, private fb: FormBuilder, public matDialog: MatDialog) {
    super(matDialog);
  }

  timeDateFormat: TimeDisplayFormat;
  dataSet: ChartDataSets[] = [{ data: [] }];
  dataSetlabel: Label[] = [];
  widgetInf: BehaviorSubject<TimeSeriesWidget> = new BehaviorSubject<TimeSeriesWidget>(null);
  public afterColorDefined: BehaviorSubject<WidgetColorPalette> = new BehaviorSubject<WidgetColorPalette>(null);
  timeseriesData: TimeSeriesWidget = {} as TimeSeriesWidget;
  public lineChartPlugins = [zoomPlugin];
  chartLegend: ChartLegend[] = [];
  lablels: string[] = [];
  formGroup: FormGroup;
  dateFilters = btnArray;
  startDateCtrl = new FormControl();
  endDateCtrl = new FormControl();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;


  /**
   * Check for it is group by timeseries
   */
  isGroupByChart = false;

  /**
   * Flag for make filter visiable ..
   */
  showFilterOption = false;
  /**
   * Timeseries chart option config see chart.js for more details
   */
  timeSeriesOption: ChartOptions = {
    responsive: true,
    spanGaps: false,
    title: {
      display: true,
      text: ''
    },
    plugins: {
      datalabels: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          speed: 10,
          threshold: 10,
          // onPan() {                                  /** Event handling while panning */
          // },
          onPanComplete: () => {
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
        scaleLabel: {
          display: false,
          labelString: ''
        },
        ticks: {
          maxRotation: 0,
          fontSize: 12,
          showLabelBackdrop: false,
        },

      }],
      yAxes: [{
        scaleLabel: {
          display: false,
          labelString: ''
        }, ticks: {
          maxRotation: 0,
          fontSize: 12,
        },

      }]
    },
    legend: {
      display: false,
      onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
        console.log('legend clicked..')
      }
    },
    onClick: (event?: MouseEvent, activeElements?: Array<{}>) => {
      // this.stackClickFilter(event, activeElements);
    }
  };

  /**
   * When reset filter from main container value should be true
   */
  @Input()
  hasFilterCriteria: boolean;

  isLoading = true ;

  ngOnDestroy(): void {
    this.widgetInf.complete();
    this.widgetInf.unsubscribe();
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {

    if (changes && changes.hasFilterCriteria && changes.hasFilterCriteria.currentValue) {
      this.clearFilterCriteria();
    }

    if (changes && changes.filterCriteria && changes.filterCriteria.currentValue !== changes.filterCriteria.currentValue.previousValue) {
      this.lablels = [];
      this.chartLegend = [];
      this.widgetInf.next(this.widgetInf.getValue());
    }
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      date: new FormControl(''),
    });


    this.startDateCtrl.valueChanges.subscribe(data => {
      this.emitDateChangeValues();
    });

    this.endDateCtrl.valueChanges.subscribe(data => {
      this.emitDateChangeValues();
    });


    this.getTimeSeriesMetadata();
    this.widgetInf.subscribe(metadata => {
      if (metadata) {
        if(this.isLoading) {
          this.isLoading = false;
          this.setChartProperties();
          this.afterColorDefined.next(metadata.timeSeries.widgetColorPalette);
        } else {
          this.getwidgetData(this.widgetId);
        }
      }
    });
    // after color defined update on widget
    this.afterColorDefined.subscribe(res => {
      if (res) {
        this.updateColorBasedOnDefined(res);
      }
    });
  }

  /**
   * Method to handle pan events
   */

  getVisibleValues({ chart }) {
    const x = chart.scales['x-axis-0'];
    const startdate = moment(moment.unix(Number(x._table[0].time) / 1000).format('MM/DD/YYYY HH:mm'));
    const enddate = moment(moment.unix(Number(x._table[1].time) / 1000).format('MM/DD/YYYY HH:mm'));
    const strtDate = Date.parse(startdate.toString()).toString();
    const enDate = Date.parse(enddate.toString()).toString();
    this.emitpanAndClickevent(strtDate, enDate);
  }

  /**
   * Method to handle button click events
   */

  updateForm(field: string, value: ButtonArr) {
    this.dateFilters.forEach(ele => {
      if (ele.id === value.id) {
        value.isActive = true
      } else {
        ele.isActive = false;
      }
    })
    const control = this.formGroup.get(field) as FormControl;
    if (control != null) {
      control.patchValue(value.value);
    }
    let endDatemilli: string;
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
        const week = moment().subtract((Number(value.value) * 7), 'd').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(week.toString()).toString();
        break;

      case SeriesWith.year:
        const year = moment().subtract(value.value, 'y').format('MM/DD/YYYY HH:mm');
        endDatemilli = Date.parse(year.toString()).toString();
        break;

      default:
        break;
    }
    const strtdatemilli = Date.parse(moment().format('MM/DD/YYYY HH:mm').toString()).toString();
    this.emitpanAndClickevent(endDatemilli, strtdatemilli);
  }

  emitpanAndClickevent(startdate: string, enddate: string): void {
    const fieldId = this.timeseriesData.timeSeries.groupWith;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);
    appliedFilters = [];
    if (appliedFilters.length > 0) {
      const cri = appliedFilters.filter(fill => fill.conditionFieldValue === fieldId);
      if (cri.length === 0) {
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

    this.applyFilters();
  }

  /**
   * Get Metadata of Time series chart
   */

  getTimeSeriesMetadata(): void {
    this.widgetService.getTimeseriesWidgetInfo(this.widgetId).subscribe(res => {
      this.widgetInf.next(res);
      if (res.timeSeries.fieldId === res.timeSeries.groupWith) {
        this.isGroupByChart = true;
      } else {
        this.isGroupByChart = false;
      }
    }, error => console.error(`Error : ${error}`));
  }

  /**
   * Set Chart properties based on metadata
   */
  setChartProperties(): void {
    this.timeseriesData = this.widgetInf.getValue();
    /**
     * SET TICKS HERE
     */
    if (this.timeseriesData.timeSeries.scaleFrom !== null && this.timeseriesData.timeSeries.scaleFrom !== undefined
      && this.timeseriesData.timeSeries.scaleTo !== null && this.timeseriesData.timeSeries.scaleTo !== undefined
      && this.timeseriesData.timeSeries.stepSize !== null && this.timeseriesData.timeSeries.stepSize !== undefined) {
      const ticks = { displamin: this.timeseriesData.timeSeries.scaleFrom, max: this.timeseriesData.timeSeries.scaleTo, stepSize: this.timeseriesData.timeSeries.stepSize };
      this.timeSeriesOption.scales = {
        xAxes: [{
          type: 'time',
          time: {
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
          }, ticks
        }]
      };
    }else{
        this.timeSeriesOption.scales = {
          xAxes: [{
            type: 'time',
            time: {
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
            },
          }]
        };
    }
    const hasBtn = this.dateFilters.filter(fil => fil.value === (this.timeseriesData.timeSeries.startDate))[0];
    if (hasBtn) {
      const index = this.dateFilters.indexOf(hasBtn);
      this.dateFilters.splice(index, 1);
      hasBtn.isActive = true;
      this.dateFilters.splice(index, 0, hasBtn);
      this.updateForm('date', hasBtn);
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

  legendClick(legendItem: ChartLegendLabelItem): void {
    const clickedLegend = this.chartLegend[legendItem.datasetIndex] ? this.chartLegend[legendItem.datasetIndex].code : '';
    if (clickedLegend === '') {
      return;
    }
    const fieldId = this.timeseriesData.timeSeries.fieldId;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);
    if (appliedFilters.length > 0) {
      const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLegend);
      if (cri.length === 0) {
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
    this.applyFilters();
  }

  /**
   * function to generate random colors for chart
   */
  public getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * function to get widget data according to widgetID
   * @param widgetId ID of the widget
   */
  getwidgetData(widgetId: number): void {
    this.dataSet = [{ data: [] }];
    this.widgetService.getWidgetData(String(widgetId), this.filterCriteria).subscribe(response => {
      if (response !== null) {
        const metadata = this.widgetInf.getValue() ? this.widgetInf.getValue() : {} as TimeSeriesWidget;
        if (this.isGroupByChart) {
          this.transformForGroupBy(response);
        } else if (metadata.timeSeries && (metadata.timeSeries.fieldId && metadata.timeSeries.groupWith && metadata.timeSeries.distictWith)) {
          this.dataSet = this.transformDataForComparison(response, true);
        } else if (metadata.timeSeries && ((!metadata.timeSeries.fieldId || metadata.timeSeries.fieldId === '') && metadata.timeSeries.groupWith && metadata.timeSeries.distictWith)) {
          this.transformForGroupBy(response, true);
        } else if (metadata.timeSeries.fieldId === 'TIME_TAKEN' || metadata.timeSeries.bucketFilter) {
          this.tarnsformForShowInPercentage(response, metadata.timeSeries.showInPercentage);
        }
        else {
          if (this.timeseriesData.timeSeries.chartType === 'BAR') {
            this.dataSet = this.transformDataForComparison(response);
          } else {
            this.showFilterOption = true;
            this.dataSet = this.transformDataSets(response);
          }
          if (this.filterCriteria.length === 0) {
            this.dateFilters.forEach(ele => {
              ele.isActive = false;
            });
            this.startDateCtrl.setValue(null);
            this.endDateCtrl.setValue(null);
          }
        }
      }
    });
  }

  transformDataSets(data: any): any {
    const finalOutput = new Object();
    const codetextObj = {};
    const cordKeys = ['x', 'y'];
    const aggregation = data.aggregations['date_histogram#date'] ? data.aggregations['date_histogram#date'] : data.aggregations[''];
    if (aggregation.buckets !== undefined && aggregation.buckets.length > 0) {
      aggregation.buckets.forEach(singleBucket => {
        const res = Object.keys(singleBucket);
        const value = res.filter(text => {
          return text.includes('terms#term');
        })
        const arrBuckets = singleBucket[value[0]] ? singleBucket[value[0]].buckets : [];
        arrBuckets.forEach(innerBucket => {
          const count = innerBucket.doc_count;
          let label = innerBucket.key;
          const textTermBucket = innerBucket['sterms#textTerm'] ? innerBucket['sterms#textTerm'].buckets : null;
          if(textTermBucket){
            textTermBucket.forEach(bucket => {
              label = bucket.key
          })
          }
          codetextObj[label] = innerBucket.key;
          if (Object.keys(finalOutput).includes(label)) {
            const array = finalOutput[label];
            const objdt = new Object();
            objdt[cordKeys[0]] = singleBucket.key_as_string;
            objdt[cordKeys[1]] = count;
            array.push(objdt);
            finalOutput[label] = array;
          } else {
            const objdt = new Object();
            objdt[cordKeys[0]] = singleBucket.key_as_string;
            objdt[cordKeys[1]] = count;
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
    const arrKeys = ['data', 'id', 'label', 'fill', 'border'];
    const datasets = new Array();
    Object.keys(finalOutput).forEach(status => {
      const dataSet = new Object();
      dataSet[arrKeys[0]] = finalOutput[status];
      dataSet[arrKeys[1]] = status;
      dataSet[arrKeys[2]] = status;
      dataSet[arrKeys[3]] = false;
      dataSet[arrKeys[4]] = this.getUpdatedColorCode(status);
      const chartLegend = { text: status, code: codetextObj[status], legendIndex: this.chartLegend.length };
      this.chartLegend.push(chartLegend);
      datasets.push(dataSet);
      this.setLegendForChart();
    });

    return datasets;
  }

  /**
   * Transform datasets when need comparison year wise month wise...
   * @param res server res
   */
  transformDataForComparison(res: any, forDistinct?: boolean) {
    const finalOutput = new Array();
    this.dataSetlabel = [];
    const objData = {};
    this.chartLegend = [];
    const aggregation = res ? res.aggregations['date_histogram#date'] : [];
    const arrKeys = ['data', 'id', 'label', 'fill', 'border'];
    if (aggregation.buckets !== undefined && aggregation.buckets.length > 0) {
      aggregation.buckets.forEach(singleBucket => {
        const dataSet = new Object();
        const milliVal = singleBucket.key_as_string;
        const resValue = Object.keys(singleBucket);
        const value = resValue.filter(data => {
          return data.includes('terms#term');
        })
        const arrBuckets = singleBucket[value[0]] ? singleBucket[value[0]].buckets : [];
        const arrcount = new Array();
        arrBuckets.forEach(arrBucket => {
          const bucket = arrBuckets.filter(fil => fil.key === arrBucket.key)[0];
          const count = bucket ? (forDistinct ? (bucket['cardinality#count'] ? bucket['cardinality#count'].value : 0) : bucket.doc_count) : 0;
          arrcount.push(count);
          const txtvalue = Object.keys(bucket);
          const txtlabel = txtvalue.filter(data => {
            return data.includes('terms#textTerm');
          })
          const textTermBucket = bucket && bucket[txtlabel[0]] ? bucket[txtlabel[0]].buckets : [];
          let label = ''
          if(textTermBucket.length > 0){
            textTermBucket.forEach(textBucket => {
              label = textBucket.key;
            })
          }
          const chartLegend = { text: label, code: arrBucket.key, legendIndex: this.chartLegend.length };
          const exist = this.chartLegend.filter(map => map.code === arrBucket.key);
          if (exist.length === 0) {
            this.chartLegend.push(chartLegend);
            if (this.dataSetlabel.indexOf(arrBucket.key) === -1) {
              label.length > 0 ? this.dataSetlabel.push(label) : this.dataSetlabel.push(arrBucket.key);
            }
          }
        });
        // Prepare datasets for comparison in timeseries
        dataSet[arrKeys[0]] = arrcount;
        dataSet[arrKeys[2]] = milliVal;
        if(objData[milliVal] !== undefined){
           const oldArray = objData[milliVal];
           const lengthOfArr = arrcount.length>oldArray.length?oldArray.length:arrcount.length;
           for(let i=0;i<lengthOfArr.length;i++){
             arrcount[i] = arrcount[i]+oldArray[i];
           }
        }
        objData[milliVal]=arrcount;
      });
    }

    const arrKeyF = ['label','data'];
    Object.keys(objData).forEach(status => {
      const label = {};
      label[arrKeyF[0]] = status;
      label[arrKeyF[1]] = objData[status];
      finalOutput.push(label);
    });


    this.timeSeriesOption.scales = { xAxes: [{}], yAxes: [{}] };
    this.setLegendForChart(); // calling it to set legend
    return finalOutput;
  }

  /**
   * Transform for timeseries with grp by same fields ..
   * @param res server response
   */
  transformForGroupBy(res: any, forDistinct?: boolean) {
    const aggregation = res ? res.aggregations['date_histogram#date'] : [];
    if (aggregation && aggregation.buckets) {
      const yearDoc = {};
      aggregation.buckets.forEach(fil => {
        let date = fil.key_as_string ? fil.key_as_string : [];
        if (date) {
          date = date.split('-');
          if (yearDoc[date[0]]) {
            yearDoc[date[0]].push(fil);
          } else {
            yearDoc[date[0]] = [fil];
          }
        }
      });

      this.dataSetlabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const finaldata = [];
      if (yearDoc) {
        Object.keys(yearDoc).forEach(yr => {
          if (yearDoc[yr]) {
            finaldata.push({
              data: this.generatedDataBasedonMonth(yearDoc[yr], forDistinct),
              label: `${yr}`,
              fill: false
            });
          }
        });
      }
      this.dataSet = finaldata;
      this.timeSeriesOption.scales = { xAxes: [{}], yAxes: [{}] };
      this.setLegendForChart(); // calling it to set legend
    }
  }


  tarnsformForShowInPercentage(res: any, showInPercentage: boolean) {
    const aggregation = res ? res.aggregations['date_histogram#date'] : [];
    if (aggregation && aggregation.buckets) {
      const yearDoc = {};
      aggregation.buckets.forEach(fil => {
        let date = fil.key_as_string ? fil.key_as_string : [];
        if (date) {
          date = date.split('-');
          if (yearDoc[date[0]]) {
            yearDoc[date[0]].push(fil);
          } else {
            yearDoc[date[0]] = [fil];
          }
        }
      });
      this.dataSetlabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const finaldata = [];
      if (yearDoc) {
        Object.keys(yearDoc).forEach(yr => {
          if (yearDoc[yr]) {
            finaldata.push({
              data: this.bucketModify(yearDoc[yr], showInPercentage),
              label: `${yr}`,
              fill: false
            });
          }
        });
      }
      this.dataSet = finaldata;
      this.timeSeriesOption.scales = { xAxes: [{}], yAxes: [{}] };
      this.setLegendForChart(); // calling it to set legend

      const metadata = this.widgetInf.getValue() ? this.widgetInf.getValue() : {} as TimeSeriesWidget;
      if (metadata.timeSeries && metadata.timeSeries.isEnableDatalabels) {
        this.timeSeriesOption.plugins = {
          ChartDataLables,
          datalabels: {
            align: metadata.timeSeries.datalabelsPosition ? metadata.timeSeries.datalabelsPosition : 'end',
            anchor: metadata.timeSeries.datalabelsPosition ? metadata.timeSeries.datalabelsPosition : 'end',
            display: 'auto'
          }
        }
      }

    }
  }

  /**
   * Transformer helper ..
   * @param data year data
   */
  bucketModify(data: any, showInPercentage: boolean): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const finalData = [];
    months.forEach(mon => {
      const hasdata = data.filter(fil => fil.key_as_string.indexOf(mon) !== -1)[0];
      if (hasdata) {
        const totalInMonth = hasdata.doc_count ? hasdata.doc_count : 0;
        const res = Object.keys(hasdata);
        const value = res.filter(text => {
          return text.includes('terms#term')
        })
        const inFilterBucket = hasdata[value[0]] ? hasdata[value[0]].buckets : [];
        const bucket = inFilterBucket.filter(fil => fil.key === 'true')[0];
        if (bucket) {
          let val = bucket.doc_count ? bucket.doc_count : 0;
          if (val > 0 && showInPercentage) {
            const per = (val / totalInMonth);
            val = Math.round((per + Number.EPSILON) * 100 * 100) / 100;
          }
          finalData.push(val);
        }
      } else {
        finalData.push(0);
      }

    });
    return finalData;
  }


  /**
   * Transformer helper ..
   * @param data year data
   */
  generatedDataBasedonMonth(data: any, forDistinct: boolean): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const finalData = [];
    months.forEach(mon => {
      const hasdata = data.filter(fil => fil.key_as_string.indexOf(mon) !== -1)[0];
      finalData.push(hasdata ? (forDistinct ? (hasdata['cardinality#count'] ? hasdata['cardinality#count'].value : 0) : hasdata.doc_count) : 0)
    });
    return finalData;
  }

  /**
   * EMIT EVENT WHEN DATE CHANGES
   */

  emitDateChangeValues() {
    if (this.startDateCtrl.value && this.endDateCtrl.value) {
      const groupwith = this.timeseriesData.timeSeries.groupWith;
      let filterApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === groupwith);
      this.removeOldFilterCriteria(filterApplied);
      if (filterApplied.length) {
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
      filterApplied.forEach(op => this.filterCriteria.push(op));
      this.applyFilters();
      this.dateFilters.forEach(ele => {
        ele.isActive = false;
      })


    }
  }

  /**
   * Open Color palette...
   */
  openColorPalette() {
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = String(this.widgetId);
    req.reportId = String(this.reportId);
    req.widgetDesc = this.timeseriesData.desc;
    req.colorPalettes = [];
    this.chartLegend.forEach(legend => {
      req.colorPalettes.push({
        code: legend.code,
        colorCode: this.timeseriesData[0] ? this.timeseriesData[0].backgroundColor[legend.legendIndex] : this.getRandomColor(),
        text: legend.text
      });
    });
    super.openColorPalette(req);
  }

  getUpdatedColorCode(code: string): string {
    if (this.widgetColorPalette && this.widgetColorPalette.colorPalettes) {
      const res = this.widgetColorPalette.colorPalettes.filter(fil => fil.code === code)[0];
      if (res) {
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

  /**
   * Download data into CSV
   */
  downloadCSV(): void {
    const excelData = [];
      this.dataSet.forEach((dataArr) => {
        const key = 'id'
        if(dataArr[key]){
          dataArr.data.forEach((dataObj, index) => {
            const obj = {} as any;
            obj.field = dataArr[key];
            if(dataObj.x){
              obj.time = dataObj.x;
              obj.count = dataObj.y;
            }
            else{
              obj.time = dataArr.label;
              obj.count = dataObj;
            }
            excelData.push(obj);
          })
        }
        else{
          dataArr.data.forEach((dataObj, index) => {
            const obj = {} as any;
            // In case of field ID is there..
            if(this.timeseriesData.timeSeries.fieldId){
              obj[this.timeseriesData.timeSeries.fieldId] = this.chartLegend.length>0 ? (this.chartLegend[index].text.length>0 ? this.chartLegend[index].text : this.chartLegend[index].code): this.dataSetlabel[index];
            }
            // In case of field ID is blank - groupWith and DistinctWith are there..
            else{
              obj[this.timeseriesData.timeSeries.distictWith] = this.chartLegend.length>0 ? (this.chartLegend[index].text.length>0 ? this.chartLegend[index].text : this.chartLegend[index].code): this.dataSetlabel[index];
            }
            // checking format of data to be downloaded..
            if(dataObj.x){
              obj.time = dataObj.x;
              obj.count = dataObj.y
            }
            else{
              obj.time = dataArr.label;
              obj.count = dataObj;
            }
            excelData.push(obj);
          })
        }
      })
    this.widgetService.downloadCSV('Time-Chart', excelData);
  }


  /*
    * download chart as image
    */
  downloadImage() {
    this.widgetService.downloadImage(this.chart.toBase64Image(), 'Time-Series.png');
  }

  clearFilterCriteria() {
    this.startDateCtrl.setValue(null);
    this.endDateCtrl.setValue(null);
    const fieldId = this.timeseriesData.timeSeries.groupWith;
    const appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);

    this.dateFilters.forEach(f => {
      f.isActive = false;
    });

    this.emitEvtFilterCriteria(this.filterCriteria);
  }


  /**
   * After click on stack br / line then should emit through this function ..
   * @param event canvas evnet ..
   * @param activeElements get active element ..
   */
  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
    if (this.chart && activeElements.length > 0) {
      const option = this.chart.chart.getElementAtEvent(event) as any;
      if (option && option[0] && this.chartLegend[(option[0]._index)]) {
        const axislabel = this.chartLegend[(option[0]._index)];

        const fieldId = this.timeseriesData.timeSeries.fieldId;
        let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
        this.removeOldFilterCriteria(appliedFilters);
        if (appliedFilters.length > 0) {
          const cri = appliedFilters.filter(fill => fill.conditionFieldValue === axislabel.code);
          if (cri.length === 0) {
            const critera1: Criteria = new Criteria();
            critera1.fieldId = fieldId;
            critera1.conditionFieldId = fieldId;
            critera1.conditionFieldValue = axislabel.code;
            critera1.blockType = BlockType.COND;
            critera1.conditionOperator = ConditionOperator.EQUAL;
            appliedFilters.push(critera1);
          }
        } else {
          appliedFilters = [];
          const critera1: Criteria = new Criteria();
          critera1.fieldId = fieldId;
          critera1.conditionFieldId = fieldId
          critera1.conditionFieldValue = axislabel.code;
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          appliedFilters.push(critera1);
        }
        appliedFilters.forEach(app => this.filterCriteria.push(app));
        this.applyFilters();
      }

    }
  }

  /**
   * function to set legend position and visibility
   */
  setLegendForChart(): void {
    this.timeSeriesOption.legend = {
      display: this.timeseriesData.timeSeries.isEnableLegend ? true : false,
      position: this.timeseriesData.timeSeries.legendPosition,
      onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
        // call protype of stacked bar chart componenet
        if(this.timeseriesData.timeSeries.chartType !== 'BAR'){
          if(!(this.timeseriesData.timeSeries.groupWith !=='' && this.timeseriesData.timeSeries.fieldId !== '' && this.timeseriesData.timeSeries.distictWith !=='')){
            this.legendClick(legendItem);
          }
        }
      }
    }
  }

  applyFilters(){
    this.emitEvtFilterCriteria(this.filterCriteria);
    // this.lablels = [];
    // this.chartLegend = [];
    // this.widgetInf.next(this.widgetInf.getValue());
  }
}