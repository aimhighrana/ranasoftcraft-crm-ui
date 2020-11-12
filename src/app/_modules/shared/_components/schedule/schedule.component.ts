import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MonthOn, SchemaSchedulerEnd, SchemaSchedulerRepeat, SchemaSchedulerRepeatMetric, WeekOn } from '@models/schema/schemaScheduler';
import * as moment from 'moment';

@Component({
  selector: 'pros-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  /**
   * Schema id recieved from parent
   */
  @Input() schemaId: string;
  /**
   * Flag to check if form is submitted
   */
  formSubmitted: boolean;
  /**
   * form object
   */
  form: FormGroup;
  /**
   * Looping variable for intervals
   */
  repeatInterval = Object.keys(SchemaSchedulerRepeat);
  /**
   * Looping variable for weekdays
   */
  weekDays = Object.keys(WeekOn).map(item => {
    return {
      value: WeekOn[item],
      text: item
    }
  })
  /**
   * Looping variable for month
   */
  repeatBys = Object.keys(MonthOn).map(item => {
    return {
      value: item,
      text: MonthOn[item],
    }
  });
  /**
   * Looping variable for end
   */
  schedulerEndOptions = Object.keys(SchemaSchedulerEnd);

  constructor() { }

  ngOnInit(): void {
    this.createForm();

    this.form.controls.repeat.valueChanges.subscribe((repeatValue) => {
      this.form.controls.weeklyOn.setValidators(null);
      this.form.controls.monthOn.setValidators(null);
      // console.log("repeatValue", repeatValue);
      switch (repeatValue) {
        case SchemaSchedulerRepeat.HOURLY:
          this.setValue('repeatValue', 12);
          break;
        case SchemaSchedulerRepeat.DAILY:
          this.setValue('repeatValue', 2);
          break;
        case SchemaSchedulerRepeat.WEEKLY:
          this.setValue('repeatValue', 2);
          this.form.controls.weeklyOn.setValidators(Validators.required);
          break;
        case SchemaSchedulerRepeat.MONTHLY:
          this.setValue('repeatValue', 2);
          this.form.controls.monthOn.setValidators(Validators.required);
          break;
        case SchemaSchedulerRepeat.YEARLY:
          this.setValue('repeatValue', 2);
          break;
      }
      this.form.updateValueAndValidity();
      this.form.controls.weeklyOn.updateValueAndValidity();
      this.form.controls.monthOn.updateValueAndValidity();
    });

    this.form.controls.end.valueChanges.subscribe((ends) => {
      this.form.controls.occurrenceVal.setValidators(null);
      this.form.controls.endOn.setValidators(null);
      switch (ends) {
        case SchemaSchedulerEnd.AFTER:
          this.form.controls.occurrenceVal.setValidators(Validators.required);
          break;
        case SchemaSchedulerEnd.ON:
          this.form.controls.endOn.setValidators(Validators.required);
          break;
      }
      this.form.controls.occurrenceVal.updateValueAndValidity();
      this.form.controls.endOn.updateValueAndValidity();
    });
  }

  /**
   * Function to create or initliaze form group for scheduler..
   */
  createForm() {
    this.form = new FormGroup({
      isEnabled: new FormControl(false, [Validators.required]),
      schemaId: new FormControl(this.schemaId, [Validators.required]),
      repeat: new FormControl(SchemaSchedulerRepeat.HOURLY, [Validators.required]),
      repeatValue: new FormControl('2', [Validators.required]),
      weeklyOn: new FormControl(''),
      monthOn: new FormControl(''),
      startOn: new FormControl(moment().utc().valueOf(), [Validators.required]),
      end: new FormControl('', [Validators.required]),
      occurrenceVal: new FormControl(2),
      endOn: new FormControl('',)
    })
  }


  /**
   * Getter fuinction to convert the hours text to metric
   */
  get getMetricHours() {
    return SchemaSchedulerRepeatMetric[this.form.controls.repeat.value]
  }


  /**
   * Common function to recieve value from emitter and set value
   * @param field field
   * @param value value
   */
  setValue(field, value) {
    console.log(field, value);
    this.form.controls[field].setValue(value);
    console.log(this.form.controls[field])
  }


  /**
   * Function to submit form for scheduler..
   */
  submit() {
    this.formSubmitted = true;
    console.log(this.form.value)
  }

  /**
   * Function to get refrence string for scheduler
   */
  get getReferenceString() {
    const startValue = this.form.controls.startOn.value
    const endValue = this.form.controls.end.value;
    const repeatValue = this.form.controls.repeatValue.value;
    const endOn = this.form.controls.endOn.value;
    if (!startValue || !endValue || !repeatValue) {
      return ''
    }
    const startStr = `starting from ${moment(parseInt(startValue, 10)).format('MM/DD/YYYY')} `;
    let endStr;
    if (endValue === SchemaSchedulerEnd.AFTER) {
      endStr = `ending  ${this.form.controls.end.value} ${this.form.controls.occurrenceVal.value} occurrences`
    } else if (endValue === SchemaSchedulerEnd.ON) {
      endStr = `ending ${this.form.controls.end.value} ${moment(parseInt(endOn, 10)).format('MM/DD/YYYY')}`
    } else {
      endStr = 'ending NEVER';
    }
    return `Occurs every ${repeatValue} ${this.getMetricHours ? this.getMetricHours : ''} ${startStr} and ${endStr}`
  }

}
