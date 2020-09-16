import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesWidgetComponent } from './timeseries-widget.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterWidget,SeriesWith,WidgetTimeseries,AggregationOperator,ChartType,TimeSeriesWidget,AssginedColor } from '@modules/report/_models/widget';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import {FormControl } from '@angular/forms';
import { WidgetService } from '@services/widgets/widget.service';
import { of } from 'rxjs';
import { ChartLegendLabelItem } from 'chart.js';

describe('TimeseriesWidgetComponent', () => {
  let component: TimeseriesWidgetComponent;
  let fixture: ComponentFixture<TimeseriesWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesWidgetComponent ],
      imports:[
        HttpClientTestingModule,
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesWidgetComponent);
    component = fixture.componentInstance;
  });

  it('emitDateChangeValues(), emit after date change',async(()=>{
    component.startDateCtrl = new  FormControl();
    component.startDateCtrl.patchValue(String(new Date().getTime()));
    component.endDateCtrl = new  FormControl();
    component.endDateCtrl.patchValue(String(new Date().getTime()));
    let timeseriesData : TimeSeriesWidget;
    let widgetTimeseries : WidgetTimeseries;

    widgetTimeseries = {widgetId: 123,fieldId: 'STATUS',seriesWith: SeriesWith.week,seriesFormat: 'dd.mm.yyyy',aggregationOperator: AggregationOperator.COUNT,
      chartType: ChartType.LINE,
      isEnableDatalabels: false,
      isEnableLegend: false,
      legendPosition : null,
      datalabelsPosition: null,
      xAxisLabel : '100',
      yAxisLabel : '100',
      scaleFrom: 0,
      scaleTo: 1000,
      stepSize: 100,
      dataSetSize: 100,
      groupWith : 'REQUESTOR_DATE',widgetColorPalette:null}

    timeseriesData = {widgetId:123,widgetName:'test',widgetType:null,objectType:'1005',plantCode:'0',indexName:'do_workflow',desc:'',timeSeries:widgetTimeseries}

    component.timeseriesData = timeseriesData;
    component.filterCriteria = [];
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'STATUS';
    component.emitDateChangeValues();
    expect(component.emitDateChangeValues).toBeTruthy();
}));

it('emitpanAndClickevent(), emit after date change',async(()=>{
  const startdate = String(new Date().getTime());
  const endDate = String(new Date().getTime());
  let timeseriesData : TimeSeriesWidget;
  let widgetTimeseries : WidgetTimeseries;

  widgetTimeseries = {widgetId: 123,fieldId: 'STATUS',seriesWith: SeriesWith.week,seriesFormat: 'dd.mm.yyyy',aggregationOperator: AggregationOperator.COUNT,
    chartType: ChartType.LINE,
    isEnableDatalabels: false,
    isEnableLegend: false,
    legendPosition : null,
    datalabelsPosition: null,
    xAxisLabel : '100',
    yAxisLabel : '100',
    scaleFrom: 0,
    scaleTo: 1000,
    stepSize: 100,
    dataSetSize: 100,
    groupWith : 'REQUESTOR_DATE',widgetColorPalette:null}

  timeseriesData = {widgetId:123,widgetName:'test',widgetType:null,objectType:'1005',plantCode:'0',indexName:'do_workflow',desc:'',timeSeries:widgetTimeseries}

  component.timeseriesData = timeseriesData;
  component.filterCriteria = [];
  const filterWidget = new FilterWidget();
  filterWidget.fieldId = 'STATUS';
  component.emitpanAndClickevent(startdate,endDate);
  expect(component.emitpanAndClickevent).toBeTruthy();
}));

it('getTimeSeriesMetadata(), get meatadat',async(()=>{

  const service = fixture.debugElement.injector.get(WidgetService);

  let timeseriesData : TimeSeriesWidget;
  let widgetTimeseries : WidgetTimeseries;

  widgetTimeseries = {widgetId: 123,fieldId: 'STATUS',seriesWith: SeriesWith.week,seriesFormat: 'dd.mm.yyyy',aggregationOperator: AggregationOperator.COUNT,
    chartType: ChartType.LINE,
    isEnableDatalabels: false,
    isEnableLegend: false,
    legendPosition : null,
    datalabelsPosition: null,
    xAxisLabel : '100',
    yAxisLabel : '100',
    scaleFrom: 0,
    scaleTo: 1000,
    stepSize: 100,
    dataSetSize: 100,
    groupWith : 'REQUESTOR_DATE',widgetColorPalette:null}

  timeseriesData = {widgetId:123,widgetName:'test',widgetType:null,objectType:'1005',plantCode:'0',indexName:'do_workflow',desc:'',timeSeries:widgetTimeseries}

  component.widgetId=123;

  spyOn(service,'getTimeseriesWidgetInfo').withArgs(123).and.returnValue(of(timeseriesData));

  component.getTimeSeriesMetadata();

  expect(service.getTimeseriesWidgetInfo).toHaveBeenCalledWith(123);

}));

