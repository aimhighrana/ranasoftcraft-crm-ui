import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContainerComponent } from './dashboard-container.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Criteria } from '../../_models/widget';

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardContainerComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeFilterCriteria(), should update criteria',async(()=>{
    const filterCritera = [];
    component.filterCriteria = filterCritera;
    component.changeFilterCriteria(filterCritera);
    expect(filterCritera).toEqual(component.filterCriteria);

    const critera = new Criteria();
    critera.conditionFieldId = 'MATL_TYPE';
    critera.conditionFieldValue = 'ZMRO';
    filterCritera.push(critera);

    component.filterCriteria = filterCritera;
    component.changeFilterCriteria(filterCritera);
    expect(filterCritera).toEqual(component.filterCriteria);

    critera.conditionFieldValue = 'HERS';
    component.changeFilterCriteria([critera]);
    expect(critera.conditionFieldValue).toEqual(component.filterCriteria[0].conditionFieldValue);
  }));

  it('onResize(), on resize ', async(()=>{
    component.onResize(null);
    const event = {target:{innerWidth:2000}};
    component.onResize(event);
    expect(component.screenWidth).toEqual(2000);
  }));

  it('click(), should call click', async(() => {
    const data = 'test';
    component.click(data);
    expect(component.click).toBeTruthy();
  }));

  it('ngOnChanges(), should call reset when reset dashboard', async(() => {
    const chnages:import('@angular/core').SimpleChanges = {hasFilterCriteria:{currentValue:true, previousValue: false, firstChange:null, isFirstChange:null}};
    component.emitClearBtnEvent = false;
    component.filterCriteria = [{fieldId:'test'} as Criteria,{fieldId:'test1'} as Criteria];
    component.ngOnChanges(chnages);
    expect(component.filterCriteria.length).toEqual(0);

    const chnages2:import('@angular/core').SimpleChanges = {hasFilterCriteria:{currentValue:true, previousValue: false, firstChange:null, isFirstChange:null}};
    component.ngOnChanges(chnages2);
    expect(component.filterCriteria.length).toEqual(0);
  }));
});
