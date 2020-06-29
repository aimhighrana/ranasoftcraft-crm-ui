import { Component, OnInit, OnChanges, ViewChild, LOCALE_ID, Inject } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BarChartWidget, Criteria, WidgetHeader, ChartLegend, ConditionOperator, BlockType, Orientation } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';
import { ReportService } from '../../../_service/report.service';
import { ChartOptions, ChartTooltipItem, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import   ChartDataLables from 'chartjs-plugin-datalabels';


@Component({
  selector: 'pros-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends GenericWidgetComponent implements OnInit, OnChanges {

  barWidget: BehaviorSubject<BarChartWidget> = new BehaviorSubject<BarChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  chartLegend: ChartLegend[] = [];
  lablels: string[] = [];
  dataSet: string[] = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  orientation = 'bar';


  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
          return `${tooltipItem.value}`;
        }
      },
      displayColors: false
    },
    onClick: (event?: MouseEvent, activeElements?: Array<{}>) => {
      this.stackClickFilter(event, activeElements);
    },
    legend: {
      display: false
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

  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)'
    }
  ];

  public barChartData: any[] = [
    {
      label: 'Loding..',
      barThickness: 80,
      data: [0, 0, 0, 0, 0, 0, 0]
    },
  ];

  constructor(
    private widgetService: WidgetService,
    private reportService: ReportService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super();
  }

  ngOnChanges(): void {
    this.lablels = [];
    this.chartLegend = [];
    this.barWidget.next(this.barWidget.getValue());
  }

  ngOnInit(): void {
    this.getBarChartMetadata();
    this.getHeaderMetaData();
    this.barWidget.subscribe(res => {
      if (res) {
        this.getBarChartData(this.widgetId, this.filterCriteria);
      }
    });
  }

  public getHeaderMetaData(): void {
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData => {
      this.widgetHeader = returnData;
    }, error => console.error(`Error : ${error}`));
  }

  public getBarChartMetadata(): void {
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata => {
      this.barWidget.next(returndata);
      this.getBarConfigurationData();
    }, error => {
      console.error(`Error : ${error}`);
    });
  }

  public getBarConfigurationData(): void {
      // Bar orientation
      this.orientation = this.barWidget.getValue().orientation === 'VERTICAL' ? 'bar' : 'horizontalBar';

      // if showLegend flag will be true it show legend on Bar widget
        if (this.barWidget.getValue().isEnableLegend) {
          this.barChartOptions.legend = {
            display: true,
            position: this.barWidget.getValue().legendPosition
          }
        }
        // if showCountOnStack flag will be true it show datalables on stack and position of datalables also configurable
        if (this.barWidget.getValue().isEnableDatalabels) {
          this.barChartOptions.plugins = {
            ChartDataLables,
            datalabels: {
              align: this.barWidget.getValue().datalabelsPosition,
              anchor: this.barWidget.getValue().anchorPosition,
              display:'auto'
            }
          }
        }
        // set scale range and axis lebels
        this.setChartAxisAndScaleRange();

        // Bar widget color
      this.barChartColors = [{
        backgroundColor: '#8CF5A9',
        borderColor: '#8CF5A9',
      }];
   }

  public getBarChartData(widgetId: number, critria: Criteria[]): void {
    this.widgetService.getWidgetData(String(widgetId), critria).subscribe(returndata => {
      const arrayBuckets = returndata.aggregations['sterms#BAR_CHART'].buckets;
      this.dataSet = [];
      this.dataSet = this.transformDataSets(arrayBuckets);
      // update barchartLabels
      if(this.barWidget.getValue().metaData && (this.barWidget.getValue().metaData.picklist === '1' || this.barWidget.getValue().metaData.picklist === '37')) {
        if (this.chartLegend.length === 0) {
          this.getFieldsMetadaDesc(arrayBuckets);
        } else {
          this.lablels = this.chartLegend.map(map => map.text);
        }
      }

      this.barChartData = [{
        label: this.widgetHeader.widgetName,
        barThickness: 'flex',
        data: this.dataSet
      }];
    });
  }

  /**
   * Http call for get description of fields code
   *
   */
  getFieldsMetadaDesc(buckets: any[]) {
    const fldid = this.barWidget.getValue().fieldId;
    let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
    locale = locale.toUpperCase();
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const ddv = hits._source.hdvs[fldid] ?( hits._source.hdvs[fldid] ? hits._source.hdvs[fldid].ddv : null) : null;
      if(ddv) {
        const hasValue =  ddv.filter(fil=> fil.lang === locale)[0];
        if(hasValue) {
          finalVal[key] = hasValue.val;
        }
      } else {
        finalVal[key] = hits._source.hdvs[fldid].vc;
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
    this.lablels = this.chartLegend.map(map => map.text);
  }

  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
    if(activeElements && activeElements.length) {
      const option = this.chart.chart.getElementAtEvent(event) as any;
      const clickedIndex = (option[0])._index;
      const clickedLagend = this.chartLegend[clickedIndex];
      const drpCode = this.chartLegend[clickedIndex] ? this.chartLegend[clickedIndex].code : this.lablels[clickedIndex];
      if(drpCode === undefined) {
        return false;
      }
      const fieldId = this.barWidget.getValue().fieldId;
      let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
      this.removeOldFilterCriteria(appliedFilters);
      if (appliedFilters.length > 0) {
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLagend.code);
        if (cri.length === 0) {
          const critera1: Criteria = new Criteria();
          critera1.fieldId = fieldId;
          critera1.conditionFieldId = fieldId;
          critera1.conditionFieldValue = drpCode;
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
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
        appliedFilters.push(critera1);
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
      obj[this.barWidget.getValue().fieldId] = this.lablels[i] + '';
      obj.Value = this.dataSet[i] + '';
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
              }
            }]
          }
        } else {
          this.barChartOptions.scales = {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.barWidget.getValue().xAxisLabel ? this.barWidget.getValue().xAxisLabel : ''
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
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: this.barWidget.getValue().yAxisLabel ? this.barWidget.getValue().yAxisLabel : ''
          }
        }]
      }
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
        this.lablels.push(bucket.key);
        finalDataSet.push(bucket.doc_count);
      });
    }
    return finalDataSet;
  }

}
