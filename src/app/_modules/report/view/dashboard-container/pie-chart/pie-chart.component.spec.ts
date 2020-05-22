import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart.component';
import { PieChartWidget, AnchorAlignPosition, AlignPosition, PositionType, Criteria, WidgetHeader } from '../../../_models/widget';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of, BehaviorSubject } from 'rxjs';
import { ChartLegendLabelItem } from 'chart.js';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let widgetService: jasmine.SpyObj<WidgetService>;
  beforeEach(async(() => {
    const widgetServiceSpy = jasmine.createSpyObj(WidgetService,['downloadCSV','getHeaderMetaData']);
    TestBed.configureTestingModule({
      declarations: [ PieChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule],
      providers:[
        {provide: WidgetService, userValue: widgetServiceSpy}
      ]
    })
    .compileComponents();
    widgetService = TestBed.inject(WidgetService) as jasmine.SpyObj<WidgetService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    test.showLegend = true;
    test.legendPosition = PositionType.TOP;
    component.pieWidget.next(test);
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().showLegend).toBe(true);
    expect(component.pieWidget.getValue().legendPosition).toBe(component.pieChartOptions.legend.position);

  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async(()=> {
    const test = new PieChartWidget();
    test.showCountOnStack = true;
    test.datalabelPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER;
    component.pieWidget.next(test);
    component.getPieConfigurationData();
    expect(component.pieWidget.getValue().showCountOnStack).toBe(true);
    expect(component.pieWidget.getValue().datalabelPosition).toBe(component.pieChartOptions.plugins.datalabels.align.toString());

  }));

 it('should push random color in array', async(()=> {
   component.pieChartData[0].data = [10];
   component.getColor();
   // mock data
   expect('#451DEB'.length).toEqual(component.randomColor[0].length);

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
  component.legendClick(legendItem);
  expect(component.filterCriteria.length).toEqual(0);

  // mock data
  const array = [{_datasetIndex:0}];
  component.chartLegend = [{code: 'ZMRO',text: 'ZMRO',legendIndex:0}];
  component.filterCriteria = [];
  const chartData = new PieChartWidget();
  chartData.fieldId = 'MATL_TYPE';
  component.pieWidget = new BehaviorSubject<PieChartWidget>(chartData);
  component.filterCriteria = [];
  component.stackClickFilter(null, array);
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

});
