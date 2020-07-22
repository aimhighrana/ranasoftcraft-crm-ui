import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'pros-date-picker-field',
  templateUrl: './date-picker-field.component.html',
  styleUrls: ['./date-picker-field.component.scss']
})
export class DatePickerFieldComponent implements OnInit {

  @Input()
  showRangeFld: boolean;

  @Input()
  selectedStrtFld: string;

  @Input()
  selectedEndFld: string;

  @Input()
  preSelectedFld: string;

  @Output()
  strtValueSelected: EventEmitter<string> = new EventEmitter();

  @Output()
  endValueSelected: EventEmitter<string> = new EventEmitter();

  startDate: string;
  endDate: string;

  conditionFieldStartValue: FormControl;
  conditionFieldEndValue: FormControl;
  conditionFieldValue: FormControl;
  today = new Date();

  constructor( ) {
    this.conditionFieldStartValue = new FormControl();
    this.conditionFieldEndValue = new FormControl();
    this.conditionFieldValue = new FormControl();
   }

  ngOnInit(): void {
    this.conditionFieldStartValue.disable({onlySelf:true,emitEvent:true})
    this.conditionFieldEndValue.disable({onlySelf:true,emitEvent:true})
    this.conditionFieldValue.disable({onlySelf:true,emitEvent:true})

    if(this.selectedStrtFld) {
      const fld =  Number(this.selectedStrtFld);
      this.conditionFieldStartValue.setValue(new Date(fld));
    }

    if(this.selectedEndFld) {
      const fld =  Number(this.selectedEndFld);
      this.conditionFieldEndValue.setValue(new Date(fld));
    }

    if(this.preSelectedFld) {
      const fld =  Number(this.preSelectedFld);
      this.conditionFieldValue.setValue(new Date(fld));
    }
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value && event.value.getTime()) {
      this.startDate = String(event.value.getTime());
      this.strtValueSelected.emit(this.startDate);
    }
  }

  changeEndtDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value && event.value.getTime()) {
      this.endDate = String(event.value.getTime());
      this.endValueSelected.emit(this.endDate);
    }
  }
}
