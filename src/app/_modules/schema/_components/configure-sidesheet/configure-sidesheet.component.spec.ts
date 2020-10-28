import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSidesheetComponent } from './configure-sidesheet.component';

describe('ConfigureSidesheetComponent', () => {
  let component: ConfigureSidesheetComponent;
  let fixture: ComponentFixture<ConfigureSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
