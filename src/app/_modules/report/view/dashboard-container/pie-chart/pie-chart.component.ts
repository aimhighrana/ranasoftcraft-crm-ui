import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BehaviorSubject } from 'rxjs';
import { PieChartWidget, WidgetHeader, ChartLegend, Criteria, BlockType, ConditionOperator } from '../../../_models/widget';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { ReportService } from '../../../_service/report.service';
import { ChartOptions, ChartTooltipItem, ChartData, ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'pros-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent extends GenericWidgetComponent implements OnInit, OnChanges {


  pieWidget : BehaviorSubject<PieChartWidget> = new BehaviorSubject<PieChartWidget>(null);
  widgetHeader: WidgetHeader = new WidgetHeader();
  chartLegend: ChartLegend[] = [];
  lablels: string[] = [];
  dataSet: string[] = [];
  orientation = 'pie';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  randomColor = [];

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
        display: false,
      }
    },
    elements : {
      arc :{
        borderWidth : 0
      }
    }

  };

  public pieChartColors: Array<any> = [
    {
      backgroundColor: this.randomColor,

    }
  ];

  public pieChartData: any[] = [
    {
      data: [0, 0, 0, 0, 0, 0],
      borderAlign :'center'

    },
  ];

  constructor(
    private widgetService: WidgetService,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnChanges(): void {
    this.lablels = [];
    this.chartLegend = [];
    this.pieWidget.next(this.pieWidget.getValue());
  }

  ngOnInit(): void {
    this.getPieChartMetadata();
    this.getHeaderMetaData();
    this.pieWidget.subscribe(res => {
      if (res) {
        this.getPieChartData(this.widgetId, this.filterCriteria);
      }
    });

    this.getColor();
  }

  public getHeaderMetaData(): void {
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData => {
      this.widgetHeader = returnData;
    }, error => console.error(`Error : ${error}`));
  }

  public getPieChartMetadata(): void {
    // for time being this is getBarChartMetadata used to fetching data from API
    this.widgetService.getBarChartMetadata(this.widgetId).subscribe(returndata => {
      this.pieWidget.next(returndata);
      this.getPieConfigurationData();
    }, error => {
      console.error(`Error : ${error}`);
    });
  }

  public getPieConfigurationData() : void {

    // if showLegend flag will be true it show legend on Stacked bar widget
    if (this.pieWidget.getValue().isEnableLegend) {
      this.pieChartOptions.legend= {
        display: true,
        position: this.pieWidget.getValue().legendPosition,
        onClick: (event: MouseEvent, legendItem: ChartLegendLabelItem) => {
          // call protype of stacked bar chart componenet
          this.legendClick(legendItem);
        },
    }}

   // if showCountOnStack flag will be true it show datalables on stack and position of datalables also configurable
    if (this.pieWidget.getValue().isEnableDatalabels) {
      this.pieChartOptions.plugins = {
        datalabels: {
          align:  this.pieWidget.getValue().datalabelsPosition,
          anchor: this.pieWidget.getValue().anchorPosition,
        }
      }
    }



 }

  public getPieChartData(widgetId: number, critria: Criteria[]): void {
    this.widgetService.getWidgetData(String(widgetId), critria).subscribe(returndata => {
      const arrayBuckets = returndata.aggregations['sterms#BAR_CHART'].buckets;
      this.dataSet = [];
      arrayBuckets.forEach(bucket => {
        this.lablels.push(bucket.key);
        this.dataSet.push(bucket.doc_count);
      });
      if (this.chartLegend.length === 0) {
        this.getFieldsMetadaDesc(this.lablels, this.pieWidget.getValue().fieldId);
      } else {
        this.lablels = this.chartLegend.map(map => map.text);
      }
      this.pieChartData = [{
        label: this.widgetHeader.widgetName,
        data: this.dataSet
      }];
    });
  }

  /**
   * Http call for get description of fields code
   *
   */
  getFieldsMetadaDesc(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res => {
      this.lablels.forEach(cod => {
        const hasData = res.filter(fill => fill.CODE === cod);
        let chartLegend: ChartLegend;
        if (hasData && hasData.length) {
          chartLegend = { text: hasData[0].TEXT, code: hasData[0].CODE, legendIndex: this.chartLegend.length };
        } else {
          chartLegend = { text: cod, code: cod, legendIndex: this.chartLegend.length };
        }
        this.chartLegend.push(chartLegend);
      });
      this.lablels = this.chartLegend.map(map => map.text);
    });
  }

  legendClick(legendItem: ChartLegendLabelItem) {
    const clickedLegend =  this.chartLegend[legendItem.index] ? this.chartLegend[legendItem.index].code : '';;
    if(clickedLegend === '') {
      return false;
    }
    const fieldId = this.pieWidget.getValue().fieldId;
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
  stackClickFilter(event?: MouseEvent, activeElements?: Array<any>) {
    if (activeElements && activeElements.length) {
      const clickedIndex = (activeElements[0])._datasetIndex;
      const clickedLagend = this.chartLegend[clickedIndex];
      const fieldId = this.pieWidget.getValue().fieldId;
      let appliedFilters = this.filterCriteria.filter(fill => fill.fieldId === fieldId);
      this.removeOldFilterCriteria(appliedFilters);
      if (appliedFilters.length > 0) {
        const cri = appliedFilters.filter(fill => fill.conditionFieldValue === clickedLagend.code);
        if (cri.length === 0) {
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


  public getColor() : void {
    this.pieChartData[0].data.forEach(element => {
      this.randomColor.push(this.getRandomColor());
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

}
