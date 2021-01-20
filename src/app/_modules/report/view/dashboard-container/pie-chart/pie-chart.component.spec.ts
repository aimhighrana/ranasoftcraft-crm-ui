import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';
import { PieChartWidget, AnchorAlignPosition, AlignPosition, PositionType, Criteria, WidgetHeader, WidgetColorPalette } from '../../../_models/widget';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of, BehaviorSubject } from 'rxjs';
import { ChartLegendLabelItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { MatDialog } from '@angular/material/dialog';
import { SimpleChanges } from '@angular/core';
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
    const widgetServiceSpy = jasmine.createSpyObj(WidgetService,['downloadCSV','getHeaderMetaData']);
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
    component.chartLegend = [{code: 'ZMRO',text: 'ZMRO',legendIndex:0}];
    component.filterCriteria = [];
    const chartData = new PieChartWidget();
    chartData.fieldId = 'MATL_TYPE';
    component.pieWidget = new BehaviorSubject<PieChartWidget>(chartData);
    component.filterCriteria = [];

    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    component.chart = baseChart;
    component.stackClickFilter(null, array);
    // after apply filter criteria then filtercriteria length should be 1
    expect(component.filterCriteria.length).toEqual(1, 'after apply filter criteria then filtercriteria length should be 1');
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
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().isEnableLegend).toBe(true);
    expect(component.pieWidget.getValue().legendPosition).toBe(component.pieChartOptions.legend.position);

  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async(()=> {
    const test = new PieChartWidget();
    test.isEnableDatalabels = true;
    test.datalabelsPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER;
    component.pieWidget.next(test);
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().isEnableDatalabels).toBe(true);
    expect(component.pieWidget.getValue().datalabelsPosition).toBe(component.pieChartOptions.plugins.datalabels.align.toString());

  }));

 it('ngOnInit(),  should enable pre required on this component', async(()=>{
  component.pieWidget.next(new PieChartWidget());
  component.ngOnInit();
  expect(component.chartLegend.length).toEqual(0, 'Initial pie legend length should be 0');
  expect(component.lablels.length).toEqual(0, 'Initial pie lebels length should 0');
  expect(component.pieChartData[0].data.length).toEqual(6, 'Initial pie data  length should 6');
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
  component.pieWidget = new BehaviorSubject<PieChartWidget>(chartData);
  component.filterCriteria = [];
  component.legendClick(legendItem);
  // after apply filter criteria then filtercriteria length should be 1
  expect(component.filterCriteria.length).toEqual(1, 'after apply filter criteria then filtercriteria length should be 1');
}));

  it('should test downloadCSV()', async(()=> {
    const excelData : any[] = [];
    excelData.push({label :'ZERO',data: 110});
    spyOn(widgetService,'downloadCSV').and.returnValue();
    component.downloadCSV();
    expect(excelData[0]).toEqual({label :'ZERO',data: 110});
    expect(widgetService.downloadCSV).toHaveBeenCalledWith('Pie-Chart',[]);
  }));

  it('getFieldsMetadaDesc(), get description of field', async(()=>{
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'200010'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'200030'}]}}}}]}}}];

    const data: PieChartWidget = new PieChartWidget();
    data.fieldId = 'MATL_GROUP';
    component.pieWidget.next(data);
    component.lablels = ['200010','200030'];
    // call actual method
    component.getFieldsMetadaDesc(buckets);

    expect(component.lablels.length).toEqual(2);
    expect(component.chartLegend.length).toEqual(2);
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

  it('ngOnChanges(), should check if there are new filter criteria', async(() => {
    const filterCriteria = [{fieldId:'test'} as Criteria,{fieldId:'test1'} as Criteria];
    const chnages: SimpleChanges = {filterCriteria:{currentValue:filterCriteria, previousValue: null, firstChange:null, isFirstChange:null}};
    spyOn(component.pieWidget, 'next');
    component.ngOnChanges(chnages);
    expect(component.pieWidget.next).toHaveBeenCalled();
  }));

});
