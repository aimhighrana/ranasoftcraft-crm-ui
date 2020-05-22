import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BarChartWidget } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts';
import { PositionType, AlignPosition, AnchorAlignPosition } from '../../../_models/widget';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;
  let htmlnative: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule]
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
    test.orientation = 'bar';
    test.legendPosition = PositionType.TOP;
    component.barWidget.next(test);
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().orientation).toBe(component.orientation);
  }));

  it('should have true value for showLegend flag then set legend position', async ( () => {
    const test = new BarChartWidget();
    test.showLegend = true;
    test.legendPosition = PositionType.TOP;
    component.barWidget.next(test);
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().showLegend).toBe(component.barChartOptions.legend.display);
    expect(component.barWidget.getValue().legendPosition).toBe(component.barChartOptions.legend.position);
  }));

  it('should have true value for showCountOnStack flag then set align and anchor position', async ( () => {
    const test = new BarChartWidget();
    test.showCountOnStack = true;
    test.datalabelPosition = AlignPosition.CENTER;
    test.anchorPosition = AnchorAlignPosition.CENTER
    component.barWidget.next(test);
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().showCountOnStack).toBe(true);
    expect(component.barWidget.getValue().datalabelPosition).toBe(component.barChartOptions.plugins.datalabels.align.toString());
    expect(component.barWidget.getValue().anchorPosition).toBe(component.barChartOptions.plugins.datalabels.anchor.toString());
  }));

  it('should have true value for displayAxisLable flag then set xAxisLabel, yAxisLabel', async (() => {
    const test = new BarChartWidget();
    test.displayAxisLabel = true;
    test.xAxisLabel = 'X-Axis';
    test.yAxisLabel = 'Y-Axis';
    component.barWidget.next(test);
    component.getBarConfigurationData();
    expect(component.barWidget.getValue().displayAxisLabel).toBe(true);
    expect(component.barWidget.getValue().xAxisLabel).toBe(component.barChartOptions.scales.xAxes[0].scaleLabel.labelString);
    expect(component.barWidget.getValue().yAxisLabel).toBe(component.barChartOptions.scales.yAxes[0].scaleLabel.labelString);
  }));

});
