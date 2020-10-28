import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrDuplicatecheckSidesheetComponent } from './br-duplicatecheck-sidesheet.component';

describe('BrDuplicatecheckSidesheetComponent', () => {
  let component: BrDuplicatecheckSidesheetComponent;
  let fixture: ComponentFixture<BrDuplicatecheckSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrDuplicatecheckSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrDuplicatecheckSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
