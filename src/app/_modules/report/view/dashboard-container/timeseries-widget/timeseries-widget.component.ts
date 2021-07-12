import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { TimeDisplayFormat, ChartDataSets, ChartOptions, ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ButtonArr, ChartLegend, ChartType, ConditionOperator, Criteria, DisplayCriteria, SeriesWith, TimeSeriesWidget, WidgetColorPalette, WidgetType } from '../../../_models/widget';
import * as zoomPlugin from 'chartjs-plugin-zoom';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartType as CType } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
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

  chartType: CType;
  responseData: any;
  displayCriteriaOptions = [
    {
      key: 'Text',
      value: DisplayCriteria.TEXT
    },
    {
      key: 'Code',
      value: DisplayCriteria.CODE
    },
    {
      key: 'Code and Text',
      value: DisplayCriteria.CODE_TEXT
    }
  ];
  displayCriteriaOption: DisplayCriteria = this.displayCriteriaOptions[0].value;

  timeDateFormat: TimeDisplayFormat;
  dataSet: ChartDataSets[] = [{ data: [] }];
  dataSetlabel: Label[] = [];
  widgetInf: BehaviorSubject<TimeSeriesWidget> = new BehaviorSubject<TimeSeriesWidget>(null);
  public afterColorDefined: BehaviorSubject<WidgetColorPalette> = new BehaviorSubject<WidgetColorPalette>(null);
  timeseriesData: TimeSeriesWidget = {} as TimeSeriesWidget;
  lineChartPlugins = [zoomPlugin];
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
        formatter: ((value: any, context: Context) => {
          return value;
        })
      },
      zoom: {
        pan: {
          enabled: false
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
        if (this.timeseriesData.timeSeries.chartType !== ChartType.BAR && this.timeseriesData.timeSeries.fieldId !== '') {
          this.legendClick(legendItem);
        }
      }
    },
    onClick: (event?: MouseEvent, activeElements?: Array<{}>) => {
      console.log('No filter will be applied while we click on bar/line/dots/datalabels.');
      // this.stackClickFilter(event, activeElements);
    }
  };

  /**
   * When reset filter from main container value should be true
   */
  @Input()
  hasFilterCriteria: boolean;

  isLoading = true;

  subscriptions: Subscription[] = [];

  userDetails: Userdetails = new Userdetails();
  // totalCount: any;

  constructor(
    private widgetService: WidgetService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,
    public matDialog: MatDialog) {
    super(matDialog);
  }

  ngOnDestroy(): void {
    this.widgetInf.complete();
    this.widgetInf.unsubscribe();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {

    if (changes && changes.hasFilterCriteria && changes.hasFilterCriteria.currentValue) {
      this.clearFilterCriteria();
    }

    if (changes && changes.filterCriteria && changes.filterCriteria.currentValue !== changes.filterCriteria.previousValue) {
      this.lablels = [];
      this.chartLegend = [];
      this.widgetInf.next(this.widgetInf.getValue());
    }
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      date: new FormControl(''),
    });


    const startDateCtrl = this.startDateCtrl.valueChanges.subscribe(data => {
      this.emitDateChangeValues();
    });
    this.subscriptions.push(startDateCtrl);

    const endDateCtrl = this.endDateCtrl.valueChanges.subscribe(data => {
      this.emitDateChangeValues();
    });
    this.subscriptions.push(endDateCtrl);

    const getDisplayCriteria = this.widgetService.getDisplayCriteria(this.widgetInfo.widgetId, this.widgetInfo.widgetType).subscribe(res => {
      this.displayCriteriaOption = res.displayCriteria;
    }, error => {
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(getDisplayCriteria);

    this.getTimeSeriesMetadata();
    const widgeInf = this.widgetInf.subscribe(metadata => {
      if (metadata) {
        this.getwidgetData(this.widgetId);
        if (this.isLoading) {
          this.updatevalues();
          this.isLoading = false;
          this.afterColorDefined.next(metadata.timeSeries.widgetColorPalette);
        }
      }
    });
    this.subscriptions.push(widgeInf);
    // after color defined update on widget
    const afterColorDefined = this.afterColorDefined.subscribe(res => {
      if (res) {
        this.updateColorBasedOnDefined(res);
      }
    });
    this.subscriptions.push(afterColorDefined);

    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));
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
    if (startdate === enddate) {
      startdate = String(moment().startOf('day').toDate().getTime());
      enddate = String(moment().endOf('day').toDate().getTime());;
    }
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
        critera.widgetType = WidgetType.TIMESERIES;
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
      critera.widgetType = WidgetType.TIMESERIES;
      appliedFilters.push(critera);
    }
    appliedFilters.forEach(app => this.filterCriteria.push(app));

    this.applyFilters();
  }

  /**
   * Get Metadata of Time series chart
   */

  getTimeSeriesMetadata(): void {
    const timeSeriesWidgetInfo = this.widgetService.getTimeseriesWidgetInfo(this.widgetId).subscribe(res => {
      this.timeseriesData = res;
      res.showTotal = true;
      this.chartType = this.timeseriesData.timeSeries.chartType === ChartType.LINE ? 'line' : 'bar';
      this.widgetInf.next(res);
      if (res.timeSeries.fieldId === res.timeSeries.groupWith) {
        this.isGroupByChart = true;
      } else {
        this.isGroupByChart = false;
      }
    }, error => console.error(`Error : ${error}`));
    this.subscriptions.push(timeSeriesWidgetInfo);
  }

  /**
   * Set Chart properties based on metadata
   */
  setChartProperties(): void {
    /**
     * SET TICKS HERE
     */
    const metadata = this.widgetInf.getValue() ? this.widgetInf.getValue() : {} as TimeSeriesWidget;
    if (this.timeseriesData.timeSeries.scaleFrom !== null && this.timeseriesData.timeSeries.scaleFrom !== undefined
      && this.timeseriesData.timeSeries.scaleTo !== null && this.timeseriesData.timeSeries.scaleTo !== undefined
      && this.timeseriesData.timeSeries.stepSize !== null && this.timeseriesData.timeSeries.stepSize !== undefined) {
      const ticks = { min: this.timeseriesData.timeSeries.scaleFrom, max: this.timeseriesData.timeSeries.scaleTo, stepSize: this.timeseriesData.timeSeries.stepSize };
      if (this.timeseriesData.timeSeries.chartType === ChartType.BAR || (this.timeseriesData.timeSeries.chartType === ChartType.LINE && (this.isGroupByChart || metadata.timeSeries.fieldId.toLocaleLowerCase() === 'time_taken' || metadata.timeSeries.bucketFilter || (metadata.timeSeries && ((!metadata.timeSeries.fieldId || metadata.timeSeries.fieldId === '') && metadata.timeSeries.groupWith && metadata.timeSeries.distictWith))))) {
        this.timeSeriesOption.scales = {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.xAxisLabel ? this.timeseriesData.timeSeries.xAxisLabel : '',
            },
            ticks: {
              padding: this.timeseriesData.timeSeries.isEnableDatalabels && (this.timeseriesData.timeSeries.datalabelsPosition === 'start' || this.timeseriesData.timeSeries.datalabelsPosition === 'center') ? 20 : 0
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.yAxisLabel ? this.timeseriesData.timeSeries.yAxisLabel : ''
            }, ticks
          }]
        };
      } else {
        this.timeSeriesOption.scales = {
          xAxes: [{
            type: 'time',
            time: {
              unit: this.timeseriesData.timeSeries.seriesWith,
              unitStepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.xAxisLabel ? this.timeseriesData.timeSeries.xAxisLabel : ''
            }, ticks: {
              padding: this.timeseriesData.timeSeries.isEnableDatalabels && (this.timeseriesData.timeSeries.datalabelsPosition === 'start' || this.timeseriesData.timeSeries.datalabelsPosition === 'center') ? 20 : 0
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.yAxisLabel ? this.timeseriesData.timeSeries.yAxisLabel : ''
            }, ticks
          }]
        }
      }
    } else {
      if (this.timeseriesData.timeSeries.chartType === ChartType.BAR || (this.timeseriesData.timeSeries.chartType === ChartType.LINE && (this.isGroupByChart || metadata.timeSeries.fieldId.toLocaleLowerCase() === 'time_taken' || metadata.timeSeries.bucketFilter || (metadata.timeSeries && ((!metadata.timeSeries.fieldId || metadata.timeSeries.fieldId === '') && metadata.timeSeries.groupWith && metadata.timeSeries.distictWith))))) {
        this.timeSeriesOption.scales = {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.xAxisLabel ? this.timeseriesData.timeSeries.xAxisLabel : ''
            }, ticks: {
              padding: this.timeseriesData.timeSeries.isEnableDatalabels && (this.timeseriesData.timeSeries.datalabelsPosition === 'start' || this.timeseriesData.timeSeries.datalabelsPosition === 'center') ? 20 : 0
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.yAxisLabel ? this.timeseriesData.timeSeries.yAxisLabel : ''
            },
            ticks: {
              padding: this.timeseriesData.timeSeries.isEnableDatalabels && (this.timeseriesData.timeSeries.datalabelsPosition === 'start' || this.timeseriesData.timeSeries.datalabelsPosition === 'center') ? 40 : 0
            }
          }]
        };
      } else {
        this.timeSeriesOption.scales = {
          xAxes: [{
            type: 'time',
            time: {
              unit: this.timeseriesData.timeSeries.seriesWith,
              unitStepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.xAxisLabel ? this.timeseriesData.timeSeries.xAxisLabel : ''
            }, ticks: {
              padding: this.timeseriesData.timeSeries.isEnableDatalabels && (this.timeseriesData.timeSeries.datalabelsPosition === 'start' || this.timeseriesData.timeSeries.datalabelsPosition === 'center') ? 20 : 0
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.timeseriesData.timeSeries.yAxisLabel ? this.timeseriesData.timeSeries.yAxisLabel : ''
            },
            ticks: {
              padding: this.timeseriesData.timeSeries.isEnableDatalabels && (this.timeseriesData.timeSeries.datalabelsPosition === 'start' || this.timeseriesData.timeSeries.datalabelsPosition === 'center') ? 40 : 0
            }
          }]
        };
      }
    }
    if (this.chart) {
      this.chart.options.scales = this.timeSeriesOption.scales;
      this.chart.chart.options.scales = this.timeSeriesOption.scales;
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
      const res = appliedFilters.filter(fill => fill.fieldId === fieldId && fill.widgetType === WidgetType.TIMESERIES && this.timeseriesData.isEnableGlobalFilter);
      if (res.length !== 0) {
        res.forEach(val => {
          val.conditionFieldValue = clickedLegend;
        })
      }
      const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLegend);
      if (cri.length === 0) {
        const critera1: Criteria = new Criteria();
        critera1.fieldId = fieldId;
        critera1.conditionFieldId = fieldId;
        critera1.conditionFieldValue = clickedLegend;
        critera1.blockType = BlockType.COND;
        critera1.conditionOperator = ConditionOperator.EQUAL;
        critera1.widgetType = WidgetType.TIMESERIES;
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
      critera1.widgetType = WidgetType.TIMESERIES;
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
    this.widgetService.getWidgetData(String(widgetId), this.filterCriteria, '', '', this.userDetails.selfServiceUserModel.timeZone).subscribe(response => {
      this.responseData = response;
      this.updateChart(this.responseData)
    });
  }

  private updateChart(responseData) {
    if (responseData !== null) {
      const metadata = this.widgetInf.getValue() ? this.widgetInf.getValue() : {} as TimeSeriesWidget;
      if (this.isGroupByChart) {
        this.transformForGroupBy(responseData);
      } else if (metadata.timeSeries && (metadata.timeSeries.fieldId && metadata.timeSeries.groupWith && metadata.timeSeries.distictWith)) {
        this.dataSet = this.transformDataForComparison(responseData, true);
      } else if (metadata.timeSeries && ((!metadata.timeSeries.fieldId || metadata.timeSeries.fieldId === '') && metadata.timeSeries.groupWith && metadata.timeSeries.distictWith)) {
        this.transformForGroupBy(responseData, true);
      } else if (metadata.timeSeries.fieldId === 'TIME_TAKEN' || metadata.timeSeries.bucketFilter) {
        this.tarnsformForShowInPercentage(responseData, metadata.timeSeries.showInPercentage);
      } else {
        if (this.timeseriesData.timeSeries.chartType === 'BAR') {
          this.dataSet = this.transformDataForComparison(responseData);
        } else {
          this.showFilterOption = true;
          this.dataSet = this.transformDataSets(responseData);
        }
        if (this.filterCriteria.length === 0) {
          this.dateFilters.forEach(ele => {
            ele.isActive = false;
          });
          this.startDateCtrl.setValue(null);
          this.endDateCtrl.setValue(null);
        }
      }

      if (this.chart) {
        this.chart.update();
      }
    }
  }

  transformDataSets(data: any): any {
    const fieldId = this.timeseriesData.timeSeries.fieldId;
    const finalOutput = new Object();
    const codetextObj = {};
    const cordKeys = ['x', 'y'];
    const totalCount = [];
    const aggregation = data.aggregations['date_histogram#date'] ? data.aggregations['date_histogram#date'] : data.aggregations[''];
    if (aggregation.buckets !== undefined && aggregation.buckets.length > 0) {
      aggregation.buckets.forEach(singleBucket => {
        const res = Object.keys(singleBucket);
        const value = res.filter(text => {
          return text.includes('terms#term');
        })
        const arrBuckets = singleBucket[value[0]] ? singleBucket[value[0]].buckets : [];
        arrBuckets.forEach(innerBucket => {
          const docTotalCount = innerBucket.doc_count;
          let label = innerBucket.key;
          const textTermBucket = innerBucket['sterms#textTerm'] ? innerBucket['sterms#textTerm'].buckets : null;
          if (textTermBucket) {
            textTermBucket.forEach(bucket => {
              const labelCode = label = this.codeTextValue(textTermBucket[0], fieldId);
              label = labelCode.t ? labelCode.t : labelCode.c ? labelCode.c : labelCode;
            })
          }
          codetextObj[label] = innerBucket.key;
          if (Object.keys(finalOutput).includes(label)) {
            const array = finalOutput[label];
            const objdt = new Object();
            objdt[cordKeys[0]] = singleBucket.key_as_string;
            objdt[cordKeys[1]] = docTotalCount;
            array.push(objdt);
            if (this.widgetInf.getValue().showTotal) {
              if (totalCount.length) {
                const index = totalCount.findIndex(item => item.x === singleBucket.key_as_string);
                if (index > -1) {
                  totalCount[index].y = totalCount[index].y + docTotalCount;
                }
                else {
                  const total = new Object();
                  total[cordKeys[0]] = singleBucket.key_as_string;
                  total[cordKeys[1]] = docTotalCount;
                  totalCount.push(total);
                }
              }
              else {
                const total = new Object();
                total[cordKeys[0]] = singleBucket.key_as_string;
                total[cordKeys[1]] = docTotalCount;
                totalCount.push(total);
              }
            }
            finalOutput[label] = array;

          } else {
            const objdt = new Object();
            objdt[cordKeys[0]] = singleBucket.key_as_string;
            objdt[cordKeys[1]] = docTotalCount;
            const array = new Array();
            array.push(objdt);
            if (this.widgetInf.getValue().showTotal) {
              if (totalCount.length) {
                const index = totalCount.findIndex(item => item.x === singleBucket.key_as_string);
                if (index > -1) {
                  totalCount[index].y = totalCount[index].y + docTotalCount;
                }
                else {
                  const total = new Object();
                  total[cordKeys[0]] = singleBucket.key_as_string;
                  total[cordKeys[1]] = docTotalCount;
                  totalCount.push(total);
                }
              }
              else {
                const total = new Object();
                total[cordKeys[0]] = singleBucket.key_as_string;
                total[cordKeys[1]] = docTotalCount;
                totalCount.push(total);
              }
            }
            finalOutput[label] = array;
          }
        });
      });
    }

    if (this.widgetInf.getValue().showTotal) {
      let showTotal = true;
      this.filterCriteria.forEach(filter => {
        if (filter.conditionFieldValue !== 'Total') {
          const index = Object.keys(finalOutput).indexOf(filter.conditionFieldValue);
          if (index > -1) {
            showTotal = false;
          }
        }
      });
      const total = 'Total'
      if (showTotal) {
        codetextObj[total] = 'Total';
        finalOutput[total] = totalCount;
      } else {
        delete codetextObj[total];
        delete finalOutput[total];
      }
    }

    /**
     * TRANSFORM _ DATASETS
     */
    this.chartLegend = [];
    const arrKeys = ['data', 'id', 'label', 'fill', 'border'];
    let datasets = new Array();
    Object.keys(finalOutput).forEach((status, index) => {
      const dataSet = new Object();
      dataSet[arrKeys[0]] = finalOutput[status];
      dataSet[arrKeys[1]] = status;
      dataSet[arrKeys[2]] = this.checkTextCode({ text: status, code: codetextObj[status] });
      dataSet[arrKeys[3]] = false;
      dataSet[arrKeys[4]] = this.getUpdatedColorCode(status);
      const chartLegend = { text: status, code: codetextObj[status], legendIndex: this.chartLegend.length };
      this.chartLegend.push(chartLegend);
      datasets.push(dataSet);
      this.setLegendForChart();
    });

    if (this.timeseriesData.timeSeries.dataSetSize) {
      this.chartLegend = _.take(this.chartLegend, this.timeseriesData.timeSeries.dataSetSize);
      datasets = _.take(datasets, this.timeseriesData.timeSeries.dataSetSize);
    }
    console.log(datasets);

    return datasets;
  }

  /**
   * Transform datasets when need comparison year wise month wise...
   * @param res server res
   */
  transformDataForComparison(res: any, forDistinct?: boolean) {
    const fieldId = this.timeseriesData.timeSeries.fieldId;
    let finalOutput = new Array();
    this.dataSetlabel = [];
    const tempDataSetlabel = [];
    const objData = {};
    this.chartLegend = [];
    const totalCount = {};
    const aggregation = res ? res.aggregations['date_histogram#date'] : [];
    if (aggregation.buckets !== undefined && aggregation.buckets.length > 0) {
      aggregation.buckets.forEach(singleBucket => {
        const milliVal = singleBucket.key_as_string;
        const resValue = Object.keys(singleBucket);
        const value = resValue.filter(data => {
          return data.includes('terms#term');
        })
        const arrBuckets = singleBucket[value[0]] ? singleBucket[value[0]].buckets : [];
        const arrcount = new Array();
        const dataSet = new Object();
        arrBuckets.forEach(arrBucket => {
          const bucket = arrBuckets.filter(fil => fil.key === arrBucket.key)[0];
          const count = bucket ? (forDistinct ? (bucket['cardinality#count'] ? bucket['cardinality#count'].value : 0) : bucket.doc_count) : 0;
          let label = '';
          let codeValue = '';
          if (forDistinct) {
            const labelCode = this.codeTextValue(arrBucket, fieldId);
            label = labelCode.t ? labelCode.t : labelCode;
            codeValue = labelCode.c ? labelCode.c : labelCode;
          } else {
            const txtvalue = Object.keys(bucket);
            const txtlabel = txtvalue.filter(data => {
              return data.includes('terms#textTerm');
            })
            const textTermBucket = bucket && bucket[txtlabel[0]] ? bucket[txtlabel[0]].buckets : [];
            textTermBucket.forEach(innerBucket => {
              const labelCode = label = this.codeTextValue(innerBucket, fieldId);
              label = labelCode.t ? labelCode.t : labelCode.c ? labelCode.c : labelCode;
              codeValue = labelCode.c ? labelCode.c : labelCode;
            });
          }
          const chartLegend = { text: label, code: codeValue, legendIndex: this.chartLegend.length };
          const exist = this.chartLegend.filter(map => map.code === codeValue);
          if (exist.length === 0) {
            this.chartLegend.push(chartLegend);
            if (this.dataSetlabel.indexOf(codeValue) === -1) {
              label.length > 0 ? tempDataSetlabel.push(label) : tempDataSetlabel.push(arrBucket.key);
              this.dataSetlabel.push(this.checkTextCode(chartLegend));
            }
          }
          dataSet[label] = count;
        });
        tempDataSetlabel.forEach(key => {
          if (Object.keys(dataSet).includes(key.toString())) {
            arrcount.push(dataSet[key.toString()]);
          } else {
            arrcount.push(0);
          }
          if (dataSet[key]) {
            if (totalCount[key]) {
              totalCount[key] = totalCount[key] + +dataSet[key];
            } else {
              totalCount[key] = dataSet[key];
            }
          }
        });
        // Prepare datasets for comparison in timeseries
        if (objData[milliVal] !== undefined) {
          const oldArray = objData[milliVal];
          const lengthOfArr = arrcount.length > oldArray.length ? oldArray.length : arrcount.length;
          for (let i = 0; i < lengthOfArr.length; i++) {
            arrcount[i] = arrcount[i] + oldArray[i];
            if (totalCount[i]) {
              totalCount[i] = totalCount[i] + arrcount[i];
            } else {
              totalCount[i] = arrcount[i];
            }
          }
        }
        // this.totalCount = totalCount;
        objData[milliVal] = arrcount;
      });
    }

    const arrKeyF = ['label', 'data'];
    Object.keys(objData).forEach((status, index) => {
      const label = {};
      label[arrKeyF[0]] = status;
      label[arrKeyF[1]] = objData[status];
      finalOutput.push(label);
    });

    if (this.timeseriesData.timeSeries.dataSetSize) {
      finalOutput = _.take(finalOutput, this.timeseriesData.timeSeries.dataSetSize);
    }
    this.timeSeriesOption.scales = { xAxes: [{}], yAxes: [{}] };
    this.setLegendForChart(); // calling it to set legend
    finalOutput.forEach((label, index) => {
      const scale = {
        id: 'bar-x-' + index,
        type: 'category',
        gridLines: {
          offsetGridLines: true
        },
        display: false,
      }
      this.timeSeriesOption.scales.xAxes.push(scale);
    })
    if (this.widgetInf.getValue().showTotal) {
      if (this.timeseriesData.timeSeries.chartType === ChartType.BAR) {
        const totalDataSet: ChartDataSets =
        {
          label: 'Total',
          data: [],
          xAxisID: 'bar-x-Total',
        };
        Object.values(totalCount).forEach((el: number) => {
          totalDataSet.data.push(el);
        })
        if (Object.keys(totalCount).length) {
          finalOutput.push(totalDataSet);
          // this.totalCount = totalCount;
        }
        else {
          finalOutput.push(totalDataSet);
        }
        const scale = {
          id: 'bar-x-Total',
          type: 'category',
          gridLines: {
            offsetGridLines: true
          },
          offset: true,
          display: false,
          barPercentage: 1.75,
          categoryPercentage: 0.5,
        }
        this.timeSeriesOption.scales.xAxes.push(scale);
      }
    }
    return finalOutput;
  }

  /**
   * Transform for timeseries with grp by same fields ..
   * @param res server response
   */
  transformForGroupBy(res: any, forDistinct?: boolean) {
    const aggregation = res ? res.aggregations['date_histogram#date'] : [];
    const totalCount = {};
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
        Object.keys(yearDoc).forEach((yr) => {
          const dataSet = this.generatedDataBasedonMonth(yearDoc[yr], forDistinct);
          dataSet.forEach((data, ind) => {
            if (totalCount[ind]) {
              totalCount[ind] = totalCount[ind] + data;
            } else {
              totalCount[ind] = data;
            }
          })
          // this.totalCount = totalCount;
          if (yearDoc[yr]) {
            finaldata.push({
              data: dataSet,
              label: `${yr}`,
              fill: false
            });
          }
        });
      }

      this.timeSeriesOption.scales = { xAxes: [{}], yAxes: [{}] };
      this.setLegendForChart(); // calling it to set legend
      const totalDataSet: ChartDataSets =
      {
        label: 'Total',
        data: [],
        fill: false
      };
      if (this.widgetInf.getValue().showTotal) {
        if (this.timeseriesData.timeSeries.chartType === ChartType.BAR) {
          finaldata.forEach((item, index) => {
            const scaleAxes = {
              id: 'bar-x-' + index,
              type: 'category',
              gridLines: {
                offsetGridLines: true
              },
              display: false,
            }
            this.timeSeriesOption.scales.xAxes.push(scaleAxes);
          })

          const scale = {
            id: 'bar-x-Total',
            type: 'category',
            gridLines: {
              offsetGridLines: true
            },
            offset: true,
            display: false,
            barPercentage: 1.75,
            categoryPercentage: 0.5,
          }
          this.timeSeriesOption.scales.xAxes.push(scale);
          totalDataSet.xAxisID = 'bar-x-Total';
        }
        Object.values(totalCount).forEach((el: number) => {
          totalDataSet.data.push(el);
        })
        if (Object.keys(totalCount).length) {
          finaldata.push(totalDataSet);
          // this.totalCount = totalCount;
        }
        else {
          finaldata.push(totalDataSet);
        }
      }
      this.dataSet = finaldata;
    }
  }


  tarnsformForShowInPercentage(res: any, showInPercentage: boolean) {
    const aggregation = res ? res.aggregations['date_histogram#date'] : [];
    const totalCount = {};
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
        Object.keys(yearDoc).forEach((yr) => {
          const dataSet = this.bucketModify(yearDoc[yr], showInPercentage);
          dataSet.forEach((data, index) => {
            if (totalCount[index]) {
              totalCount[index] = totalCount[index] + data;
            } else {
              totalCount[index] = data;
            }
          })
          if (yearDoc[yr]) {
            finaldata.push({
              data: dataSet,
              label: `${yr}`,
              fill: false
            });
          }
        });
      }
      // this.timeSeriesOption.scales = { xAxes: [{}], yAxes: [{}] };
      this.setLegendForChart(); // calling it to set legend
      const totalDataSet: ChartDataSets =
      {
        label: 'Total',
        data: [],
        fill: false
      };
      if (this.widgetInf.getValue().showTotal) {
        if (this.timeseriesData.timeSeries.chartType === ChartType.BAR) {
          finaldata.forEach((item, index) => {
            const scalexAxes = {
              id: 'bar-x-' + index,
              type: 'category',
              gridLines: {
                offsetGridLines: true
              },
              display: false,
            }
            this.timeSeriesOption.scales.xAxes.push(scalexAxes);
          })

          const scale = {
            id: 'bar-x-Total',
            type: 'category',
            gridLines: {
              offsetGridLines: true
            },
            offset: true,
            display: false,
            barPercentage: 1.75,
            categoryPercentage: 0.5,
          }
          this.timeSeriesOption.scales.xAxes.push(scale);
          totalDataSet.xAxisID = 'bar-x-Total';
        }
        Object.values(totalCount).forEach((el: number) => {
          totalDataSet.data.push(el);
        })

        let showTotal = true;
        this.filterCriteria.forEach(filter => {
          const index = this.dataSetlabel.indexOf(filter.conditionFieldValue);
          if (index > -1) {
            showTotal = false;
          }
        });
        if (showTotal) {
          if (Object.keys(totalCount).length) {
            finaldata.push(totalDataSet);
          }
        }
      }
      this.dataSet = finaldata;
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
      if (this.startDateCtrl.value === this.endDateCtrl.value) {
        this.endDateCtrl.setValue(String(Number(this.startDateCtrl.value) + 24 * 60 * 60 * 1000));
      }
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
      if (dataArr[key]) {
        dataArr.data.forEach((dataObj, index) => {
          const obj = {} as any;
          obj[this.timeseriesData.timeSeries.metaData ? this.timeseriesData.timeSeries.metaData.fieldDescri : this.timeseriesData.timeSeries.metaData.fieldId] = dataArr[key];
          this.dateAndCountFormat(dataObj, obj, dataArr);
          excelData.push(obj);
        })
      }
      else {
        dataArr.data.forEach((dataObj, index) => {
          const obj = {} as any;
          // In case of field ID is there..
          if (this.timeseriesData.timeSeries.metaData.fieldId) {
            obj[this.timeseriesData.timeSeries.metaData ? this.timeseriesData.timeSeries.metaData.fieldDescri : this.timeseriesData.timeSeries.metaData.fieldId] = this.chartLegend.length > 0 ? (this.chartLegend[index].text.length > 0 ? this.chartLegend[index].text + '\t' : this.chartLegend[index].code + '\t') : this.dataSetlabel[index] + '\t';
          }
          // In case of field ID is blank - groupWith and DistinctWith are there..
          else {
            obj[this.timeseriesData.timeSeries.distictWith] = this.chartLegend.length > 0 ? (this.chartLegend[index].text.length > 0 ? this.chartLegend[index].text + '\t' : this.chartLegend[index].code + '\t') : this.dataSetlabel[index] + '\t';
          }
          // checking format of data to be downloaded..
          this.dateAndCountFormat(dataObj, obj, dataArr);
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
          const res = appliedFilters.filter(fill => fill.fieldId === fieldId && fill.widgetType === WidgetType.TIMESERIES && this.timeseriesData.isEnableGlobalFilter);
          if (res.length !== 0) {
            res.forEach(val => {
              val.conditionFieldValue = axislabel.code;
            })
          }
          const cri = appliedFilters.filter(fill => fill.conditionFieldValue === axislabel.code);
          if (cri.length === 0) {
            const critera1: Criteria = new Criteria();
            critera1.fieldId = fieldId;
            critera1.conditionFieldId = fieldId;
            critera1.conditionFieldValue = axislabel.code;
            critera1.blockType = BlockType.COND;
            critera1.conditionOperator = ConditionOperator.EQUAL;
            critera1.widgetType = WidgetType.TIMESERIES;
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
          critera1.widgetType = WidgetType.TIMESERIES;
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
    if (this.timeseriesData.timeSeries.isEnableLegend) {
      this.timeSeriesOption.legend = {
        ...this.timeSeriesOption.legend,
        display: true,
        position: this.timeseriesData.timeSeries.legendPosition || 'top',
      };
      if (this.chart) {
        this.chart.options.legend = this.timeSeriesOption.legend;
        this.chart.chart.options.legend = this.timeSeriesOption.legend;
      }
    }

    if (this.timeseriesData.timeSeries.isEnableDatalabels) {
      this.timeSeriesOption.plugins.datalabels = {
        align: this.timeseriesData.timeSeries.datalabelsPosition || 'end',
        anchor: this.timeseriesData.timeSeries.datalabelsPosition || 'end',
        display: 'auto',
        formatter: ((value: any, context: Context) => {
          return value ? value.y ? value.y : value : value;
        })
      };
      if (this.chart) {
        this.chart.options.plugins.datalabels = this.timeSeriesOption.plugins.datalabels;
        this.chart.chart.options.plugins.datalabels = this.timeSeriesOption.plugins.datalabels;
      }
    }
    this.setChartProperties();
  }

  applyFilters() {
    this.emitEvtFilterCriteria(this.filterCriteria);
    // this.lablels = [];
    // this.chartLegend = [];
    // this.widgetInf.next(this.widgetInf.getValue());
  }

  updatevalues() {
    this.timeseriesData = this.widgetInf.getValue();
    const hasBtn = this.dateFilters.filter(fil => fil.value === (this.timeseriesData.timeSeries.startDate))[0];
    if (hasBtn) {
      const index = this.dateFilters.indexOf(hasBtn);
      this.dateFilters.splice(index, 1);
      hasBtn.isActive = true;
      this.dateFilters.splice(index, 0, hasBtn);
      if (!this.timeseriesData.timeSeries.distictWith) {
        this.updateForm('date', hasBtn);
      }
    }
  }

  codeTextValue(innerBucket: any, fieldId: string): any {
    let labelValue = '';
    const hits = innerBucket['top_hits#data_hits'] ? innerBucket['top_hits#data_hits'].hits.hits[0] : null;
    const val = hits ? hits._source.hdvs ? (hits._source.hdvs[fieldId] ?
      (hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null) :
      (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        (hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null : null;
    if (val) {
      if (fieldId === 'OVERDUE' || fieldId === 'FORWARDENABLED' || fieldId === 'TIME_TAKEN' || this.timeseriesData.timeSeries.metaData.picklist === '35') {
        labelValue = this.getFields(fieldId, val[0].c);
      } else {
        labelValue = val[0];
      }
    } else {
      labelValue = innerBucket.key;
    }
    return labelValue;
  }

  saveDisplayCriteria() {
    const saveDisplayCriteria = this.widgetService.saveDisplayCriteria(this.widgetInfo.widgetId, this.widgetInfo.widgetType, this.displayCriteriaOption).subscribe(res => {
      this.updateChart(this.responseData)
    }, error => {
      console.error(`Error : ${error}`);
      this.snackBar.open(`Something went wrong`, 'Close', { duration: 3000 });
    });
    this.subscriptions.push(saveDisplayCriteria);
  }

  checkTextCode(value: { code: string; text: string; }): string {
    switch (this.displayCriteriaOption) {
      case DisplayCriteria.CODE:
        if (value.code) {
          return value.code;
        }
        break;
      case DisplayCriteria.TEXT:
        if (value.text) {
          return value.text;
        }
        break;
      default:
        return `${value.code} -- ${value.text || ''}`;
        break;
    }
    return '';
  }

  dateAndCountFormat(objData, obj, dataArr) {
    switch (this.timeseriesData.timeSeries.seriesWith) {
      case SeriesWith.day:
        obj.Day = objData.x ? objData.x + '\t' : dataArr.label + '\t';
        break;

      case SeriesWith.week:
        obj.Week = objData.x ? objData.x + '\t' : dataArr.label + '\t';
        break;

      case SeriesWith.month:
        obj.Month = objData.x ? objData.x + '\t' : dataArr.label + '\t';
        break;

      case SeriesWith.quarter:
        obj.Quater = objData.x ? objData.x + '\t' : dataArr.label + '\t';
        break;

      case SeriesWith.year:
        obj.Year = objData.x ? objData.x + '\t' : dataArr.label + '\t';
        break;

      default:
        break;
    }
    obj.Count = objData.y ? objData.y + '\t' : objData + '\t';
  }
}