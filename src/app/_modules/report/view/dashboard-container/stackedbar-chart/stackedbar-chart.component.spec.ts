import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedbarChartComponent } from './stackedbar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StackBarChartWidget, Criteria, WidgetHeader, PositionType, AlignPosition, AnchorAlignPosition} from '../../../_models/widget';
import { BehaviorSubject, of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective, Label } from 'ng2-charts';
import { WidgetService } from 'src/app/_services/widgets/widget.service';

describe('StackedbarChartComponent', () => {
  let component: StackedbarChartComponent;
  let fixture: ComponentFixture<StackedbarChartComponent>;
  let htmlnative: HTMLElement;
  let widgetService: jasmine.SpyObj<WidgetService>;
  beforeEach(async(() => {
    const widgetServiceSpy = jasmine.createSpyObj(WidgetService,['downloadCSV','getHeaderMetaData']);
    TestBed.configureTestingModule({
      declarations: [ StackedbarChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule],
      providers:[
        {provide: WidgetService, userValue: widgetServiceSpy}
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
    test.orientation = 'bar';
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect(component.stackBarWidget.getValue().orientation).toBe(component.orientation);
  }));

  it('should have true value for showLegend flag then set legend position', async(()=> {
    const test = new StackBarChartWidget();
    test.showLegend = true;
    test.legendPosition = PositionType.TOP;
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect(component.stackBarWidget.getValue().showLegend).toBe(true);
    expect(component.stackBarWidget.getValue().legendPosition).toBe(component.barChartOptions.legend.position);

  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async(()=> {
    const test = new StackBarChartWidget();
    test.showCountOnStack = true;
    test.datalabelPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER;
    component.stackBarWidget.next(test);
    component.getBarConfigurationData();
    expect(component.stackBarWidget.getValue().showCountOnStack).toBe(true);
    expect(component.stackBarWidget.getValue().datalabelPosition).toBe(component.barChartOptions.plugins.datalabels.align.toString());
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

});
