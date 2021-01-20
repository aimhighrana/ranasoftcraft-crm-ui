import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { BusinessCaseRuleComponent } from './business-case-rule.component';

describe('BusinessCaseRuleComponent', () => {
  let component: BusinessCaseRuleComponent;
  let fixture: ComponentFixture<BusinessCaseRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCaseRuleComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCaseRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
