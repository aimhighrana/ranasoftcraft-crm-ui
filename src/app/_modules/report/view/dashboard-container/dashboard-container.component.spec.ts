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
  }));
});
