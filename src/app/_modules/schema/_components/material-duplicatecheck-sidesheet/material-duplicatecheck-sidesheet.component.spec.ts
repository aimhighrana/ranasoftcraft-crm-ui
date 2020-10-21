import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDuplicatecheckSidesheetComponent } from './material-duplicatecheck-sidesheet.component';

describe('MaterialDuplicatecheckSidesheetComponent', () => {
  let component: MaterialDuplicatecheckSidesheetComponent;
  let fixture: ComponentFixture<MaterialDuplicatecheckSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDuplicatecheckSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDuplicatecheckSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
