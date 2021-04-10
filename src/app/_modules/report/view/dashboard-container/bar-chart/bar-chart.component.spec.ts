import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BarChartWidget, Orientation, OrderWith, WidgetHeader, WidgetColorPalette, Widget } from '../../../_models/widget';
import { BehaviorSubject, of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts';
import { PositionType, AlignPosition, AnchorAlignPosition } from '../../../_models/widget';
import { WidgetService } from '@services/widgets/widget.service';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '@modules/shared/shared.module';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;
  let htmlnative: HTMLElement;

  const mockMatDialogOpen = {
    open: jasmine.createSpy('open')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent, BaseChartDirective ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule, SharedModule],
      providers:[
        {
          provide: MatDialog,
          useValue:mockMatDialogOpen
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
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
    const chartData = new BarChartWidget();
    chartData.fieldId = 'MATL_TYPE';
    component.barWidget = new BehaviorSubject<BarChartWidget>(chartData);
    component.filterCriteria = [];

    // mock chart
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    component.chart = baseChart;
    component.stackClickFilter(null, array);
    // after apply filter criteria then filtercriteria length should be 1
    expect(component.filterCriteria.length).toEqual(1, 'after apply filter criteria then filtercriteria length should be 1');
  }));

  it('should show bar orienation based on orienation value', async( () => {
    const test = new BarChartWidget();
    test.orientation = Orientation.HORIZONTAL;
    test.legendPosition = PositionType.TOP;
    component.barWidget.next(test);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.chart.options = {scales : {xAxes: [{}], yAxes : [{}]}};
    component.chart = baseChart;
    component.getBarConfigurationData();
    expect('horizontalBar').toBe(component.orientation);
  }));

  it('should have true value for showLegend flag then set legend position', async ( () => {
    const test = new BarChartWidget();
    test.isEnableLegend = true;
    test.legendPosition = PositionType.TOP;
    component.barWidget.next(test);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.chart.options = {scales : {xAxes: [{}], yAxes : [{}]}};
    component.chart = baseChart;
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().isEnableLegend).toBe(component.chart.chart.options.legend.display);
    expect(component.barWidget.getValue().legendPosition).toBe(component.chart.chart.options.legend.position);
  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async ( () => {
    const test = new BarChartWidget();
    test.isEnableDatalabels = true;
    test.datalabelsPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER
    component.barWidget.next(test);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.chart.options = {scales : {xAxes: [{}], yAxes : [{}]}};
    component.chart = baseChart;
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().isEnableDatalabels).toBe(true);
    expect(component.barWidget.getValue().datalabelsPosition).toBe(component.chart.chart.options.plugins.datalabels.align.toString());
    expect(component.barWidget.getValue().anchorPosition).toBe(component.chart.chart.options.plugins.datalabels.anchor.toString());
  }));

  it('should have true value for displayAxisLable flag then set xAxisLabel, yAxisLabel', async (() => {
    const test = new BarChartWidget();
    test.displayAxisLabel = true;
    test.xAxisLabel = 'X-Axis';
    test.yAxisLabel = 'Y-Axis';
    component.barWidget.next(test);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.chart.options = {scales : {xAxes: [{}], yAxes : [{}]}};
    component.chart = baseChart;
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().displayAxisLabel).toBe(true);
    expect(component.barWidget.getValue().xAxisLabel).toBe(component.chart.chart.options.scales.xAxes[0].scaleLabel.labelString);
    expect(component.barWidget.getValue().yAxisLabel).toBe(component.chart.chart.options.scales.yAxes[0].scaleLabel.labelString);
  }));

  it(`setChartAxisAndScaleRange(), should set chart axis and scale on chart option`,async(()=>{
    // mock data
    const barWidget =  new BarChartWidget();
    barWidget.orderWith = OrderWith.ASC;
    barWidget.scaleFrom = 0;
    barWidget.scaleTo = 20;
    barWidget.stepSize = 4;
    barWidget.xAxisLabel = 'Material Type';
    barWidget.yAxisLabel = 'Value';
    component.barWidget.next(barWidget);
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    baseChart.chart.options = {scales : {xAxes: [{}], yAxes : [{}]}};
    component.chart = baseChart;

    const ticks = {min:barWidget.scaleFrom, max:barWidget.scaleTo, stepSize:barWidget.stepSize};
    // call actual component function
    component.setChartAxisAndScaleRange();

    // asserts & expect
    expect(component.chart.chart.options.scales.yAxes[0].ticks).toEqual(ticks);
    // expect(component.barChartOptions.scales.xAxes[0].ticks).toEqual(undefined);
    expect(component.chart.chart.options.scales.yAxes[0].scaleLabel.labelString).toEqual(barWidget.yAxisLabel);
    expect(component.chart.chart.options.scales.xAxes[0].scaleLabel.labelString).toEqual(barWidget.xAxisLabel);

    // scenario  2
    barWidget.orientation = Orientation.HORIZONTAL;
    component.barWidget.next(barWidget);

    // call actual component method
    component.setChartAxisAndScaleRange();

    // asserts & expect
    expect(component.chart.chart.options.scales.xAxes[0].ticks).toEqual(ticks);
    // expect(component.barChartOptions.scales.yAxes[0].ticks).toEqual(undefined);
    expect(component.chart.chart.options.scales.yAxes[0].scaleLabel.labelString).toEqual(barWidget.yAxisLabel);
    expect(component.chart.chart.options.scales.xAxes[0].scaleLabel.labelString).toEqual(barWidget.xAxisLabel);

    // scenario  3
    const data = new BarChartWidget();
    data.xAxisLabel = 'Data 1';
    component.barWidget.next(data);

    // call actual component method
    component.setChartAxisAndScaleRange();

    // asserts & expect
    // expect(component.barChartOptions.scales.xAxes[0].ticks).toEqual(undefined);
    // expect(component.barChartOptions.scales.yAxes[0].ticks).toEqual(undefined);
    expect(component.chart.chart.options.scales.yAxes[0].scaleLabel.labelString).toEqual('');
    expect(component.chart.chart.options.scales.xAxes[0].scaleLabel.labelString).toEqual(data.xAxisLabel);
  }));


  it(`transformDataSets(), data transformation before rander on chart`, async(()=>{
    // mock data
    const barWidget =  new BarChartWidget();
    barWidget.orderWith = OrderWith.ASC;
    barWidget.scaleFrom = 0;
    barWidget.scaleTo = 20;
    barWidget.stepSize = 4;
    component.barWidget.next(barWidget);
    const resBuckets = [{key:'HAWA',doc_count:10},{key:'DEIN',doc_count:3},{key:'ZMRO',doc_count:30}]

    // call actual component method
    const actualResponse = component.transformDataSets(resBuckets);

    // expects
    expect(actualResponse.length).toEqual(2,`Data should be interval in scale range`);
    expect(component.lablels.length).toEqual(2,`Lablels length should be 2`);

    // scenario  2
    barWidget.dataSetSize = 1;
    component.barWidget.next(barWidget);

    // call actual component method
    const actualResponse1 = component.transformDataSets(resBuckets);

    expect(actualResponse1.length).toEqual(1,`After applied datasetSize length should be equals to dataSetSize`);


  }));

  it('getFieldsMetadaDesc(), get description of field', async(()=>{
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'200010'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'200030'}]}}}}]}}}];

    const data: BarChartWidget = new BarChartWidget();
    data.fieldId = 'MATL_GROUP';
    component.barWidget.next(data);
    component.lablels = ['200010','200030'];
    // call actual method
    component.getFieldsMetadaDesc(buckets);

    expect(component.lablels.length).toEqual(2);
    expect(component.chartLegend.length).toEqual(2);
  }));

  it('getBarChartData(), get bar chart data', async(()=>{
    const service = fixture.debugElement.injector.get(WidgetService);
    const buckets = {aggregations:{'sterms#BAR_CHART':{buckets:[{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'27364237'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'8326286'}]}}}}]}}}]}}};

    spyOn(service,'getWidgetData').withArgs('653267432',[]).and.returnValue(of(buckets));

    const pieWidget: BarChartWidget = new BarChartWidget();
    pieWidget.fieldId = 'MATL_GROUP';
    pieWidget.metaData = {fieldId:'MATL_GROUP',picklist:'30'} as MetadataModel;

    component.barWidget.next(pieWidget);

    component.widgetInfo = new Widget();
    component.getBarChartData(653267432, []);

    expect(service.getWidgetData).toHaveBeenCalledWith('653267432', []);
  }));

  it('openColorPalette(), should open color palette dialog', async(()=>{
    component.widgetId = 72366423;
    component.reportId = 65631624;
    component.widgetHeader = {desc: 'Bar Chart'} as WidgetHeader;
    component.barChartData = [
      {
        fieldCode: 'HAWA',
        backgroundColor: '#f1f1f1',
        label: 'Hawa material'
      }
    ];
    component.openColorPalette();
    expect(mockMatDialogOpen.open).toHaveBeenCalled();
  }));

  it('updateColorBasedOnDefined(), update color based on defination ', async(()=>{
    const req: WidgetColorPalette = new WidgetColorPalette();
    req.widgetId = '23467283';
    req.colorPalettes = [{
      code: 'HAWA',
      colorCode: '#f1f1f1',
      text: 'Hawa material'
    }];

    component.updateColorBasedOnDefined(req);
    expect(component.widgetColorPalette.widgetId).toEqual(req.widgetId);
  }));

  it('getDateFieldsDesc(), get description of field', async(()=>{
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:[{c:'1600709041279'}]}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:[{c:'1600709041279'}]}}}}]}}}];

    const data: BarChartWidget = new BarChartWidget();
    data.fieldId = 'MATL_GROUP';
    component.barWidget.next(data);
    component.lablels = ['200010','200030'];
    // call actual method
    component.getDateFieldsDesc(buckets);

    expect(component.lablels.length).toEqual(2);
    expect(component.chartLegend.length).toEqual(2);
  }));

});
