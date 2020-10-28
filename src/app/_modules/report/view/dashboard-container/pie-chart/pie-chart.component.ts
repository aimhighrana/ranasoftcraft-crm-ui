import { Component, OnInit, OnChanges, ViewChild, LOCALE_ID, Inject, SimpleChanges, OnDestroy } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { PieChartWidget, WidgetHeader, ChartLegend, Criteria, BlockType, ConditionOperator, WidgetColorPalette } from '../../../_models/widget';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { ReportService } from '../../../_service/report.service';
import { ChartOptions, ChartTooltipItem, ChartData, ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLables from 'chartjs-plugin-datalabels';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pros-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent extends GenericWidgetComponent implements OnInit, OnChanges, OnDestroy {


  pieWidget: BehaviorSubject<PieChartWidget> = new BehaviorSubject<PieChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  chartLegend: ChartLegend[] = [];
  lablels: string[] = [];
  dataSet: string[] = [];
  total = 0;
  orientation = 'pie';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
          let datalabel = data.labels[tooltipItem.index];
          const value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
          datalabel += value;
          return datalabel.toString();
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
      },

    },
    plugins: {
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          if (this.total > 0) {
            return (value * 100 / this.total).toFixed(2) + '%';
          }
        },
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }

  };

  public pieChartColors: Array<any> = [
    {
      backgroundColor: [],

    }
  ];

  public pieChartData: any[] = [
    {
      data: [0, 0, 0, 0, 0, 0],
      borderAlign: 'center'

    },
  ];

  constructor(
    private widgetService: WidgetService,
    private reportService: ReportService,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog
  ) {
    super(matDialog);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes.filterCriteria && changes.filterCriteria.currentValue !== changes.filterCriteria.currentValue.previousValue) {
      this.lablels = [];
      this.chartLegend = [];
      this.pieWidget.next(this.pieWidget.getValue());
    }
    if (changes && changes.boxSize && changes.boxSize.previousValue !== changes.boxSize.currentValue) {
      this.boxSize = changes.boxSize.currentValue;
    }
  }

  ngOnInit(): void {
    this.getPieChartMetadata();
    this.getHeaderMetaData();
    this.pieWidget.subscribe(res => {
      if (res) {
        this.getPieChartData(this.widgetId, this.filterCriteria);
      }
    });

    // after color defined update on widget
    this.afterColorDefined.subscribe(res => {
      if (res) {
        this.updateColorBasedOnDefined(res);
      }
    });
  }

  public getHeaderMetaData(): void {
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData => {
      this.widgetHeader = returnData;
    }, error => console.error(`Error : ${error}`));
  }

  /**
   * function to get meta data regarding pie chart
   */
  public getPieChartMetadata(): void {
    // for time being this is getBarChartMetadata used to fetch data from API
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata => {
      this.widgetColorPalette = returndata.widgetColorPalette;
      this.pieWidget.next(returndata);
      this.getPieConfigurationData();
    }, error => {
      console.error(`Error : ${error}`);
    });
  }

  /**
   * function to get configuration of pie chart like legend positions, data lables etcetra..
   */
  public getPieConfigurationData(): void {

    // if showLegend flag will be true it show legend on Stacked bar widget
    if (this.pieWidget.getValue().isEnableLegend) {
      this.pieChartOptions.legend = {
        display: true,
        position: this.pieWidget.getValue().legendPosition,
        onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
          // call protype of stacked bar chart componenet
          this.legendClick(legendItem);
        },
      }
    }

    //  if showCountOnStack flag will be true it show datalables on stack and position of datalables also configurable
    if (this.pieWidget.getValue().isEnableDatalabels) {
      this.pieChartOptions.plugins = {
        ChartDataLables,
        datalabels: {
          align: this.pieWidget.getValue().datalabelsPosition,
          anchor: this.pieWidget.getValue().datalabelsPosition,
          display: 'auto'
        }
      }
    }
  }

  /**
   * function to get data of the pie chart
   * @param widgetId Id of the widget
   * @param critria crieteria
   */
  public getPieChartData(widgetId: number, critria: Criteria[]): void {
    this.widgetService.getWidgetData(String(widgetId), critria).subscribe(returndata => {
      const arrayBuckets = returndata.aggregations['sterms#BAR_CHART'].buckets;
      this.dataSet = [];
      arrayBuckets.forEach(bucket => {
        const key = bucket.key === '' ? this.pieWidget.value.blankValueAlias !== undefined ? this.pieWidget.value.blankValueAlias : '' : bucket.key;
        this.lablels.push(key);
        this.dataSet.push(bucket.doc_count);
      });
      if(this.pieWidget.getValue().metaData && (this.pieWidget.getValue().metaData.picklist === '0' && (this.pieWidget.getValue().metaData.dataType === 'DTMS' || this.pieWidget.getValue().metaData.dataType === 'DATS'))) {
        if (this.chartLegend.length === 0) {
          this.getDateFieldsDesc(arrayBuckets);
        } else {
          this.lablels = this.chartLegend.map(map => map.text);
        }
       } else if (this.pieWidget.getValue().metaData && (this.pieWidget.getValue().metaData.picklist === '1' || this.pieWidget.getValue().metaData.picklist === '37' || this.pieWidget.getValue().metaData.picklist === '30')) {
        if (this.chartLegend.length === 0) {
          this.getFieldsMetadaDesc(arrayBuckets);
        } else {
          this.lablels = this.chartLegend.map(map => map.text);
        }
      } else {
        if (this.chartLegend.length === 0) {
          this.getFieldsDesc(arrayBuckets);
        } else {
          this.lablels = this.chartLegend.map(map => map.text);
        }
      }

      if (this.pieWidget.getValue().isEnabledBarPerc) {
        this.total = Number(this.dataSet.reduce((accumulator, currentValue) => accumulator + currentValue));
        this.pieChartOptions = {
          plugins: {
            datalabels: {
              display: true,
              formatter: (value, ctx) => {
                if (this.total > 0) {
                  return (value * 100 / this.total).toFixed(2) + '%';
                }
              },
            }
          },
          onClick: (event?: MouseEvent, activeElements?: Array<{}>) => {
            this.stackClickFilter(event, activeElements);
          },
        }
      }
      this.pieChartData = [{
        data: this.dataSet
      }];
      this.getColor();

      // update chart after data sets change
      if (this.chart) {
        this.chart.update();
      }

    });
  }

  /**
   * Update label based on configuration
   * @param buckets update lable
   */
  getFieldsDesc(buckets: any[]) {
    const fldid = this.pieWidget.getValue().fieldId;
    let locale = this.locale !== '' ? this.locale.split('-')[0] : 'EN';
    locale = locale.toUpperCase();
    const finalVal = {} as any;
    buckets.forEach(bucket => {
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
      }
    });

    // update lablels
    this.lablels.forEach(cod => {
      let chartLegend: ChartLegend;
      if (cod) {
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

  /**
   * Update label based on configuration
   * @param buckets update lable
   */
  getDateFieldsDesc(buckets: any[]) {
    const fldid = this.pieWidget.getValue().fieldId;
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
    this.lablels = this.chartLegend.map(map => map.text);
  }

  /**
   * Http call for get description of fields code
   *
   */
  getFieldsMetadaDesc(buckets: any[]) {
    const fldid = this.pieWidget.getValue().fieldId;
    const finalVal = {} as any;
    buckets.forEach(bucket => {
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fldid] ?
        ( hits._source.hdvs[fldid] ? hits._source.hdvs[fldid].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fldid]) ?
        ( hits._source.staticFields[fldid] ? hits._source.staticFields[fldid].vc : null) : null;
      if (val) {
        const valArray = [];
        val.forEach(v => {
          if (v.t) {
            valArray.push(v.t);
          }
        });
        const finalText = valArray.toString();
        if (finalText) {
          finalVal[key] = finalText
        } else {
          finalVal[key] = key;
        }
      } else {
        finalVal[key] = key;
      }
    });
    // update lablels
    this.lablels.forEach(cod => {
      let chartLegend: ChartLegend;
      if (cod) {
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

  legendClick(legendItem: ChartLegendLabelItem) {
    let clickedLegend = this.chartLegend[legendItem.index] ? this.chartLegend[legendItem.index].code : this.lablels[legendItem.index];
    if (clickedLegend === undefined) {
      return false;
    }
    if (clickedLegend === this.pieWidget.value.blankValueAlias) {
      clickedLegend = '';
    }
    const fieldId = this.pieWidget.getValue().fieldId;
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
    this.emitEvtFilterCriteria(this.filterCriteria);

  }
  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
    if (activeElements && activeElements.length) {
      const option = this.chart.chart.getElementAtEvent(event) as any;
      const clickedIndex = (option[0])._index;
      const clickedLagend = this.chartLegend[clickedIndex];
      const drpCode = this.chartLegend[clickedIndex] ? this.chartLegend[clickedIndex].code : this.lablels[clickedIndex];
      if (drpCode === undefined) {
        return false;
      }
      const fieldId = this.pieWidget.getValue().fieldId;
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


  public getColor(): void {
    this.pieChartColors = [];
    this.pieChartData[0].data.forEach((element, index) => {
      const codeText = this.chartLegend.filter(fil => fil.legendIndex === index)[0];
      if (index === 0) {
        this.pieChartColors.push({
          backgroundColor: [codeText ? this.getUpdatedColorCode(codeText.code) : this.getRandomColor()]
        });
      } else {
        this.pieChartColors[0].backgroundColor.push(codeText ? this.getUpdatedColorCode(codeText.code) : this.getRandomColor());
      }
    });
  }

  public getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /*
  * download chart data as CSV
  */
  downloadCSV(): void {
    const excelData = [];
    for (let i = 0; i < this.lablels.length; i++) {
      const obj = {} as any;
      obj[this.pieWidget.getValue().fieldId] = this.lablels[i] + '';
      obj.Value = this.dataSet[i] + '';
      excelData.push(obj);
    }
    this.widgetService.downloadCSV('Pie-Chart', excelData);
  }

  /*
  * download chart as image
  */
  downloadImage() {
    this.widgetService.downloadImage(this.chart.toBase64Image(), 'Pie-Chart.png');
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
   * Open Color palette...
   */
  openColorPalette() {
    console.log(this.pieChartColors);
    console.log(this.pieChartData);
    console.log(this.lablels);
    console.log(this.chartLegend);
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = String(this.widgetId);
    req.reportId = String(this.reportId);
    req.widgetDesc = this.widgetHeader.desc;
    req.colorPalettes = [];

    this.pieChartData[0].data.forEach((data, index) => {
      const colorCode = this.pieChartData[0].backgroundColor[index];
      const codeTxtObj = this.chartLegend.filter(fil => fil.legendIndex === index)[0];
      if (codeTxtObj) {
        req.colorPalettes.push({
          code: codeTxtObj.code,
          text: codeTxtObj.text,
          colorCode
        });
      }
    });
    super.openColorPalette(req);
  }

  /**
   * Update stacked color based on color definations
   * @param res updated color codes
   */
  updateColorBasedOnDefined(res: WidgetColorPalette) {
    this.widgetColorPalette = res;
    this.getColor();
  }

  /**
   * Update color on widget based on defined
   * If not defined the pick random color
   * @param code resposne code
   */
  getUpdatedColorCode(code: string): string {
    if (this.widgetColorPalette && this.widgetColorPalette.colorPalettes) {
      const res = this.widgetColorPalette.colorPalettes.filter(fil => fil.code === code)[0];
      if (res) {
        return res.colorCode;
      }

    }
    return this.getRandomColor();
  }

  ngOnDestroy(): void {
    this.pieWidget.complete();
    this.pieWidget.unsubscribe();
  }
}
