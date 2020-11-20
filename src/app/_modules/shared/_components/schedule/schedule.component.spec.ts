import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaService } from '@services/home/schema.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { DatePickerFieldComponent } from '../date-picker-field/date-picker-field.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { of } from 'rxjs';

import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleComponent, FormInputComponent, DatePickerFieldComponent ],
      imports: [
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [SchemaService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getScheduleInfo(), should call getSchedule service', () => {
    spyOn(schemaService, 'getSchedule').and.returnValue(of(null));
    component.getScheduleInfo('test');
    expect(schemaService.getSchedule).toHaveBeenCalled();
  });

  it('setValue(), should set the form values by key', () => {
    component.createForm();
    component.setValue('isEnable', true);
    expect(component.form.controls.isEnable.value).toBeTrue();
  });
});
