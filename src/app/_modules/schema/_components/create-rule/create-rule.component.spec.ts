import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRuleComponent } from './create-rule.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';

describe('CreateRuleComponent', () => {
  let component: CreateRuleComponent;
  let fixture: ComponentFixture<CreateRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRuleComponent, FormInputComponent ],
      imports: [AppMaterialModuleForSpec]
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
