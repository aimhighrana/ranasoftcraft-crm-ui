import { MdoUiLibraryModule } from 'mdo-ui-library';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesWidgetComponent } from './timeseries-widget.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterWidget, SeriesWith, WidgetTimeseries, AggregationOperator, ChartType, TimeSeriesWidget, AssginedColor, WidgetType, Criteria, DisplayCriteria } from '@modules/report/_models/widget';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormControl, FormGroup } from '@angular/forms';
import { WidgetService } from '@services/widgets/widget.service';
import { of } from 'rxjs';
import { ChartLegendLabelItem } from 'chart.js';
import { SharedModule } from '@modules/shared/shared.module';
import { MetadataModel } from '@models/schema/schemadetailstable';

describe('TimeseriesWidgetComponent', () => {
  let component: TimeseriesWidgetComponent;
  let fixture: ComponentFixture<TimeseriesWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeseriesWidgetComponent],
      imports: [ MdoUiLibraryModule,
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        SharedModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesWidgetComponent);
    component = fixture.componentInstance;
  });

  it('emitDateChangeValues(), emit after date change', async(() => {
    component.startDateCtrl = new FormControl();
    component.startDateCtrl.patchValue(String(new Date().getTime()));
    component.endDateCtrl = new FormControl();
    component.endDateCtrl.patchValue(String(new Date().getTime()));
    let timeseriesData: TimeSeriesWidget;
    let widgetTimeseries: WidgetTimeseries;

    widgetTimeseries = {
      widgetId: 123, fieldId: 'STATUS', seriesWith: SeriesWith.week, seriesFormat: 'dd.mm.yyyy', aggregationOperator: AggregationOperator.COUNT,
      chartType: ChartType.LINE,
      isEnableDatalabels: false,
      isEnableLegend: false,
      legendPosition: null,
      datalabelsPosition: null,
      xAxisLabel: '100',
      yAxisLabel: '100',
      scaleFrom: 0,
      scaleTo: 1000,
      stepSize: 100,
      dataSetSize: 100,
      startDate: '7',
      groupWith: 'REQUESTOR_DATE', widgetColorPalette: null, distictWith: 'REGION', bucketFilter: null, showInPercentage: false,
      metaData: {fieldDescri: 'Requested Date'} as MetadataModel
    }

    timeseriesData = { widgetId: 123, widgetName: 'test', widgetType: null, objectType: '1005', plantCode: '0', indexName: 'do_workflow', desc: '', timeSeries: widgetTimeseries, isEnableGlobalFilter : false }

    component.timeseriesData = timeseriesData;
    component.filterCriteria = [];
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'STATUS';
    component.emitDateChangeValues();
    expect(component.emitDateChangeValues).toBeTruthy();
  }));

  it('emitpanAndClickevent(), emit after date change', async(() => {
    const startdate = String(new Date().getTime());
    const endDate = String(new Date().getTime());
    let timeseriesData: TimeSeriesWidget;
    let widgetTimeseries: WidgetTimeseries;

    widgetTimeseries = {
      widgetId: 123, fieldId: 'STATUS', seriesWith: SeriesWith.week, seriesFormat: 'dd.mm.yyyy', aggregationOperator: AggregationOperator.COUNT,
      chartType: ChartType.LINE,
      isEnableDatalabels: false,
      isEnableLegend: false,
      legendPosition: null,
      datalabelsPosition: null,
      xAxisLabel: '100',
      yAxisLabel: '100',
      scaleFrom: 0,
      scaleTo: 1000,
      stepSize: 100,
      dataSetSize: 100,
      startDate: '7',
      groupWith: 'REQUESTOR_DATE', widgetColorPalette: null, distictWith: 'REGION', showInPercentage: false, bucketFilter: null,
      metaData: {fieldDescri: 'Requested Date'} as MetadataModel
    }

    timeseriesData = { widgetId: 123, widgetName: 'test', widgetType: null, objectType: '1005', plantCode: '0', indexName: 'do_workflow', desc: '', timeSeries: widgetTimeseries, isEnableGlobalFilter : false }

    component.timeseriesData = timeseriesData;
    component.filterCriteria = [];
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'STATUS';
    component.emitpanAndClickevent(startdate, endDate);
    expect(component.emitpanAndClickevent).toBeTruthy();
  }));

  it('getTimeSeriesMetadata(), get meatadat', async(() => {

    const service = fixture.debugElement.injector.get(WidgetService);

    let timeseriesData: TimeSeriesWidget;
    let widgetTimeseries: WidgetTimeseries;

    widgetTimeseries = {
      widgetId: 123, fieldId: 'STATUS', seriesWith: SeriesWith.week, seriesFormat: 'dd.mm.yyyy', aggregationOperator: AggregationOperator.COUNT,
      chartType: ChartType.LINE,
      isEnableDatalabels: false,
      isEnableLegend: false,
      legendPosition: null,
      datalabelsPosition: null,
      xAxisLabel: '100',
      yAxisLabel: '100',
      scaleFrom: 0,
      scaleTo: 1000,
      stepSize: 100,
      dataSetSize: 100,
      startDate: '7',
      groupWith: 'REQUESTOR_DATE', widgetColorPalette: null, distictWith: 'REGION', bucketFilter: null, showInPercentage: false,
      metaData: {fieldDescri: 'Requested Date'} as MetadataModel
    }

    timeseriesData = { widgetId: 123, widgetName: 'test', widgetType: null, objectType: '1005', plantCode: '0', indexName: 'do_workflow', desc: '', timeSeries: widgetTimeseries, isEnableGlobalFilter : false }

    component.widgetId = 123;

    spyOn(service, 'getTimeseriesWidgetInfo').withArgs(123).and.returnValue(of(timeseriesData));

    component.getTimeSeriesMetadata();

    expect(service.getTimeseriesWidgetInfo).toHaveBeenCalledWith(123);

  }));

  it('legendclick(), emit after date change', async(() => {
    const item: ChartLegendLabelItem = { datasetIndex: 0 } as ChartLegendLabelItem;
    component.chartLegend = [{ code: 'MATL_TYPE', legendIndex: 0, text: 'Material Type' }];
    const widgetTimeseries = {
      fieldId: 'STATUS',
      groupWith: 'REQUESTOR_DATE',
      distictWith: 'REGION',
      metaData: {fieldDescri: 'Requested Date'} as MetadataModel
    } as WidgetTimeseries;

    component.timeseriesData = {timeSeries: widgetTimeseries, isEnableGlobalFilter : false } as TimeSeriesWidget

    component.filterCriteria = [];
    component.legendClick(item);
    expect(component.filterCriteria.length).toEqual(1);

    component.chartLegend = [{code:'GM',legendIndex:0,text:'GM'}];
    component.timeseriesData = {timeSeries: {fieldId:'CURRENTUSER'} as WidgetTimeseries, isEnableGlobalFilter : true } as TimeSeriesWidget
    component.filterCriteria = [{fieldId: 'CURRENTUSER', widgetType: WidgetType.TIMESERIES, conditionFieldValue:'admin'} as Criteria];
    component.legendClick(item);
    expect(component.filterCriteria.length).toEqual(1);

    component.chartLegend = [{code:'GM',legendIndex:0,text:'GM'}];
    component.timeseriesData = {timeSeries: {fieldId:'CURRENTUSER'} as WidgetTimeseries, isEnableGlobalFilter : false } as TimeSeriesWidget
    component.filterCriteria = [{fieldId: 'CURRENTUSER', widgetType: WidgetType.TIMESERIES, conditionFieldValue:'admin'} as Criteria];
    component.legendClick(item);
    expect(component.filterCriteria.length).toEqual(2);
  }));

  it('getRandomColor(), Random Colour', async(() => {
    component.getRandomColor();
    // length should be 7
    expect(component.getRandomColor().length).toEqual(7);
    // should contains #
    expect(component.getRandomColor()).toContain('#');
  }));

  it('getUpdatedColorCode(),  getUpdatedColorCode', async(() => {
    const code = 'INP';
    const colorPalettes: AssginedColor = { code: 'INP', text: 'INP', colorCode: '#FFFFFF' };
    const colorArr = new Array();
    colorArr.push(colorPalettes);
    component.widgetColorPalette = { reportId: '123', widgetId: '133', widgetDesc: 'desc', colorPalettes: colorArr };
    component.getUpdatedColorCode(code);
    expect(component.getUpdatedColorCode(code)).toEqual('#FFFFFF');
  }));

  // it('transformDataSets(),  transformDataSets', async(() => {
  //   const data = { _shards: { total: 1, failed: 0, successful: 1, skipped: 0 }, hits: { hits: [], total: { value: 1221, relation: 'eq' }, max_score: null }, took: 3, timed_out: false, aggregations: { 'date_histogram#date': { buckets: [{ key_as_string: '04.00.2020', doc_count: 52, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 33, key: 'APP' }, { doc_count: 19, key: 'INP' }] }, key: 1588550400000 }, { key_as_string: '11.00.2020', doc_count: 46, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 33, key: 'APP' }, { doc_count: 13, key: 'INP' }] }, key: 1589155200000 }, { key_as_string: '18.00.2020', doc_count: 18, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 11, key: 'APP' }, { doc_count: 6, key: 'INP' }, { doc_count: 1, key: 'REJ' }] }, key: 1589760000000 }, { key_as_string: '25.00.2020', doc_count: 27, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 15, key: 'APP' }, { doc_count: 12, key: 'INP' }] }, key: 1590364800000 }, { key_as_string: '01.00.2020', doc_count: 322, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 294, key: 'APP' }, { doc_count: 28, key: 'INP' }] }, key: 1590969600000 }, { key_as_string: '08.00.2020', doc_count: 64, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 42, key: 'APP' }, { doc_count: 22, key: 'INP' }] }, key: 1591574400000 }, { key_as_string: '15.00.2020', doc_count: 57, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 47, key: 'APP' }, { doc_count: 10, key: 'INP' }] }, key: 1592179200000 }, { key_as_string: '22.00.2020', doc_count: 77, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 40, key: 'INP' }, { doc_count: 37, key: 'APP' }] }, key: 1592784000000 }, { key_as_string: '29.00.2020', doc_count: 173, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 111, key: 'INP' }, { doc_count: 62, key: 'APP' }] }, key: 1593388800000 }, { key_as_string: '06.00.2020', doc_count: 98, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 60, key: 'INP' }, { doc_count: 37, key: 'APP' }, { doc_count: 1, key: 'REJ' }] }, key: 1593993600000 }, { key_as_string: '13.00.2020', doc_count: 111, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 70, key: 'INP' }, { doc_count: 39, key: 'APP' }, { doc_count: 2, key: 'CNCL' }] }, key: 1594598400000 }, { key_as_string: '20.00.2020', doc_count: 149, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 111, key: 'APP' }, { doc_count: 37, key: 'INP' }, { doc_count: 1, key: 'REJ' }] }, key: 1595203200000 }, { key_as_string: '27.00.2020', doc_count: 27, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 18, key: 'INP' }, { doc_count: 9, key: 'APP' }] }, key: 1595808000000 }] } } };
  //   component.transformDataSets(data);
  //   expect(component.transformDataSets.length).toEqual(1);
  // }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`generatedDataBasedonMonth(), generate date data based on months `, async(() => {
    const mockData = [
      {
        key_as_string: '2019-Jan-01',
        doc_count: 10
      }
    ];
    const res = component.generatedDataBasedonMonth(mockData, false);
    expect(res.length).toEqual(12);
  }));

  // it('tarnsformForShowInPercentage(), transform response', async(() => {
  //   const data = { _shards: { total: 1, failed: 0, successful: 1, skipped: 0 }, hits: { hits: [], total: { value: 1221, relation: 'eq' }, max_score: null }, took: 3, timed_out: false, aggregations: { 'date_histogram#date': { buckets: [{ key_as_string: '04.00.2020', doc_count: 52, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 33, key: 'APP' }, { doc_count: 19, key: 'INP' }] }, key: 1588550400000 }, { key_as_string: '11.00.2020', doc_count: 46, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 33, key: 'APP' }, { doc_count: 13, key: 'INP' }] }, key: 1589155200000 }, { key_as_string: '18.00.2020', doc_count: 18, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 11, key: 'APP' }, { doc_count: 6, key: 'INP' }, { doc_count: 1, key: 'REJ' }] }, key: 1589760000000 }, { key_as_string: '25.00.2020', doc_count: 27, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 15, key: 'APP' }, { doc_count: 12, key: 'INP' }] }, key: 1590364800000 }, { key_as_string: '01.00.2020', doc_count: 322, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 294, key: 'APP' }, { doc_count: 28, key: 'INP' }] }, key: 1590969600000 }, { key_as_string: '08.00.2020', doc_count: 64, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 42, key: 'APP' }, { doc_count: 22, key: 'INP' }] }, key: 1591574400000 }, { key_as_string: '15.00.2020', doc_count: 57, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 47, key: 'APP' }, { doc_count: 10, key: 'INP' }] }, key: 1592179200000 }, { key_as_string: '22.00.2020', doc_count: 77, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 40, key: 'INP' }, { doc_count: 37, key: 'APP' }] }, key: 1592784000000 }, { key_as_string: '29.00.2020', doc_count: 173, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 111, key: 'INP' }, { doc_count: 62, key: 'APP' }] }, key: 1593388800000 }, { key_as_string: '06.00.2020', doc_count: 98, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 60, key: 'INP' }, { doc_count: 37, key: 'APP' }, { doc_count: 1, key: 'REJ' }] }, key: 1593993600000 }, { key_as_string: '13.00.2020', doc_count: 111, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 70, key: 'INP' }, { doc_count: 39, key: 'APP' }, { doc_count: 2, key: 'CNCL' }] }, key: 1594598400000 }, { key_as_string: '20.00.2020', doc_count: 149, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 111, key: 'APP' }, { doc_count: 37, key: 'INP' }, { doc_count: 1, key: 'REJ' }] }, key: 1595203200000 }, { key_as_string: '27.00.2020', doc_count: 27, 'sterms#term': { doc_count_error_upper_bound: 0, sum_other_doc_count: 0, buckets: [{ doc_count: 18, key: 'INP' }, { doc_count: 9, key: 'APP' }] }, key: 1595808000000 }] } } };
  //   component.tarnsformForShowInPercentage(data, false);
  //   expect(component.tarnsformForShowInPercentage).toBeTruthy();
  // }));

  it('bucketModify(), modify bucket ', async(() => {
    const mockData = [
      {
        key_as_string: '2019-Jan-01',
        doc_count: 10
      }
    ];
    const res = component.bucketModify(mockData, false);
    expect(res.length).toEqual(11);
  }));

  it('updateForm(), update form element ', async(() => {
    component.dateFilters = [{
      id: 1,
      isActive: false,
      value: '1'
    }];

    component.formGroup = new FormGroup({
      field: new FormControl('')
    });

    component.timeseriesData = { timeSeries: { seriesWith: SeriesWith.day, fieldId: 'MATL_TYPE' } } as TimeSeriesWidget;

    let timeseriesData: TimeSeriesWidget;
    let widgetTimeseries: WidgetTimeseries;

    widgetTimeseries = {
      widgetId: 123, fieldId: 'STATUS', seriesWith: SeriesWith.week, seriesFormat: 'dd.mm.yyyy', aggregationOperator: AggregationOperator.COUNT,
      chartType: ChartType.LINE,
      isEnableDatalabels: false,
      isEnableLegend: false,
      legendPosition: null,
      datalabelsPosition: null,
      xAxisLabel: '100',
      yAxisLabel: '100',
      scaleFrom: 0,
      scaleTo: 1000,
      stepSize: 100,
      dataSetSize: 100,
      startDate: '7',
      groupWith: 'REQUESTOR_DATE', widgetColorPalette: null, distictWith: 'REGION', showInPercentage: false, bucketFilter: null,
      metaData: {fieldDescri: 'Requested Date'} as MetadataModel
    }

    timeseriesData = { widgetId: 123, widgetName: 'test', widgetType: null, objectType: '1005', plantCode: '0', indexName: 'do_workflow', desc: '', timeSeries: widgetTimeseries, isEnableGlobalFilter : false }

    component.timeseriesData = timeseriesData;
    component.filterCriteria = [];
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'STATUS';

    component.updateForm('MATL_TYPE', { id: 1, value: '7', isActive: false });
    expect(component.updateForm('MATL_TYPE', { id: 1, value: '7', isActive: false })).toBe(undefined);
  }));

  it('codeTextValue()', async(() => {
    component.timeseriesData = {timeSeries : {metaData :{picklist:'1', fieldId:'MATL_GROUP'}}} as TimeSeriesWidget;
    let innerBucket: any = {key:'200010','top_hits#data_hits':{hits:{hits:[{_source:{hdvs:{MATL_GROUP:{vc:[{c:'200010', t:'testing'}]}}}}]}}};
    const fieldid = 'MATL_GROUP';
    expect(component.codeTextValue(innerBucket,fieldid)).toEqual({c:'200010', t:'testing'});

    innerBucket = {key:'200010'};
    expect(component.codeTextValue(innerBucket,fieldid)).toEqual('200010');
  }));

  it('dateAndCountFormat()', async(() => {
    const dataArr = {label:'2019'};
    const obj = {} as any;
    let dataObj = {x:'2005', y:2};
    let widgetTimeseries = {seriesWith: SeriesWith.year} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    component.dateAndCountFormat(dataObj, obj, dataArr);

    expect(obj.Year).toEqual('2005'+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.day} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataObj = {x:'1-10-2005', y:2};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Day).toEqual(dataObj.x+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.month} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataObj = {x:'1-10-2005', y:2};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Month).toEqual(dataObj.x+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.quarter} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataObj = {x:'1-10-2005', y:2};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Quater).toEqual(dataObj.x+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.week} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataObj = {x:'1-10-2005', y:2};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Week).toEqual(dataObj.x+'\t');
  }));

  it('dateAndCountFormat()', async(() => {
    let dataArr = {label:'2019'};
    const obj = {} as any;
    const dataObj = {};
    let widgetTimeseries = {seriesWith: SeriesWith.year} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    component.dateAndCountFormat(dataObj, obj, dataArr);

    expect(obj.Year).toEqual(dataArr.label+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.day} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataArr = {label:'1-10-2005'};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Day).toEqual(dataArr.label+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.month} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataArr = {label:'November'};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Month).toEqual(dataArr.label+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.quarter} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataArr = {label:'Q-1'};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Quater).toEqual(dataArr.label+'\t');

    widgetTimeseries = {seriesWith: SeriesWith.week} as WidgetTimeseries;
    component.timeseriesData = {timeSeries: widgetTimeseries} as TimeSeriesWidget;
    dataArr = {label:'Week-1'};
    component.dateAndCountFormat(dataObj, obj,dataArr);

    expect(obj.Week).toEqual(dataArr.label+'\t');
  }));

  it('checkTextCode() should return a string', async(() => {
    component.displayCriteriaOption = DisplayCriteria.CODE;
    const arrBucket = {code: 'admin', text: 'Administrator'};
    const arrBucket1 = { code: null, text: null};
    let res = component.checkTextCode(arrBucket);
    let res1 = component.checkTextCode(arrBucket1);

    expect(res).toEqual(arrBucket.code);
    expect(res1).toEqual('');

    component.displayCriteriaOption = DisplayCriteria.TEXT;
    res = component.checkTextCode(arrBucket);
    res1 = component.checkTextCode(arrBucket1);

    expect(res).toEqual(arrBucket.text);
    expect(res1).toEqual('');

    component.displayCriteriaOption = DisplayCriteria.CODE_TEXT;
    res = component.checkTextCode(arrBucket);

    expect(res).toEqual(`${arrBucket.code} -- ${arrBucket.text}`);
  }));
});
