import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaSchedulerRepeat } from '@models/schema/schemaScheduler';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { DatePickerFieldComponent } from '../date-picker-field/date-picker-field.component';
import { FormInputComponent } from '../form-input/form-input.component';

import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleComponent, FormInputComponent, DatePickerFieldComponent ],
      imports: [
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update validation based on the interval', async () => {

    component.form.controls.schemaSchedulerRepeat.setValue(SchemaSchedulerRepeat.MONTHLY);

    expect(component.form.controls.repeatValue.value).toEqual(2);
    expect(component.form.controls.monthOn.errors).not.toBe(null)
    expect(component.form.controls.monthOn.errors.required).toBe(true)

    component.form.controls.schemaSchedulerRepeat.setValue(SchemaSchedulerRepeat.WEEKLY);
    expect(component.form.controls.repeatValue.value).toEqual(2);
    expect(component.form.controls.weeklyOn.errors).not.toBe(null)
    expect(component.form.controls.weeklyOn.errors.required).toBe(true)

    component.form.controls.schemaSchedulerRepeat.setValue(SchemaSchedulerRepeat.HOURLY);
    expect(component.form.controls.repeatValue.value).toEqual(12);


    component.form.controls.schemaSchedulerRepeat.setValue(SchemaSchedulerRepeat.DAILY);
    expect(component.form.controls.repeatValue.value).toEqual(2);

    component.form.controls.schemaSchedulerRepeat.setValue(SchemaSchedulerRepeat.YEARLY);
    expect(component.form.controls.repeatValue.value).toEqual(2);
  });

});
