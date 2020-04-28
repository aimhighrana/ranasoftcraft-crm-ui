import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BarChartWidget } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('getFieldsMetadaDesc(), Fields MetadaDesc axis1 ', async(()=>{
    const code: string[] = [];
    const  fieldId = '';
     component.getFieldsMetadaDesc(code,fieldId);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stackClickFilter(), should filter , after click on bar stack',async(()=>{
    component.stackClickFilter();
    const array = [{_datasetIndex:0}];
    component.chartLegend = [{code: 'ZMRO',text: 'ZMRO',legendIndex:0}];
    component.filterCriteria = [];
    const chartData = new BarChartWidget();
    chartData.fieldId = 'MATL_TYPE';
    component.barWidget = new BehaviorSubject<BarChartWidget>(chartData);
    component.filterCriteria = [];
    component.stackClickFilter(null, array);
  }));

});
