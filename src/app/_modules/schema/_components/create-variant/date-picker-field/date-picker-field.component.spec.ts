import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerFieldComponent } from './date-picker-field.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('DatePickerFieldComponent', () => {
  let component: DatePickerFieldComponent;
  let fixture: ComponentFixture<DatePickerFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePickerFieldComponent ],
      imports:[
        AppMaterialModuleForSpec
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeStartDate(), change start date',async(()=>{
    const event = {value: new Date()} as MatDatepickerInputEvent<Date>;
    component.changeStartDate({} as MatDatepickerInputEvent<Date>);
    expect(component.startDate).toEqual(undefined);
    component.changeStartDate(event);
    const expected = Number(component.startDate);
    expect(event.value.getTime()).toEqual(expected);
  }));

  it('changeEndtDate(), change end date',async(()=>{
    const event = {value: new Date()} as MatDatepickerInputEvent<Date>;
    component.changeEndtDate({} as MatDatepickerInputEvent<Date>);
    expect(component.startDate).toEqual(undefined);
    component.changeEndtDate(event);
    const expected = Number(component.endDate);
    expect(event.value.getTime()).toEqual(expected);
  }));

  it('ngOnInit(), load pre required', async(() => {
    component.selectedStrtFld = '1596393000000';
    component.selectedEndFld = '1596393000000';
    component.preSelectedFld = '1596393000000';
    component.ngOnInit();
    const res = new Date(1596393000000);
    expect(component.conditionFieldEndValue.value).toEqual(res);
  }));
});