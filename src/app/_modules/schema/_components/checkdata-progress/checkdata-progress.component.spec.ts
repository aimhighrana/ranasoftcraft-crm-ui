import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { CheckdataProgressComponent } from './checkdata-progress.component';

describe('CheckdataProgressComponent', () => {
  let component: CheckdataProgressComponent;
  let fixture: ComponentFixture<CheckdataProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckdataProgressComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckdataProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
