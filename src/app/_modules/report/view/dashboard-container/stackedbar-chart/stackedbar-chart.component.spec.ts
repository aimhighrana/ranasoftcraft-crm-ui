import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedbarChartComponent } from './stackedbar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StackBarChartWidget, Criteria, WidgetHeader, PositionType, AlignPosition, AnchorAlignPosition, Orientation, OrderWith, WidgetColorPalette} from '../../../_models/widget';
import { BehaviorSubject, of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective, Label } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { ChartLegendLabelItem } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '@modules/shared/shared.module';

describe('StackedbarChartComponent', () => {
  let component: StackedbarChartComponent;
  let fixture: ComponentFixture<StackedbarChartComponent>;
  let htmlnative: HTMLElement;
  let widgetService: jasmine.SpyObj<WidgetService>;

  const mockMatDialogOpen = {
    open: jasmine.createSpy('open')
  };

  beforeEach(async(() => {
    const widgetServiceSpy = jasmine.createSpyObj(WidgetService,['downloadCSV','getHeaderMetaData', 'getWidgetData']);
    TestBed.configureTestingModule({
      declarations: [ StackedbarChartComponent ],
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
    fixture = TestBed.createComponent(StackedbarChartComponent);
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

    const array = [{_datasetIndex:0,_index:0}];
    component.stackClickFilter(null, array);

    component.stackbarLegend = [{code: 'ZMRO',text: 'ZMRO',legendIndex:0}];
    component.stachbarAxis = [{code: '10001',text: 'Mat 001 ',legendIndex:0}];
    component.filterCriteria = [];
    const chartWidget = new StackBarChartWidget();
    chartWidget.fieldId = 'MATL_TYPE';
    chartWidget.groupById = 'MATL_GROUP';
    component.stackBarWidget = new BehaviorSubject<StackBarChartWidget>(chartWidget);

    // mock stacked
    const eleRef = htmlnative.getElementsByTagName('canvas')[0];
    const baseChart = new BaseChartDirective(eleRef[0], null);
    baseChart.chart = {canvas: eleRef, getElementAtEvent:(e: any) => [{_datasetIndex:0, _index: 0} as any] } as Chart;
    component.chart = baseChart;
    component.stackClickFilter(null, array);
    // after apply filter criteria then filtercriteria length should be 1
    expect(component.filterCriteria.length).toEqual(2, 'after apply filter criteria then filtercriteria length should be 2');
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

  it('updateLabelsaxis1(), update axis label', async(()=>{
    // create mock data
    const barChartLbl = ['Label 1', 'Label 2'];
    const lablDesc = {'Label 1': 'Label 1 desc'};

    // asign to component variable
    component.barChartLabels = barChartLbl as Label[];
    component.codeTextaxis1  = lablDesc;

    // call actual method
    component.updateLabelsaxis1();

    expect(barChartLbl.length).toEqual(component.barChartLabels.length, 'Bar chart labels length should equal');
    expect(lablDesc['Label 1']).toEqual(component.barChartLabels[0], 'Code description should equal');
    expect('Label 2').toEqual(component.barChartLabels[1], 'If description is not available then return code');


  }));


  it('updateLabelsaxis2(), update axis 2 labels', async(()=>{
     // mock data
     const listxAxis2 = ['Label 1', 'Label 2'];

     // assign to component variable
     component.listxAxis2 = listxAxis2;
     component.barChartData = [];
     component.widgetColorPalette = new WidgetColorPalette();

     // call actual component method
     component.updateLabelsaxis2();

     expect(listxAxis2.length).toEqual(component.barChartData.length, 'Bar chart data length equals to axis 2');
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

  it('ngOnInit(),  should enable pre required on this component', async(()=>{
    component.stackBarWidget.next(new StackBarChartWidget());
    component.ngOnInit();
    expect(component.stackbarLegend.length).toEqual(0, 'Initial stacked bar legend length should be 0');
    expect(component.stachbarAxis.length).toEqual(0, 'Initial stacked bar axis length should be 0');
    expect(component.barChartLabels.length).toEqual(0, 'Initial stack chart lebels length should 0');
    expect(component.listxAxis2.length).toEqual(0, 'Initial stack chart Axis2 length should 0');
    expect(component.barChartData[0].data.length).toEqual(5, 'Initial stack chart data  length should 5');
  }));

  it('should show bar orienation based on orienation value', async(()=> {
    const test = new StackBarChartWidget();
    test.orientation = Orientation.VERTICAL;
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect('bar').toBe(component.orientation);
  }));

  it('should have true value for showLegend flag then set legend position', async(()=> {
    const test = new StackBarChartWidget();
    test.isEnableLegend = true;
    test.legendPosition = PositionType.TOP;
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect(component.stackBarWidget.getValue().isEnableLegend).toBe(true);
    expect(component.stackBarWidget.getValue().legendPosition).toBe(component.barChartOptions.legend.position);

  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async(()=> {
    const test = new StackBarChartWidget();
    test.isEnableDatalabels = true;
    test.datalabelsPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER;
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect(component.stackBarWidget.getValue().isEnableDatalabels).toBe(true);
    expect(component.stackBarWidget.getValue().datalabelsPosition).toBe(component.barChartOptions.plugins.datalabels.align.toString());
    expect(component.stackBarWidget.getValue().anchorPosition).toBe(component.barChartOptions.plugins.datalabels.anchor.toString());

  }));

  it('should have true value for displayAxisLable flag then set xAxisLable, yAxisLable', async (() => {
    const test = new StackBarChartWidget();
    test.displayAxisLabel = true;
    test.xAxisLabel = 'X';
    test.yAxisLabel = 'Y';
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect(component.stackBarWidget.getValue().displayAxisLabel).toBe(true);
    expect(component.stackBarWidget.getValue().xAxisLabel).toBe(component.barChartOptions.scales.xAxes[0].scaleLabel.labelString);
    expect(component.stackBarWidget.getValue().yAxisLabel).toBe(component.barChartOptions.scales.yAxes[0].scaleLabel.labelString);
  }));

  it(`setChartAxisAndScaleRange(), should set chart axis and scale on chart option`,async(()=>{
    // mock data
    const barWidget =  new StackBarChartWidget();
    barWidget.orderWith = OrderWith.ASC;
    barWidget.scaleFrom = 0;
    barWidget.scaleTo = 20;
    barWidget.stepSize = 4;
    barWidget.xAxisLabel = 'Material Type';
    barWidget.yAxisLabel = 'Value';
    component.stackBarWidget.next(barWidget);

    const ticks = {min:barWidget.scaleFrom, max:barWidget.scaleTo, stepSize:barWidget.stepSize};
    // call actual component function
    component.setChartAxisAndScaleRange();

    // asserts & expect
    expect(component.barChartOptions.scales.yAxes[0].ticks).toEqual(ticks);
    // expect(component.barChartOptions.scales.xAxes[0].ticks).toEqual(undefined);
    expect(component.barChartOptions.scales.yAxes[0].scaleLabel.labelString).toEqual(barWidget.yAxisLabel);
    expect(component.barChartOptions.scales.xAxes[0].scaleLabel.labelString).toEqual(barWidget.xAxisLabel);

    // scenario  2
    barWidget.orientation = Orientation.HORIZONTAL;
    component.stackBarWidget.next(barWidget);

    // call actual component method
    component.setChartAxisAndScaleRange();

    // asserts & expect
    expect(component.barChartOptions.scales.xAxes[0].ticks).toEqual(ticks);
    // expect(component.barChartOptions.scales.yAxes[0].ticks).toEqual(undefined);
    expect(component.barChartOptions.scales.yAxes[0].scaleLabel.labelString).toEqual(barWidget.yAxisLabel);
    expect(component.barChartOptions.scales.xAxes[0].scaleLabel.labelString).toEqual(barWidget.xAxisLabel);

    // scenario  3
    const data = new StackBarChartWidget();
    data.xAxisLabel = 'Data 1';
    component.stackBarWidget.next(data);
    // call actual component method
    component.setChartAxisAndScaleRange();

    // asserts & expect
    // expect(component.barChartOptions.scales.xAxes[0].ticks).toEqual(undefined);
    // expect(component.barChartOptions.scales.yAxes[0].ticks).toEqual(undefined);
    expect(component.barChartOptions.scales.yAxes[0].scaleLabel.labelString).toEqual('');
    expect(component.barChartOptions.scales.xAxes[0].scaleLabel.labelString).toEqual(data.xAxisLabel);
  }));


  it(`transformDataSets(), data transformation before rander on chart`, async(()=>{
    // mock data
    const barWidget =  new StackBarChartWidget();
    barWidget.orderWith = OrderWith.ASC;
    barWidget.scaleFrom = 0;
    barWidget.scaleTo = 20;
    barWidget.stepSize = 4;
    component.stackBarWidget.next(barWidget);
    const resBuckets = [{key:'HAWA',doc_count:10},{key:'DEIN',doc_count:3},{key:'ZMRO',doc_count:30}]

    // call actual component method
    const actualResponse = component.transformDataSets(resBuckets);

    // expects
    expect(actualResponse.length).toEqual(2,`Data should be interval in scale range`);
    expect(actualResponse[0].doc_count).toEqual(3,`Small doc count should be on first position`);
    expect(actualResponse[1].doc_count).toEqual(10,`10 should be on second position`);

    // scenario  2
    barWidget.orderWith = OrderWith.DESC;
    barWidget.scaleTo = 30;
    component.stackBarWidget.next(barWidget);

    // call actual component method
    const actualResponse01 = component.transformDataSets(resBuckets);

    // expects
    expect(actualResponse01.length).toEqual(3,`Data should be interval in scale range`);
    expect(actualResponse01[0].doc_count).toEqual(30,`Top or max doc count should be on first position`);
    expect(actualResponse01[1].doc_count).toEqual(10,`10 should be on second position`);


    // scenario  3
    barWidget.dataSetSize = 1;
    component.stackBarWidget.next(barWidget);

    // call actual component method
    const actualResponse1 = component.transformDataSets(resBuckets);

    expect(actualResponse1.length).toEqual(1,`After applied datasetSize length should be equals to dataSetSize`);


  }));

  it('getFieldsMetadaDescaxis1(), get description of axis 1', async(()=>{
    const res = [{key:{STATUS__C:'',LEVEL__C:''},doc_count:3,'top_hits#items':{hits:{total:{value:3,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TEMP003',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',lls:{EN:{label:'Status'}},vls:{EN:{valueTxt:''}},vc:[{c:''}]},LEVEL__C:{fId:'LEVEL__C',lls:{EN:{label:'Level'}},vls:{EN:{valueTxt:''}},vc:[{c:''}]}}}}]}}},{key:{STATUS__C:'',LEVEL__C:'Level 3'},doc_count:2,'top_hits#items':{hits:{total:{value:2,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TMP000000000000009',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',loc:'',lls:{EN:{label:'Status'}},ddv:[],msdv:[],vls:{EN:{valueTxt:''}},vc:[{c:''}]},LEVEL__C:{fId:'LEVEL__C',loc:'',lls:{EN:{label:'Level'}},ddv:[{val:'Level 3: $100K - $1MM',lang:'EN'}],msdv:[],vls:{EN:{valueTxt:'Level 3'}},vc:[{c:'Level 3'}]}}}}]}}}];

    component.arrayBuckets = res;
    component.getFieldsMetadaDescaxis1('LEVEL__C');

    expect(component.codeTextaxis1['Level 3']).toEqual(undefined);


  }));

  /* it('getDateFieldsDesc1(), get description of axis 1', async(()=>{
    const res = [{key:{STATUS__C:'',LEVEL__C:''},doc_count:3,'top_hits#items':{hits:{total:{value:3,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TEMP003',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',lls:{EN:{label:'Status'}},vls:{EN:{valueTxt:''}},vc:[{c:'1600709041279'}]},LEVEL__C:{fId:'LEVEL__C',lls:{EN:{label:'Level'}},vls:{EN:{valueTxt:''}},vc:[{c:'1600709041279'}]}}}}]}}},{key:{STATUS__C:'',LEVEL__C:'Level 3'},doc_count:2,'top_hits#items':{hits:{total:{value:2,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TMP000000000000009',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',loc:'',lls:{EN:{label:'Status'}},ddv:[],msdv:[],vls:{EN:{valueTxt:''}},vc:[{c:''}]},LEVEL__C:{fId:'LEVEL__C',loc:'',lls:{EN:{label:'Level'}},ddv:[{val:'Level 3: $100K - $1MM',lang:'EN'}],msdv:[],vls:{EN:{valueTxt:'Level 3'}},vc:[{c:'1600709041279'}]}}}}]}}}];

    component.arrayBuckets = res;
    component.getDateFieldsDesc1('LEVEL__C');

    expect(component.codeTextaxis1['Level 3']).toEqual('9/21/2020');


  })); */

  it('getFieldsMetadaDescaxis2(), get description of axis 2', async(()=>{
    const res = [{key:{STATUS__C:'',LEVEL__C:''},doc_count:3,'top_hits#items':{hits:{total:{value:3,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TEMP003',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',lls:{EN:{label:'Status'}},vls:{EN:{valueTxt:''}},vc:[{c:''}]},LEVEL__C:{fId:'LEVEL__C',lls:{EN:{label:'Level'}},vls:{EN:{valueTxt:''}},vc:[{c:''}]}}}}]}}},{key:{STATUS__C:'',LEVEL__C:'Level 3'},doc_count:2,'top_hits#items':{hits:{total:{value:2,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TMP000000000000009',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',loc:'',lls:{EN:{label:'Status'}},ddv:[],msdv:[],vls:{EN:{valueTxt:''}},vc:[{c:''}]},LEVEL__C:{fId:'LEVEL__C',loc:'',lls:{EN:{label:'Level'}},ddv:[{val:'Level 3: $100K - $1MM',lang:'EN'}],msdv:[],vls:{EN:{valueTxt:'Level 3'}},vc:[{c:'Level 3'}]}}}}]}}}];

    component.arrayBuckets = res;
    component.getFieldsMetadaDescaxis2('STATUS__C');

    expect(component.codeTextaxis1['']).toEqual(undefined);


  }));

  it('getDateFieldsDesc2(), get description of axis 2', async(()=>{
    const res = [{key:{STATUS__C:'',LEVEL__C:''},doc_count:3,'top_hits#items':{hits:{total:{value:3,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TEMP003',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',lls:{EN:{label:'Status'}},vls:{EN:{valueTxt:''}},vc:[{c:'1600709041279'}]},LEVEL__C:{fId:'LEVEL__C',lls:{EN:{label:'Level'}},vls:{EN:{valueTxt:''}},vc:[{c:'1600709041279'}]}}}}]}}},{key:{STATUS__C:'',LEVEL__C:'Level 3'},doc_count:2,'top_hits#items':{hits:{total:{value:2,relation:'eq'},max_score:1.0,hits:[{_index:'localhost_3901_do_0',_type:'_doc',_id:'TMP000000000000009',_score:1.0,_source:{hdvs:{STATUS__C:{fId:'STATUS__C',loc:'',lls:{EN:{label:'Status'}},ddv:[],msdv:[],vls:{EN:{valueTxt:''}},vc:[{c:''}]},LEVEL__C:{fId:'LEVEL__C',loc:'',lls:{EN:{label:'Level'}},ddv:[{val:'Level 3: $100K - $1MM',lang:'EN'}],msdv:[],vls:{EN:{valueTxt:'Level 3'}},vc:[{c:'1600709041279'}]}}}}]}}}];

    component.arrayBuckets = res;
    component.getDateFieldsDesc2('STATUS__C');

    expect(component.codeTextaxis1['']).toEqual(undefined);


  }));

  it('legendClick(), legend click ', async(()=>{
    const item: ChartLegendLabelItem = {datasetIndex:0} as ChartLegendLabelItem;

    component.stackbarLegend = [{code:'MATL_TYPE',legendIndex:0,text:'Material Type'}];

    const stackBarWidget: StackBarChartWidget = new StackBarChartWidget();
    stackBarWidget.fieldId = 'MATL_TYPE';
    component.stackBarWidget.next(stackBarWidget);

    component.filterCriteria = [{fieldId: 'MATL_TYPE'} as Criteria];

    component.legendClick(item);

    expect(component.filterCriteria.length).toEqual(2);

    component.filterCriteria = [];

    component.legendClick(item);

    expect(component.filterCriteria.length).toEqual(1);

  }));

  it('openColorPalette(), should open color palette dialog', async(()=>{
    component.widgetId = 72366423;
    component.reportId = 65631624;
    component.widgetHeader = {desc: 'Stacked bar Chart'} as WidgetHeader;
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
});