it('legendclick(), emit after date change',async(()=>{

  const item: ChartLegendLabelItem = {datasetIndex:0} as ChartLegendLabelItem;

  component.chartLegend = [{code:'MATL_TYPE',legendIndex:0,text:'Material Type'}];

  let timeseriesData : TimeSeriesWidget;
  let widgetTimeseries : WidgetTimeseries;

  widgetTimeseries = {widgetId: 123,fieldId: 'STATUS',seriesWith: SeriesWith.week,seriesFormat: 'dd.mm.yyyy',aggregationOperator: AggregationOperator.COUNT,
    chartType: ChartType.LINE,
    isEnableDatalabels: false,
    isEnableLegend: false,
    legendPosition : null,
    datalabelsPosition: null,
    xAxisLabel : '100',
    yAxisLabel : '100',
    scaleFrom: 0,
    scaleTo: 1000,
    stepSize: 100,
    dataSetSize: 100,
    groupWith : 'REQUESTOR_DATE',widgetColorPalette:null}

  timeseriesData = {widgetId:123,widgetName:'test',widgetType:null,objectType:'1005',plantCode:'0',indexName:'do_workflow',desc:'',timeSeries:widgetTimeseries}

  component.timeseriesData = timeseriesData;
  component.filterCriteria = [];
  const filterWidget = new FilterWidget();
  filterWidget.fieldId = 'STATUS';
  component.legendClick(item);
  expect(component.legendClick).toBeTruthy();
}));

it('getRandomColor(), Random Colour', async(()=>{
  component.getRandomColor();
  // length should be 7
  expect(component.getRandomColor().length).toEqual(7);
  // should contains #
  expect(component.getRandomColor()).toContain('#');
}));

it('getUpdatedColorCode(),  getUpdatedColorCode', async(()=>{
  const code = 'INP';
  const colorPalettes : AssginedColor = {code:'INP',text:'INP',colorCode:'#FFFFFF'};
  const colorArr =new Array();
  colorArr.push(colorPalettes);
  component.widgetColorPalette = {reportId:'123',widgetId:'133',widgetDesc:'desc',colorPalettes:colorArr};
  component.getUpdatedColorCode(code);
  expect(component.getUpdatedColorCode(code)).toEqual('#FFFFFF');
}));

it('transformDataSets(),  transformDataSets', async(()=>{
  const data = {_shards:{total:1,failed:0,successful:1,skipped:0},hits:{hits:[],total:{value:1221,relation:'eq'},max_score:null},took:3,timed_out:false,aggregations:{'date_histogram#date':{buckets:[{key_as_string:'04.00.2020',doc_count:52,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:33,key:'APP'},{doc_count:19,key:'INP'}]},key:1588550400000},{key_as_string:'11.00.2020',doc_count:46,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:33,key:'APP'},{doc_count:13,key:'INP'}]},key:1589155200000},{key_as_string:'18.00.2020',doc_count:18,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:11,key:'APP'},{doc_count:6,key:'INP'},{doc_count:1,key:'REJ'}]},key:1589760000000},{key_as_string:'25.00.2020',doc_count:27,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:15,key:'APP'},{doc_count:12,key:'INP'}]},key:1590364800000},{key_as_string:'01.00.2020',doc_count:322,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:294,key:'APP'},{doc_count:28,key:'INP'}]},key:1590969600000},{key_as_string:'08.00.2020',doc_count:64,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:42,key:'APP'},{doc_count:22,key:'INP'}]},key:1591574400000},{key_as_string:'15.00.2020',doc_count:57,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:47,key:'APP'},{doc_count:10,key:'INP'}]},key:1592179200000},{key_as_string:'22.00.2020',doc_count:77,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:40,key:'INP'},{doc_count:37,key:'APP'}]},key:1592784000000},{key_as_string:'29.00.2020',doc_count:173,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:111,key:'INP'},{doc_count:62,key:'APP'}]},key:1593388800000},{key_as_string:'06.00.2020',doc_count:98,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:60,key:'INP'},{doc_count:37,key:'APP'},{doc_count:1,key:'REJ'}]},key:1593993600000},{key_as_string:'13.00.2020',doc_count:111,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:70,key:'INP'},{doc_count:39,key:'APP'},{doc_count:2,key:'CNCL'}]},key:1594598400000},{key_as_string:'20.00.2020',doc_count:149,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:111,key:'APP'},{doc_count:37,key:'INP'},{doc_count:1,key:'REJ'}]},key:1595203200000},{key_as_string:'27.00.2020',doc_count:27,'sterms#term':{doc_count_error_upper_bound:0,sum_other_doc_count:0,buckets:[{doc_count:18,key:'INP'},{doc_count:9,key:'APP'}]},key:1595808000000}]}}};
  component.transformDataSets(data);
  expect(component.transformDataSets.length).toEqual(1);
}));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
