import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusionsSidesheetComponent } from './exclusions-sidesheet.component';

describe('ExclusionsSidesheetComponent', () => {
  let component: ExclusionsSidesheetComponent;
  let fixture: ComponentFixture<ExclusionsSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusionsSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusionsSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
