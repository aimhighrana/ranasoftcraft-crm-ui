import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { BrClassificationSidesheetComponent } from './br-classification-sidesheet.component';

describe('BrClassificationSidesheetComponent', () => {
  let component: BrClassificationSidesheetComponent;
  let fixture: ComponentFixture<BrClassificationSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrClassificationSidesheetComponent ],
      imports: [ AppMaterialModuleForSpec, SharedModule ]
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
