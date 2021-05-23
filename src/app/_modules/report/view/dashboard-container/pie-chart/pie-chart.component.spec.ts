import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';
import { PieChartWidget, AnchorAlignPosition, AlignPosition, PositionType, Criteria, WidgetHeader, WidgetColorPalette, Widget, WidgetType } from '../../../_models/widget';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of, BehaviorSubject } from 'rxjs';
import { ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '@modules/shared/shared.module';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let widgetService: jasmine.SpyObj<WidgetService>;
  let htmlnative: HTMLElement;
  const mockMatDialogOpen = {
    open: jasmine.createSpy('open')
  };
  beforeEach(async(() => {
    const widgetServiceSpy = jasmine.createSpyObj(WidgetService,['downloadCSV','getHeaderMetaData','getDisplayCriteria']);
    TestBed.configureTestingModule({
      declarations: [ PieChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule, SharedModule],
      providers:[
        {provide: WidgetService, userValue: widgetServiceSpy},
        {
          provide: MatDialog,
          useValue:mockMatDialogOpen
        }
      ]
    })
    .compileComponents();
    widgetService = TestBed.inject(WidgetService) as jasmine.SpyObj<WidgetService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    htmlnative = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stackClickFilter(), should filter , after click on bar stack',async(()=>{
    // call stack click with no argument then filter criteria should be [] array
    component.filterCriteria = [];
    component.stackClickFilter();
    expect(component.filterCriteria.length).toEqual(0);

    // mock data
    const array = [{_datasetIndex:0}];
    component.chartLegend = [{code:'MATL_TYPE',legendIndex:0,text:'Material Type'}];
    const barWidget: PieChartWidget = new PieChartWidget();
    barWidget.fieldId = 'MATL_TYPE';
    barWidget.metaData = {dataType:'1'} as MetadataModel;
    barWidget.blankValueAlias = 'MATL_TYPE';
    component.pieWidget.next(barWidget);
    component.filterCriteria = [{fieldId: 'MATL_TYPE'} as Criteria];

    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    component.chart = baseChart;
    component.stackClickFilter(null, array);
    // after apply filter criteria then filtercriteria length should be 1
    expect(component.filterCriteria.length).toEqual(2, 'after apply filter criteria then filtercriteria length should be 1');

    component.chartLegend = [{code:'REQUESTOR_DATE',legendIndex:0,text:'REQUESTOR DATE'}];
    const barWidget1: PieChartWidget = new PieChartWidget();
    barWidget1.fieldId = 'REQUESTOR_DATE';
    barWidget1.metaData = {dataType:'DTMS'} as MetadataModel;
    component.pieWidget.next(barWidget1);
    component.stackClickFilter(null, array);
    expect(component.filterCriteria.length).toEqual(3);

    component.chartLegend = [{code:'GM',legendIndex:0,text:'GM'}];
    const barWidget2: PieChartWidget = new PieChartWidget();
    barWidget2.fieldId = 'CURRENTUSER';
    barWidget2.metaData = {dataType:'CHAR'} as MetadataModel;
    component.pieWidget.next(barWidget2);
    component.filterCriteria = [{fieldId: 'CURRENTUSER', widgetType: WidgetType.PIE_CHART, conditionFieldValue:'admin'} as Criteria];
    component.widgetHeader = {isEnableGlobalFilter:true} as WidgetHeader;
    component.stackClickFilter(null, array);
    expect(component.filterCriteria.length).toEqual(1);
  }));

  it('getHeaderMetaData(), should call header metadata api', async(()=>{
    // mock data
    component.widgetId = 12345;
    const header = new WidgetHeader();
    spyOn(widgetService,'getHeaderMetaData').
    withArgs(component.widgetId).and.returnValue(of(header));

    //  call actual componenet method
    component.getHeaderMetaData();
    expect(component.widgetHeader).toEqual(header);
  }));

  it('getRandomColor(), Random Colour', async(()=>{
    component.getRandomColor();
    // length should be 7
    expect(component.getRandomColor().length).toEqual(7);
    // should contains #
    expect(component.getRandomColor()).toContain('#');
  }));

  it('removeOldFilterCriteria(), remove olf filter criteria ', async(()=>{
    const filter: Criteria = new Criteria();
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    component.removeOldFilterCriteria([filter]);
    expect(component.filterCriteria.length).toEqual(0,'after remove filter criteria length should be 0');
  }));

  it('should show bar orienation based on orienation value', async(()=> {
    const test = new PieChartWidget();
    // mock data
    test.orientation = 'pie';
    component.pieWidget.next(test);
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().orientation).toBe(component.orientation);
  }));

  it('should have true value for showLegend flag then set legend position', async(()=> {
    const test = new PieChartWidget();
    test.isEnableLegend = true;
    test.legendPosition = PositionType.TOP;
    component.pieWidget.next(test);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.chart.options = {scales : {xAxes: [{}], yAxes : [{}]}};
    component.chart = baseChart;
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().isEnableLegend).toBe(true);
    expect(component.pieWidget.getValue().legendPosition).toBe(component.chart.chart.options.legend.position);

  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async(()=> {
    const test = new PieChartWidget();
    test.isEnableDatalabels = true;
    test.datalabelsPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER;
    component.pieWidget.next(test);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.options = { plugins: { datalabels: {}}, scales : {xAxes: [{}], yAxes : [{}]}};
    baseChart.chart.options = baseChart.options;
    component.chart = baseChart;
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().isEnableDatalabels).toBe(true);
    expect(component.pieWidget.getValue().datalabelsPosition).toBe(component.chart.chart.options.plugins.datalabels.align.toString());

  }));

 it('ngOnInit(),  should enable pre required on this component', async(()=>{
  component.widgetId = 12345;
  component.widgetInfo = new Widget();
  component.widgetInfo.widgetType = WidgetType.PIE_CHART;
  component.widgetInfo.widgetId = component.widgetId.toString();
  component.pieWidget.next(new PieChartWidget());
  spyOn(widgetService, 'getDisplayCriteria').withArgs(component.widgetInfo.widgetId, component.widgetInfo.widgetType).and.returnValue(of({propId:'626039146695',widgetId:12345,createdBy:'initiator',createdAt:1618442609,displayCriteria:'CODE_TEXT'}));
  component.ngOnInit();
  expect(component.chartLegend.length).toEqual(0, 'Initial pie legend length should be 0');
  expect(component.lablels.length).toEqual(0, 'Initial pie lebels length should 0');
  expect(component.pieChartData[0].data.length).toEqual(6, 'Initial pie data  length should 6');
  expect(widgetService.getDisplayCriteria).toHaveBeenCalledWith(component.widgetInfo.widgetId, WidgetType.PIE_CHART);
}));

