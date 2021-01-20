import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ScheduleDialogComponent } from './schedule-dialog.component';
import { SchemaScheduler } from '@models/schema/schemaScheduler';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { FormInputComponent } from '../form-input/form-input.component';
import { DatePickerFieldComponent } from '../date-picker-field/date-picker-field.component';

describe('ScheduleDialogComponent', () => {
  let component: ScheduleDialogComponent;
  let fixture: ComponentFixture<ScheduleDialogComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleDialogComponent, FormInputComponent, DatePickerFieldComponent ],
      imports: [
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDialogComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setValue(), should set the form values by key', () => {
    component.createForm();
    component.setValue('isEnable', true);
    expect(component.form.controls.isEnable.value).toBeTrue();
  });

  it('setValueForFormControl(), should set values into form fields', async() => {
    const response = {
      isEnable: false
    } as SchemaScheduler;
    component.createForm();
    component.setValueForFormControl(response);
    expect(component.form.controls.isEnable.value).toEqual(false)
  })

  it('getScheduleInfo(), should call getSchedule service', () => {
    component.schemaId = '12564';
    spyOn(schemaService, 'getSchedule').and.returnValue(of(null));
    component.getScheduleInfo(component.schemaId);
    expect(schemaService.getSchedule).toHaveBeenCalledWith(component.schemaId);
  });
});
