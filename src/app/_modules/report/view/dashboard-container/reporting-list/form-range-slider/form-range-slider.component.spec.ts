import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRangeSliderComponent } from './form-range-slider.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormControl, Validators } from '@angular/forms';

describe('FormInputComponent', () => {
  let component: FormRangeSliderComponent;
  let fixture: ComponentFixture<FormRangeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRangeSliderComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
