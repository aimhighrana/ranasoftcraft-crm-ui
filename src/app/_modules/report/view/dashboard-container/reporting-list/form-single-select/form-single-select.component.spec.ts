import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSingleSelectComponent } from './form-single-select.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormControl, Validators } from '@angular/forms';

describe('FormInputComponent', () => {
  let component: FormSingleSelectComponent;
  let fixture: ComponentFixture<FormSingleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSingleSelectComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
