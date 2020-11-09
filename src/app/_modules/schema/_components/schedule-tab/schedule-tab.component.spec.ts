// import { HttpClientModule } from '@angular/common/http';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { RouterTestingModule } from '@angular/router/testing';
// import { SchemaSchedulerRepeat } from '@models/schema/schemaScheduler';
// import { SchemaService } from '@services/home/schema.service';
// import { SchemalistService } from '@services/home/schema/schemalist.service';
// import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
// import { DatePickerFieldComponent } from '../create-variant/date-picker-field/date-picker-field.component';

// import { ScheduleTabComponent } from './schedule-tab.component';

// describe('ScheduleTabComponent', () => {
//   let component: ScheduleTabComponent;
//   let fixture: ComponentFixture<ScheduleTabComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ScheduleTabComponent, DatePickerFieldComponent],
//       imports: [
//         HttpClientModule,
//         AppMaterialModuleForSpec,
//         RouterTestingModule,
//         FormsModule,
//         ReactiveFormsModule
//       ],
//       providers: [SchemaService, SchemalistService, MatSnackBar]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScheduleTabComponent);
//     component = fixture.componentInstance;
//     component.schemaId = '12345678';
//     component.ngOnInit();
//   });

//   it('should create', async () => {
//     expect(component).toBeTruthy();
//     expect(component.form).not.toBe(null)
//   });

//   it('should update validation based on the interval', async () => {

//     component.form.controls.repeat.setValue(SchemaSchedulerRepeat.MONTHLY);

//     expect(component.form.controls.repeatValue.value).toEqual(2);
//     expect(component.form.controls.monthOn.errors).not.toBe(null)
//     expect(component.form.controls.monthOn.errors.required).toBe(true)

//     component.form.controls.repeat.setValue(SchemaSchedulerRepeat.WEEKLY);
//     expect(component.form.controls.repeatValue.value).toEqual(2);
//     expect(component.form.controls.weeklyOn.errors).not.toBe(null)
//     expect(component.form.controls.weeklyOn.errors.required).toBe(true)

//     component.form.controls.repeat.setValue(SchemaSchedulerRepeat.HOURLY);
//     expect(component.form.controls.repeatValue.value).toEqual(12);


//     component.form.controls.repeat.setValue(SchemaSchedulerRepeat.DAILY);
//     expect(component.form.controls.repeatValue.value).toEqual(2);

//     component.form.controls.repeat.setValue(SchemaSchedulerRepeat.YEARLY);
//     expect(component.form.controls.repeatValue.value).toEqual(2);
//   });

// //   it('should update end value on basis of end', async () => {
// //     component.form.controls.end.setValue(SchemaSchedulerEnd.AFTER);
// //     expect(component.form.controls.occurrenceVal.errors).not.toBe(null);
// //     expect(component.form.controls.occurrenceVal.errors.required).toBe(true);
// //     component.form.controls.end.setValue(SchemaSchedulerEnd.ON);
// //     expect(component.form.controls.endOn.errors).not.toBe(null);
// //     expect(component.form.controls.endOn.errors.required).toBe(true);
// //   });

//   it('should return metric', async () => {
//     component.form.controls.repeat.setValue('HOURLY')
//     expect(component.getMetricHours).toBe('Hours')
//   });

//   it('should submit', async () => {
//     component.submit();
//     expect(component.formSubmitted).toEqual(true)
//   });

//   it('should throw error', async () => {
//     component.schemaId = null;
//     expect(() => { component.ngOnInit() }).toThrow(new Error('Schema id is required'))
//   })
// });
