import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { QualityRulesComponent } from './quality-rules.component';

describe('QualityRulesComponent', () => {
  let component: QualityRulesComponent;
  let fixture: ComponentFixture<QualityRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityRulesComponent ],
      imports: [ AppMaterialModuleForSpec, MdoUiLibraryModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
