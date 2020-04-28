import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedbarChartComponent } from './stackedbar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartLegendLabelItem } from 'chart.js';
import { StackBarChartWidget, Criteria } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';

describe('StackedbarChartComponent', () => {
  let component: StackedbarChartComponent;
  let fixture: ComponentFixture<StackedbarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedbarChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedbarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('legendClick(), click on legend', async(()=>{
    component.stackBarWidget = new BehaviorSubject<StackBarChartWidget>(new StackBarChartWidget());
    component.filterCriteria = [];
    component.stackbarLegend=[{code:'ZMRO',legendIndex:1,text:''}];
    component.legendClick({datasetIndex:1} as ChartLegendLabelItem);
  }));

  it('removeOldFilterCriteria(), remove olf filter criteria ', async(()=>{
    const filter: Criteria = new Criteria();
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    component.removeOldFilterCriteria([filter]);
    expect(component.filterCriteria.length).toEqual(0);
  }));

  it('updateLabelsaxis1(), update labels ', async(()=>{
    component.updateLabelsaxis1();
}));

it('getFieldsMetadaDescaxis1(), Fields MetadaDesc axis1 ', async(()=>{
    const code: string[] = ['HAWA','ZMRO'];
    const  fieldId = 'MATL_TYPE';
     component.getFieldsMetadaDescaxis1(code,fieldId);
}));

it('updateLabelsaxis2(), update labels ', async(()=>{
  component.listxAxis2.push('ZMRO','HAWA');
  component.updateLabelsaxis2();
}));

it('getFieldsMetadaDescaxis2(), Fields MetadaDesc axis2 ', async(()=>{
  const code: string[] = [];
  const  fieldId = '';
   component.getFieldsMetadaDescaxis2(code,fieldId);
}));

it('getRandomColor(), Random Colour', async(()=>{
    component.getRandomColor();
    expect(component.getRandomColor());
}));

it('getstackbarChartData(), Stackbar Data',async(()=>{
    component.getstackbarChartData(123,[]);
}));

  it('emitEvtFilterCriteria(), should emit the filter criteria', async(()=>{
    component.emitEvtFilterCriteria([]);
  }));

  it('stackClickFilter(), should filter , after click on bar stack',async(()=>{
    component.stackClickFilter();
    const array = [{_datasetIndex:0,_index:0}];
    component.stackClickFilter(null, array);

    component.stackbarLegend = [{code: 'ZMRO',text: 'ZMRO',legendIndex:0}];
    component.stachbarAxis = [{code: '10001',text: 'Mat 001 ',legendIndex:0}];
    component.filterCriteria = [];
    const chartWidget = new StackBarChartWidget();
    chartWidget.fieldId = 'MATL_TYPE';
    chartWidget.groupById = 'MATL_GROUP';
    component.stackBarWidget = new BehaviorSubject<StackBarChartWidget>(chartWidget);
    component.stackClickFilter(null, array);
  }));

});
