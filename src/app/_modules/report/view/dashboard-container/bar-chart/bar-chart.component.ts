import { Component, OnInit, OnChanges, ViewChild, LOCALE_ID, Inject, SimpleChanges } from '@angular/core';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { BarChartWidget, Criteria, WidgetHeader, ChartLegend, ConditionOperator, BlockType, Orientation, WidgetColorPalette } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';
import { ChartOptions, ChartTooltipItem, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import   ChartDataLables from 'chartjs-plugin-datalabels';
import { MatDialog } from '@angular/material/dialog';



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

  public barChartData: any[] = [
    {
      label: 'Loding..',
      barThickness: 80,
      data: [0, 0, 0, 0, 0, 0, 0]
    },
  ];

  constructor(
    private widgetService: WidgetService,
    @Inject(LOCALE_ID) public locale: string,
    public matDialog: MatDialog
  ) {
    super(matDialog);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lablels = [];
    this.chartLegend = [];
    this.barWidget.next(this.barWidget.getValue());
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
    this.afterColorDefined.subscribe(res=>{
      if(res) {
        this.updateColorBasedOnDefined(res);
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
      this.widgetColorPalette = returndata.widgetColorPalette;
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
              anchor: this.barWidget.getValue().datalabelsPosition,
              display:'auto'
            }
          }
        }
        // set scale range and axis lebels
        this.setChartAxisAndScaleRange();

        // Bar widget color
      // this.barChartColors = [{
      //   backgroundColor: this.widgetColorPalette && this.widgetColorPalette.colorPalettes ? this.widgetColorPalette.colorPalettes[0].colorCode : '#8CF5A9',
      //   borderColor: this.widgetColorPalette && this.widgetColorPalette.colorPalettes ? this.widgetColorPalette.colorPalettes[0].colorCode : '#8CF5A9',
      // }];
   }

  public getBarChartData(widgetId: number, critria: Criteria[]): void {
    this.widgetService.getWidgetData(String(widgetId), critria).subscribe(returndata => {
      const arrayBuckets = returndata.aggregations['sterms#BAR_CHART'].buckets;
      this.dataSet = [];
      this.lablels = [];
      this.dataSet = this.transformDataSets(arrayBuckets);
      // update barchartLabels
      console.log(this.barWidget.getValue().metaData);
      if(this.barWidget.getValue().metaData && (this.barWidget.getValue().metaData.picklist === '0' && (this.barWidget.getValue().metaData.dataType === 'DTMS' || this.barWidget.getValue().metaData.dataType === 'DATS'))) {
        if (this.chartLegend.length === 0) {
          this.getDateFieldsDesc(arrayBuckets);
        } else {
          this.lablels = this.chartLegend.map(map => map.text);
        }
      } else if(this.barWidget.getValue().metaData && (this.barWidget.getValue().metaData.picklist === '1' || this.barWidget.getValue().metaData.picklist === '37' || this.barWidget.getValue().metaData.picklist === '30')) {
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

      const backgroundColorArray = [];
      this.chartLegend.forEach(legend=>{
        backgroundColorArray.push(this.getUpdatedColorCode(legend.code));
      });
      // to convert data into percentage
      if (this.barWidget.getValue().isEnabledBarPerc) {
        this.total = Number(this.dataSet.reduce((accumulator, currentValue) => accumulator + currentValue));
        this.barChartOptions = {
          plugins: {
            datalabels: {
              display: true,
              formatter: (value, ctx) => {
                if (this.total > 0) {
                  return (value * 100 / this.total).toFixed(2) + '%';
                }
              },
            }
          }
        }
      }
      this.barChartData = [{
        label: this.widgetHeader.widgetName,
        barThickness: 'flex',
        data: this.dataSet,
        backgroundColor:backgroundColorArray
        // data: this.dataSet
      }];

      // compute graph size

      this.computeGraphSize();

      // update chart after data sets change
      if(this.chart) {
        this.chart.update();
      }
    });
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
    this.lablels = this.chartLegend.map(map => map.text);
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
    console.log(this.barChartData);
    console.log(this.chartLegend);
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = String(this.widgetId);
    req.reportId = String(this.reportId);
    req.widgetDesc = this.widgetHeader.desc;
    req.colorPalettes = [];
    this.chartLegend.forEach(legend=>{
      req.colorPalettes.push({
        code: legend.code,
        colorCode: this.barChartData[0] ? this.barChartData[0].backgroundColor[legend.legendIndex] : this.getRandomColor(),
        text: legend.text
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
      this.minBarWidth = barWidth;
      return initialWidth ;
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
}
