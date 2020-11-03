import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { DuplicateDatacheckSidesheetComponent } from './duplicate-datacheck-sidesheet.component';

describe('DuplicateDatacheckSidesheetComponent', () => {
  let component: DuplicateDatacheckSidesheetComponent;
  let fixture: ComponentFixture<DuplicateDatacheckSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateDatacheckSidesheetComponent ],
      imports: [
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateDatacheckSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
