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
    component.legendClick({text: 'ZMRO'} as ChartLegendLabelItem);
  }));

  it('removeOldFilterCriteria(), remove olf filter criteria ', async(()=>{
    const filter: Criteria = new Criteria();
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    component.removeOldFilterCriteria([filter]);
    expect(component.filterCriteria.length).toEqual(0);
  }));

  it('emitEvtFilterCriteria(), should emit the filter criteria', async(()=>{
    component.emitEvtFilterCriteria([]);
  }));
});
