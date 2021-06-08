import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRadioButtonGroupComponent } from './form-radio-button-group.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormControl, Validators } from '@angular/forms';

describe('FormInputComponent', () => {
  let component: FormRadioButtonGroupComponent;
  let fixture: ComponentFixture<FormRadioButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRadioButtonGroupComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRadioButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
