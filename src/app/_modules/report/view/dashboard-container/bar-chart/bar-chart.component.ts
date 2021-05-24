import { Component, OnInit, OnChanges, ViewChild, LOCALE_ID, Inject, SimpleChanges, OnDestroy } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BarChartWidget, Criteria, WidgetHeader, ChartLegend, ConditionOperator, BlockType, Orientation, WidgetColorPalette, DisplayCriteria, AlignPosition, WidgetType } from '../../../_models/widget';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChartOptions, ChartTooltipItem, ChartData, ChartDataSets, ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GenericWidgetComponent implements OnInit, OnChanges, OnDestroy {

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
  barWidget: BehaviorSubject<BarChartWidget> = new BehaviorSubject<BarChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  chartLegend: ChartLegend[] = [];
  lablels: string[] = [];
  dataSet: string[] = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  orientation = 'bar';
  total = 0;

  minBarSizeThreshold = 5;
  maxBarSizeThreshold = 100;
  zoomStep = 5;
  minBarWidth = 10 ;
  computedSize = {
    height : 100,
    width : 100
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
          if (isNaN(parseInt(tooltipItem.value, 10))) {
            return '';
          }
          return `${tooltipItem.value}`;
        }
      },
      displayColors: false
    },
    onClick: (event?: MouseEvent, activeElements?: Array<{}>) => {
      this.stackClickFilter(event, activeElements);
    },
    legend: {
      display: false,
      onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
        // call protype of stacked bar chart componenet
        this.legendClick(legendItem);
      }
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
          onPan : () =>{
            console.log('paneed')
          },
          onPanComplete: () =>{
              console.log('panned')
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

  public barChartData: any[] = [
    {
      label: 'Loading..',
      stack: 'a',
      barThickness: 80,
      data: [0, 0, 0, 0, 0, 0, 0]
    },
  ];
  returndata: any;
  subscriptions: Subscription[] = [];

  constructor(
    private widgetService: WidgetService,
    private snackBar: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog
  ) {
    super(matDialog);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.filterCriteria && changes.filterCriteria.previousValue !== changes.filterCriteria.currentValue && !this.widgetHeader.isEnableGlobalFilter) {
      this.lablels = [];
      this.chartLegend = [];
      this.barWidget.next(this.barWidget.getValue());
    }
    if(changes && changes.boxSize && changes.boxSize.previousValue !== changes.boxSize.currentValue) {
      this.boxSize = changes.boxSize.currentValue;
    }
  }

  ngOnInit(): void {
    this.getBarChartMetadata();
    this.getHeaderMetaData();
    this.barWidget.subscribe(res => {
      if (res) {
        this.getBarChartData(this.widgetId, this.filterCriteria);
      }
    });

    // after color defined update on widget
    const afterColorDefined = this.afterColorDefined.subscribe(res=>{
      if(res) {
        this.updateColorBasedOnDefined(res);
      }
    });
    this.subscriptions.push(afterColorDefined);

    /*
    const getDisplayCriteria =  this.widgetService.getDisplayCriteria(this.widgetInfo.widgetId, this.widgetInfo.widgetType).subscribe(res => {
      this.displayCriteriaOption = this.displayCriteriaOptions.find(d => d.key === res.displayCriteria);
    }, error => {
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(getDisplayCriteria);
    */
  }

  ngOnDestroy() {
    this.barWidget.complete();
    this.barWidget.unsubscribe();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  public getHeaderMetaData(): void {
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData => {
      this.widgetHeader = returnData;
    }, error => console.error(`Error : ${error}`));
  }

  public getBarChartMetadata(): void {
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata => {
      this.widgetColorPalette = returndata.widgetColorPalette;
      this.barWidget.next(returndata);
      this.getBarConfigurationData();
    }, error => {
      console.error(`Error : ${error}`);
    });
  }

  public getBarConfigurationData(): void {
    // Bar orientation
    this.orientation = this.barWidget.getValue().orientation === Orientation.VERTICAL ? 'bar' : 'horizontalBar';
    if (this.barWidget.getValue().orientation === Orientation.HORIZONTAL) {
      this.barChartOptions.plugins.zoom.pan.enabled = false;
      this.barChartOptions.plugins.zoom.zoom.enabled = false;
    } else {
      this.barChartOptions.plugins.zoom.pan.enabled = true;
      this.barChartOptions.plugins.zoom.zoom.enabled = true;
    }

    // if showLegend flag will be true it show legend on Bar widget
    if (this.barWidget.getValue().isEnableLegend) {
      this.barChartOptions.legend = {
          ...this.barChartOptions.legend,
          display: true,
          position: this.barWidget.getValue().legendPosition
      };
      if (this.chart) {
        this.chart.options.legend = this.barChartOptions.legend;
        this.chart.chart.options.legend = this.barChartOptions.legend;
      }
    }

    // if showCountOnStack flag will be true it show datalables on stack and position of datalables also configurable
    if (this.barWidget.getValue().isEnableDatalabels) {
      this.barChartOptions.plugins.datalabels = {
        ...this.barChartOptions.plugins.datalabels,
        display: true,
        align: this.barWidget.getValue().datalabelsPosition,
        anchor: this.barWidget.getValue().datalabelsPosition,
      };
      if (this.barWidget.getValue().datalabelsPosition === AlignPosition.END) {
        // Datalabel was being cut off the screen when the height was small.
        this.barChartOptions.plugins.datalabels.offset = 0;
        this.barChartOptions.plugins.datalabels.padding = 0;
      }
      if (this.chart) {
        this.chart.options.plugins.datalabels = this.barChartOptions.plugins.datalabels;
        this.chart.chart.options.plugins.datalabels = this.barChartOptions.plugins.datalabels;
      }
    }
    // set scale range and axis lebels
    this.setChartAxisAndScaleRange();
   }

   public getBarChartData(widgetId: number, critria: Criteria[]): void {
    this.widgetService.getWidgetData(String(widgetId), critria).subscribe(returndata => {
      this.returndata = returndata;
      this.updateChart(this.returndata);
    });
  }

  private updateChart(returndata) {
    const res = Object.keys(returndata.aggregations);
    const arrayBuckets  = returndata.aggregations[res[0]] ? returndata.aggregations[res[0]].buckets : [];
    this.dataSet = [];
    this.lablels = [];
    this.dataSet = this.transformDataSets(arrayBuckets);
    // update barchartLabels
    if(this.barWidget.getValue().metaData && (this.barWidget.getValue().metaData.picklist === '0' && (this.barWidget.getValue().metaData.dataType === 'DTMS' || this.barWidget.getValue().metaData.dataType === 'DATS'))) {
      if (this.chartLegend.length === 0) {
        this.getDateFieldsDesc(arrayBuckets);
      } else {
        this.setLabels();
      }
    } else if(this.barWidget.getValue().metaData && (this.barWidget.getValue().metaData.picklist === '1' || this.barWidget.getValue().metaData.picklist === '37' || this.barWidget.getValue().metaData.picklist === '30')) {
      if (this.chartLegend.length === 0) {
        this.getFieldsMetadaDesc(arrayBuckets);
      } else {
        this.setLabels();
      }
    } else {
      if (this.chartLegend.length === 0) {
        this.getFieldsDesc(arrayBuckets);
      } else {
        this.setLabels();
      }
    }

    this.setBarChartData();


    // compute graph size

    this.computeGraphSize();

    // update chart after data sets change
    if(this.chart) {
      this.chart.update();
    }
  }

  /**
   * Set barChartData of ChartDataSets[]. This get the legends to show in chart with labels
   */
  setBarChartData() {
    const barChartData: any[] = [];
    let dataIndex = 0;
    this.chartLegend.forEach((legend, index) => {
      const data: number[] = []
      this.dataSet.forEach((d, dIndex) => {
        if (dIndex === dataIndex) {
          data.push(+d);
        } else {
          data.push(null);
        }
      });
      dataIndex = dataIndex + 1;
      const obj: ChartDataSets = {
        data,
        label: this.lablels[index],
        barThickness: 'flex',
        backgroundColor: this.getUpdatedColorCode(legend.code),
        stack: 'a'
      };
      barChartData.push(obj)
    });
    this.barChartData = barChartData;
  }

  /**
   * Update label based on configuration
   * @param buckets update lable
   */
  getFieldsDesc(buckets: any[]) {
    const fldid = this.barWidget.getValue().fieldId;
    let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
    locale = locale.toUpperCase();
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fldid] ?
        ( hits._source.hdvs[fldid] ? hits._source.hdvs[fldid].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fldid]) ?
        ( hits._source.staticFields[fldid] ? hits._source.staticFields[fldid].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          if(v.t) {
            valArray.push(v.t);
          }
        });
        const finalText = valArray.toString();
        if(finalText) {
          finalVal[key] = finalText
        } else {
          finalVal[key] = key;
        }
      } else {
        finalVal[key] = key;
      } if(this.barWidget.getValue().metaData.picklist === '35') {
        finalVal[key] = this.getFields(fldid, key);
      }
    });

    // update lablels
    this.lablels.forEach(cod => {
      let chartLegend: ChartLegend;
      if(cod) {
        const hasData = finalVal[cod];
        if (hasData) {
          chartLegend = { text: hasData, code: cod, legendIndex: this.chartLegend.length };
        } else {
          chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
        }
      } else {
         chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
      }
      this.chartLegend.push(chartLegend);
    });
    this.setLabels();
  }

  setLabels() {
    switch (this.displayCriteriaOption.key) {
      case DisplayCriteria.CODE:
        this.lablels = this.chartLegend.map(map => map.code);
        break;
        case DisplayCriteria.TEXT:
        this.lablels = this.chartLegend.map(map => map.text);
        break;
        default:
        this.lablels = this.chartLegend.map(map => map.code + ' -- ' + map.text);
        break;
    }
  }

  /**
   * Update label based on configuration
   * @param buckets update lable
   */
  getDateFieldsDesc(buckets: any[]) {
    const fldid = this.barWidget.getValue().fieldId;
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fldid] ?
        ( hits._source.hdvs[fldid] ? hits._source.hdvs[fldid].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fldid]) ?
        ( hits._source.staticFields[fldid] ? hits._source.staticFields[fldid].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          if(v.c) {
            valArray.push(v.c);
          }
        });
        const finalText = (Number(valArray));
        if(finalText) {
          finalVal[key] = new Date(finalText).toLocaleDateString();
        } else {
          finalVal[key] = new Date(Number(key)).toLocaleDateString();
        }
      } else {
        finalVal[key] = new Date(Number(key)).toLocaleDateString();
      }
    });

    // update lablels
    this.lablels.forEach(cod => {
      let chartLegend: ChartLegend;
      if(cod) {
        const hasData = finalVal[cod];
        if (hasData) {
          chartLegend = { text: hasData, code: cod, legendIndex: this.chartLegend.length };
        } else {
          chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
        }
      } else {
         chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
      }
      this.chartLegend.push(chartLegend);
    });
    this.setLabels();
  }

  /**
   * Http call for get description of fields code
   *
   */
  getFieldsMetadaDesc(buckets: any[]) {
    const fldid = this.barWidget.getValue().fieldId;
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fldid] ?
        ( hits._source.hdvs[fldid] ? hits._source.hdvs[fldid].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fldid]) ?
        ( hits._source.staticFields[fldid] ? hits._source.staticFields[fldid].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          if(v.t) {
            valArray.push(v.t);
          }
        });
        const finalText = valArray.toString();
        if(finalText) {
          finalVal[key] = finalText
        } else {
          finalVal[key] = key;
        }
      } else {
        finalVal[key] = key;
      } if(fldid === 'OVERDUE' || fldid === 'FORWARDENABLED' || fldid === 'TIME_TAKEN') {
        finalVal[key] = this.getFields(fldid, key);
      }
    });
    // update lablels
    this.lablels.forEach(cod => {
      let chartLegend: ChartLegend;
      if(cod) {
        const hasData = finalVal[cod];
        if (hasData) {
          chartLegend = { text: hasData, code: cod, legendIndex: this.chartLegend.length };
        } else {
          chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
        }
      } else {
         chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
      }
      this.chartLegend.push(chartLegend);
    });
    this.setLabels();
  }

  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
    if(activeElements && activeElements.length) {
      const option = this.chart.chart.getElementAtEvent(event) as any;
      const clickedIndex = (option[0])._index;
      const clickedLagend = this.chartLegend[clickedIndex];
      let drpCode = this.chartLegend[clickedIndex] ? this.chartLegend[clickedIndex].code : this.lablels[clickedIndex];
      if(drpCode === undefined) {
        return false;
      }
      if(drpCode === this.barWidget.value.blankValueAlias){
        drpCode = '';
      }
      const fieldId = this.barWidget.getValue().fieldId;
      let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
      this.removeOldFilterCriteria(appliedFilters);
      if (appliedFilters.length > 0) {
        const res = appliedFilters.filter(fill=> fill.fieldId === fieldId && fill.widgetType === WidgetType.BAR_CHART && this.widgetHeader.isEnableGlobalFilter);
        if(res.length !== 0) {
          res.forEach(val=> {
            val.conditionFieldValue = clickedLagend.code;
          })
        }
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLagend.code);
        if (cri.length === 0) {
          const critera1: Criteria = new Criteria();
          critera1.fieldId = fieldId;
          critera1.conditionFieldId = fieldId;
          critera1.conditionFieldValue = drpCode;
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          critera1.widgetType = WidgetType.BAR_CHART;
          appliedFilters.push(critera1);
        }
      } else {
        appliedFilters = [];
        const critera1: Criteria = new Criteria();
        critera1.fieldId = fieldId;
        critera1.conditionFieldId = fieldId
        critera1.conditionFieldValue = drpCode;
        critera1.blockType = BlockType.COND;
        critera1.conditionOperator = ConditionOperator.EQUAL;
        critera1.widgetType = WidgetType.BAR_CHART;
        appliedFilters.push(critera1);
      }
      if(this.barWidget.getValue().metaData.dataType === 'DTMS' || this.barWidget.getValue().metaData.dataType === 'DATS') {
        appliedFilters.shift();
        appliedFilters.push(this.applyDateFilter(drpCode, fieldId));
      }
      appliedFilters.forEach(app => this.filterCriteria.push(app));
      this.emitEvtFilterCriteria(this.filterCriteria);
    }
  }

  /*
  * download chart data as CSV
  */
  downloadCSV(): void {
    const excelData = [];
    for (let i = 0; i < this.lablels.length; i++) {
      const obj = {} as any;
      obj[this.barWidget.getValue().metaData ? this.barWidget.getValue().metaData.fieldDescri : this.barWidget.getValue().fieldId] = this.lablels[i] + '\t';
      obj.Value = this.dataSet[i] + '\t';
      excelData.push(obj);
    }
    this.widgetService.downloadCSV('Bar-Chart', excelData);
  }

  /*
  * download chart as image
  */
  downloadImage() {
    this.widgetService.downloadImage(this.chart.toBase64Image(), 'Bar-Chart.png');
  }

  /**
   * After click on chart legend
   * legendItem
   */
   legendClick(legendItem: ChartLegendLabelItem) {
    let clickedLegend =  this.chartLegend[legendItem.datasetIndex] ? this.chartLegend[legendItem.datasetIndex].code : '';
    if(clickedLegend === this.barWidget.value.blankValueAlias){
      clickedLegend ='';
    }
    const fieldId = this.barWidget.getValue().fieldId;
    let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
    this.removeOldFilterCriteria(appliedFilters);

      if(appliedFilters.length >0) {
        const res = appliedFilters.filter(fill=> fill.fieldId === fieldId && fill.widgetType === WidgetType.BAR_CHART && this.widgetHeader.isEnableGlobalFilter);
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
          critera1.widgetType = WidgetType.BAR_CHART;
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
        critera1.widgetType = WidgetType.BAR_CHART;
        appliedFilters.push(critera1);
      }
      if(this.barWidget.getValue().metaData.dataType === 'DTMS' || this.barWidget.getValue().metaData.dataType === 'DATS') {
        appliedFilters.shift();
        appliedFilters.push(this.applyDateFilter(clickedLegend, fieldId));
      }
      appliedFilters.forEach(app => this.filterCriteria.push(app));
      this.emitEvtFilterCriteria(this.filterCriteria);
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
   * Use for set scale range and axis labels
   */
  setChartAxisAndScaleRange() {
    if(this.barWidget.getValue().scaleFrom !== null && this.barWidget.getValue().scaleFrom !== undefined
        && this.barWidget.getValue().scaleTo !== null && this.barWidget.getValue().scaleTo !== undefined
        && this.barWidget.getValue().stepSize !== null && this.barWidget.getValue().stepSize !== undefined) {
        const ticks = {min:this.barWidget.getValue().scaleFrom, max:this.barWidget.getValue().scaleTo, stepSize:this.barWidget.getValue().stepSize};
        if(this.barWidget.getValue().orientation === Orientation.HORIZONTAL) {
          this.barChartOptions.scales = {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.barWidget.getValue().xAxisLabel ? this.barWidget.getValue().xAxisLabel : ''
              },ticks
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.barWidget.getValue().yAxisLabel ? this.barWidget.getValue().yAxisLabel : ''
              },
              ticks : {
                padding: this.barWidget.getValue().isEnableDatalabels && (this.barWidget.getValue().datalabelsPosition === 'start' || this.barWidget.getValue().datalabelsPosition === 'center') ?  40 : 0
              }
            }]
          }
        } else {
          this.barChartOptions.scales = {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.barWidget.getValue().xAxisLabel ? this.barWidget.getValue().xAxisLabel : '',
              },
              ticks : {
                padding: this.barWidget.getValue().isEnableDatalabels && (this.barWidget.getValue().datalabelsPosition === 'start' || this.barWidget.getValue().datalabelsPosition === 'center') ?  20 : 0
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.barWidget.getValue().yAxisLabel ? this.barWidget.getValue().yAxisLabel : ''
              },ticks
            }]
          }
        }
    } else {
      this.barChartOptions.scales = {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.barWidget.getValue().xAxisLabel ? this.barWidget.getValue().xAxisLabel : ''
          },
          ticks: {
            padding: this.barWidget.getValue().isEnableDatalabels && (this.barWidget.getValue().orientation === Orientation.VERTICAL) && (this.barWidget.getValue().datalabelsPosition === 'start' || this.barWidget.getValue().datalabelsPosition === 'center') ?  20 : 0
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.barWidget.getValue().yAxisLabel ? this.barWidget.getValue().yAxisLabel : ''
          },
          ticks: {
            padding: this.barWidget.getValue().isEnableDatalabels && (this.barWidget.getValue().orientation === Orientation.HORIZONTAL) && (this.barWidget.getValue().datalabelsPosition === 'start' || this.barWidget.getValue().datalabelsPosition === 'center') ?  40 : 0
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
   * Before render chart transformation
   * @param resBuckets response from server
   */
  transformDataSets(resBuckets: any[]): string[] {
    // ckeck configuration
    const finalDataSet: string[] = [];
    if(this.barWidget.getValue().scaleFrom !== null && this.barWidget.getValue().scaleFrom !== undefined
      && this.barWidget.getValue().scaleTo !== null && this.barWidget.getValue().scaleTo !== undefined
      && this.barWidget.getValue().stepSize !== null && this.barWidget.getValue().stepSize !== undefined) {

      const insideRange = resBuckets.filter(bucket =>{
        if(this.barWidget.getValue().scaleFrom <= bucket.doc_count && this.barWidget.getValue().scaleTo >= bucket.doc_count) {
          return bucket;
        }
      });
      if(this.barWidget.getValue().dataSetSize) {
        for(let i=0 ; i<this.barWidget.getValue().dataSetSize; i++) {
          if(insideRange[i]) {
              this.lablels.push(insideRange[i].key);
              finalDataSet.push(insideRange[i].doc_count);
          }
        }
      } else {
        insideRange.forEach(bucket => {
          this.lablels.push(bucket.key);
          finalDataSet.push(bucket.doc_count);
        });
      }
    } else {
      resBuckets.forEach(bucket => {
        const key = bucket.key === ''?this.barWidget.value.blankValueAlias!==undefined?this.barWidget.value.blankValueAlias:'':bucket.key;
        this.lablels.push(key);
        finalDataSet.push(bucket.doc_count);
      });
    }
    return finalDataSet;
  }

  /**
   * Open Color palette...
   */
  openColorPalette() {
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = String(this.widgetId);
    req.reportId = String(this.reportId);
    req.widgetDesc = this.widgetHeader.desc;
    req.colorPalettes = [];
    this.barChartData.forEach(legend=>{
      req.colorPalettes.push({
        code: legend.label,
        colorCode: legend.backgroundColor ? legend.backgroundColor : this.getRandomColor(),
        text: legend.label
      });
    });
    super.openColorPalette(req);
  }

  /**
   * Update stacked color based on color definations
   * @param res updated color codes
   */
  updateColorBasedOnDefined(res: WidgetColorPalette) {
    this.widgetColorPalette = res;
    this.barWidget.next(this.barWidget.getValue());
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

  /**
   * Return random color in hexa
   */
  public getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getComputedSize(initialWidth : number){

    if (!this.dataSet.length)
      return initialWidth ;

    const barWidth = initialWidth / this.dataSet.length ;

    if(barWidth < this.minBarWidth){
      return this.minBarWidth * this.dataSet.length ;
    } else {
      // this.minBarWidth = barWidth;
      return initialWidth;
    }
  }

  computeGraphSize(){
    if( this.orientation === 'bar'){
      this.computedSize.height = this.widgetInfo.height;
      this.computedSize.width = this.getComputedSize(this.widgetInfo.width);
    } else {
      this.computedSize.height = this.getComputedSize(this.widgetInfo.height);
      this.computedSize.width = this.widgetInfo.width;
    }

  }

  zoomIn(){
    if( this.minBarWidth + this.zoomStep < this.maxBarSizeThreshold ){
      this.minBarWidth += this.zoomStep ;
      this.computeGraphSize();
    }
  }

  zoomOut(){
    if( this.minBarWidth - this.zoomStep >= this.minBarSizeThreshold ){
      this.minBarWidth -= this.zoomStep ;
      this.computeGraphSize();
    }
  }

  saveDisplayCriteria() {
    const saveDisplayCriteria = this.widgetService.saveDisplayCriteria(this.widgetInfo.widgetId, this.widgetInfo.widgetType, this.displayCriteriaOption.key).subscribe(res => {
      this.updateChart(this.returndata);
    }, error => {
      console.error(`Error : ${error}`);
      this.snackBar.open(`Something went wrong`, 'Close', { duration: 3000 });
    });
    this.subscriptions.push(saveDisplayCriteria)
  }

  applyDateFilter(strtdate: string, fieldId: string) : Criteria{
    const strtDate = strtdate;
    const endDate = String(Number(strtdate) + 24*60*60*1000);
    const critera: Criteria = new Criteria();
    critera.fieldId = fieldId;
    critera.conditionFieldId = fieldId;
    critera.conditionFieldEndValue = endDate;
    critera.conditionFieldStartValue = strtDate;
    critera.blockType = BlockType.COND;
    critera.conditionOperator = ConditionOperator.RANGE;
    critera.widgetType = WidgetType.BAR_CHART;
    return critera;
  }
}
