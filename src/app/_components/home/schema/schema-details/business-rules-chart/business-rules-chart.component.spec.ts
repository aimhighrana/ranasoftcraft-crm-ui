import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRulesChartComponent } from './business-rules-chart.component';

describe('BusinessRulesChartComponent', () => {
  let component: BusinessRulesChartComponent;
  let fixture: ComponentFixture<BusinessRulesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRulesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRulesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