it('legendClick(), should show paticular stack , after click on stack',async(()=>{
  // call stack click with no argument then filter criteria should be [] array
  component.filterCriteria = [];
  const legendItem : ChartLegendLabelItem = {};
  legendItem.index = 0;
  // component.chartLegend = [{'legendIndex': 0, 'code':'HERS', 'text':'test'}];
  component.legendClick(legendItem);
  expect(component.filterCriteria.length).toEqual(0);

  // mock data
  component.chartLegend = [{code: 'ZMRO',text: 'ZMRO',legendIndex:0}];
  component.filterCriteria = [];
  const chartData = new PieChartWidget();
  chartData.fieldId = 'MATL_TYPE';
  chartData.metaData = {dataType: 'char'} as MetadataModel;
  component.pieWidget = new BehaviorSubject<PieChartWidget>(chartData);
  component.filterCriteria = [];
  component.legendClick(legendItem);
  // after apply filter criteria then filtercriteria length should be 1
  expect(component.filterCriteria.length).toEqual(1, 'after apply filter criteria then filtercriteria length should be 1');
}));

  it('should test downloadCSV()', async(()=> {
    component.lablels = ['No'];
    const chartData = new PieChartWidget();
    chartData.fieldId = 'CLAIMED';
    chartData.metaData = {fieldDescri: 'Claimed',fieldId: 'CLAIMED'} as MetadataModel;
    component.pieWidget.next(chartData);
    component.dataSet = ['1870'];
    const excelData = [{Claimed: 'No	', Value: '1870	'}];
    spyOn(widgetService,'downloadCSV').withArgs('Pie-Chart', excelData);
    component.downloadCSV();
    expect(widgetService.downloadCSV).toHaveBeenCalledWith('Pie-Chart', excelData);
  }));

  it('getFieldsMetadaDesc(), get description of field', async(()=>{
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'200010', t:'testing'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{staticFields:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'200030'}]}}}}]}}},{key:'200030','top_hits#items':{hits:{hits:[{_source:{staticFields:{MATL_GROUP:{}}}}]}}}];

    const data: PieChartWidget = new PieChartWidget();
    data.fieldId = 'MATL_GROUP';
    component.pieWidget.next(data);
    component.lablels = ['testing','200030'];
    // call actual method
    component.getFieldsMetadaDesc(buckets);

    expect(component.lablels.length).toEqual(2);
    expect(component.chartLegend.length).toEqual(2);

    const buckets1 = [{key:'200030','top_hits#items':{hits:{hits:[{_source:{staticFields:{OVERDUE:{vc:[{c:'1'}]}}}}]}}}];
    const data1: PieChartWidget = new PieChartWidget();
    data1.fieldId = 'OVERDUE';
    component.pieWidget.next(data1);
    component.lablels = ['YES'];
    // call actual method
    component.getFieldsMetadaDesc(buckets1);
    expect(component.lablels.length).toEqual(3);
    expect(component.chartLegend.length).toEqual(3);
  }));

  it('getDateFieldsDesc(), get description of field', async(()=>{
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'1600709041279'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'1600709041279'}]}}}}]}}}];

    const data: PieChartWidget = new PieChartWidget();
    data.fieldId = 'MATL_GROUP';
    component.pieWidget.next(data);
    component.lablels = ['200010','200030'];
    // call actual method
    component.getDateFieldsDesc(buckets);

    expect(component.lablels.length).toEqual(2);
    expect(component.chartLegend.length).toEqual(2);
  }));

  it('getPieChartData(), get pie chart data', async(()=>{
    const service = fixture.debugElement.injector.get(WidgetService);
    const buckets = {aggregations:{'sterms#BAR_CHART':{buckets:[{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'200010'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'200030'}]}}}}]}}}]}}};

    spyOn(service,'getWidgetData').withArgs('653267432',[]).and.returnValue(of(buckets));

    const pieWidget: PieChartWidget = new PieChartWidget();
    pieWidget.fieldId = 'MATL_GROUP';
    pieWidget.metaData = {fieldId:'MATL_GROUP',picklist:'30'} as MetadataModel;

    component.pieWidget.next(pieWidget);
    component.widgetColorPalette = new WidgetColorPalette();

    component.getPieChartData(653267432, []);

    expect(service.getWidgetData).toHaveBeenCalledWith('653267432', []);
  }));

  it('openColorPalette(), should open color palette dialog', async(()=>{
    component.widgetId = 72366423;
    component.reportId = 65631624;
    component.widgetHeader = {desc: 'Stacked bar Chart'} as WidgetHeader;
    component.pieChartData = [
      {
        fieldCode: 'HAWA',
        backgroundColor: '#f1f1f1',
        label: 'Hawa material',
        data:[213,324,223423]
      }
    ];
    component.chartLegend = [{
      code: 'HAWA',
      legendIndex:0,
      text:'Testing'
    }]
    component.openColorPalette();
    expect(mockMatDialogOpen.open).toHaveBeenCalled();
  }));

  it('updateColorBasedOnDefined(), update color based on defination ', async(()=>{
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = '23467283';
    component.pieChartData = [
      {
        fieldCode: 'HAWA',
        backgroundColor: '#f1f1f1',
        label: 'Hawa material',
        data:[213,324,223423]
      }
    ];
    component.chartLegend = [{
      code: 'HAWA',
      legendIndex:0,
      text:'Testing'
    }]
    component.updateColorBasedOnDefined(req);
    expect(component.widgetColorPalette.widgetId).toEqual(req.widgetId);

  }));

  it('getUpdatedColorCode(), get updated color based on code', async(()=>{
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.colorPalettes = [{
      code: 'HAWA',
      colorCode: '#f1f1f1',
      text: 'Hawa material'
    }];
    component.widgetColorPalette = req;
    const actualRes = component.getUpdatedColorCode('HAWA');
    expect(actualRes).toEqual('#f1f1f1');

  }));

  it('ngOnChanges(), while change rule type', async(()=>{
    // mock data
    const changes: import('@angular/core').SimpleChanges = {filterCriteria:{currentValue:true, previousValue:false,firstChange:null,isFirstChange:null}, boxSize:{currentValue:35, previousValue:26,firstChange:null,isFirstChange:null}};
    component.widgetHeader = { isEnableGlobalFilter: true } as WidgetHeader;
    component.ngOnChanges(changes);
    expect(component.boxSize).toEqual(35);

    component.widgetHeader = { isEnableGlobalFilter: false } as WidgetHeader;
    component.ngOnChanges(changes);
    expect(component.lablels.length).toEqual(0);

    const changes2: import('@angular/core').SimpleChanges = {};
    component.ngOnChanges(changes2);
    expect(component.ngOnChanges).toBeTruthy();
  }));

  it('applyDateFilter()', async (() => {
    const startDate = '1588204800000';
    const fieldId = 'REQUESTOR_DATE';
    const res = component.applyDateFilter(startDate, fieldId);
    expect(res.conditionFieldEndValue).toEqual('1588291200000');
  }));
});
