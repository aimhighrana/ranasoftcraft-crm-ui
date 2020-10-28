import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrClassificationSidesheetComponent } from './br-classification-sidesheet.component';

describe('BrClassificationSidesheetComponent', () => {
  let component: BrClassificationSidesheetComponent;
  let fixture: ComponentFixture<BrClassificationSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrClassificationSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrClassificationSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
