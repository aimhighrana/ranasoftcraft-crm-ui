import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRuleComponent } from './create-rule.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SharedModule } from '@modules/shared/shared.module';

describe('CreateRuleComponent', () => {
  let component: CreateRuleComponent;
  let fixture: ComponentFixture<CreateRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRuleComponent, FormInputComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
