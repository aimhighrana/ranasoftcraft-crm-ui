import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaService } from '@services/home/schema.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { DatePickerFieldComponent } from '../date-picker-field/date-picker-field.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { of } from 'rxjs';

import { ScheduleComponent } from './schedule.component';
import { Router } from '@angular/router';
import { SchemaScheduler, SchemaSchedulerEnd, SchemaSchedulerRepeat, SchemaSchedulerRepeatMetric } from '@models/schema/schemaScheduler';
import { TitleCasePipe } from '@angular/common';
import { MdoUiLibraryModule, TransientService } from 'mdo-ui-library';

const isRequired = (control: AbstractControl) => {
  const validator = control.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
    return false;
}

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let schemaService: SchemaService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleComponent, FormInputComponent, DatePickerFieldComponent ],
      imports: [
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MdoUiLibraryModule
      ],
      providers: [TransientService, TitleCasePipe, SchemaService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getScheduleInfo(), should call getSchedule service empty resp', () => {
    component.schemaId = '12564';
    spyOn(schemaService, 'getSchedule').and.returnValue(of(null));
    component.getScheduleInfo(component.schemaId);
    expect(schemaService.getSchedule).toHaveBeenCalledWith(component.schemaId);
  });

  it('getScheduleInfo(), should call getSchedule service', () => {
    component.schemaId = '12564';
    spyOn(component, 'setValueForFormControl');
    spyOn(schemaService, 'getSchedule').and.returnValue(of({schedulerId: 1701} as SchemaScheduler));
    component.getScheduleInfo(component.schemaId);
    expect(schemaService.getSchedule).toHaveBeenCalledWith(component.schemaId);
  });

  it('setValue(), should set the form values by key', () => {
    component.createForm();
    component.setValue('isEnable', true);
    expect(component.form.controls.isEnable.value).toBeTrue();
  });

  it('close(), should close schedule side sheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }], {queryParamsHandling: 'preserve'})
  })

  it('setValueForFormControl(), should set values into form fields', async() => {
    component.scheduleInfo = {
      isEnable: false
    } as SchemaScheduler;
    component.createForm();
    component.setValueForFormControl();
    expect(component.form.controls.isEnable.value).toEqual(false)
  })

  it(`To get FormControl from fromGroup `, async(() => {
    component.createForm()
    const field=component.formField('repeatValue');
    expect(field).toBeDefined();
   }));

   it('should getMetricHours', () => {
    component.createForm();
    expect(component.getMetricHours).toEqual(SchemaSchedulerRepeatMetric.HOURLY);
    component.setValue('schemaSchedulerRepeat', SchemaSchedulerRepeat.DAILY);
    expect(component.getMetricHours).toEqual(SchemaSchedulerRepeatMetric.DAILY)
  });

  it('should submit scheduler form', () => {

    spyOn(schemaService, 'createUpdateSchedule').and.returnValue(of(1));
    component.createForm();
    component.submit();

    component.setValue('end', SchemaSchedulerEnd.AFTER);
    component.submit();
    expect(component.formSubmitted).toEqual(true);
  });

  it('get getReferenceString', () => {
    component.createForm();
    expect(component.getReferenceString).toEqual('');

    component.setValue('end', SchemaSchedulerEnd.AFTER);
    expect(component.getReferenceString).toContain('occurrences');

    component.setValue('end', SchemaSchedulerEnd.ON);
    expect(component.getReferenceString).toContain('ending');

    component.setValue('end', SchemaSchedulerEnd.NEVER);
    expect(component.getReferenceString).toContain('Occurs every');

  });

  it('should init component', () => {

    component.ngOnInit();
    component.setValue('schemaSchedulerRepeat', SchemaSchedulerRepeat.DAILY);
    component.setValue('schemaSchedulerRepeat', SchemaSchedulerRepeat.WEEKLY);
    component.setValue('schemaSchedulerRepeat', SchemaSchedulerRepeat.MONTHLY);
    component.setValue('schemaSchedulerRepeat', SchemaSchedulerRepeat.YEARLY);
    expect(component.form.value.repeatValue).toEqual(2);

    component.setValue('end', SchemaSchedulerEnd.AFTER);
    expect(isRequired(component.form.controls.occurrenceVal)).toBeTrue();

    component.setValue('end', SchemaSchedulerEnd.ON);
    expect(isRequired(component.form.controls.endOn)).toBeTrue();

  });

});
