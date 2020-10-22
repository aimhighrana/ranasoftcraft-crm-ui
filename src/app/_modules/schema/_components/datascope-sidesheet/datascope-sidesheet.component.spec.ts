import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatascopeSidesheetComponent } from './datascope-sidesheet.component';

describe('DatascopeSidesheetComponent', () => {
  let component: DatascopeSidesheetComponent;
  let fixture: ComponentFixture<DatascopeSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatascopeSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatascopeSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
