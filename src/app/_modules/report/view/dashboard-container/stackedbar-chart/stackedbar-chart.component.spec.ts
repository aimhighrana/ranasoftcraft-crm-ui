import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedbarChartComponent } from './stackedbar-chart.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StackBarChartWidget, Criteria } from '../../../_models/widget';
import { BehaviorSubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

describe('StackedbarChartComponent', () => {
  let component: StackedbarChartComponent;
  let fixture: ComponentFixture<StackedbarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedbarChartComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule]
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

});
