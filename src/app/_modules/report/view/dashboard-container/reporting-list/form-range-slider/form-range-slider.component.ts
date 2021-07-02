import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-form-range-slider',
  templateUrl: './form-range-slider.component.html',
  styleUrls: ['./form-range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FormRangeSliderComponent implements OnInit,OnChanges {

  constructor() { }


  /**
   * Define an indiviual form control
   */
  @Input() control: FormControl;

  /**
   * Getting placeholder from parent
   */
  @Input() placeholder: string;

  /**
   * Getting value from parent
   */
  @Input() value: string;

  /**
   * Getting label from parent
   */
  @Input() label: string;

  /**
   * To emit value change of radio to parent
   */
  @Output() valueChange = new EventEmitter<object>();


  @Input() formFieldId: string;

  @Input() maxValue: string;
  @Input() minValue: string;

  highValue = 59;
  subscription: Subscription[] = [];
  fltrCtrl: FormControl = new FormControl();
  regex = '[0-9]{1,}-[0-9]{1,}'
  /**
   * ANGULAR HOOK
   *
   */

  ngOnInit(): void {
    if (!this.control) {
      this.control = new FormControl({ min: +this.minValue, max: +this.maxValue });
    }
    if(this.minValue && this.maxValue) {
      this.fltrCtrl.setValue(this.getSelectedRangeValue());
    }
    this.fltrCtrl.setValidators(Validators.pattern(this.regex));
    this.fltrCtrl.updateValueAndValidity();
    if (!this.maxValue) {
      this.maxValue = '30';
    }

    if (!this.minValue) {
      this.minValue = '0';
    }
    this.fltrCtrl.valueChanges.subscribe(res => {
      if (this.fltrCtrl.valid) {
        const values = res.split('-');
        this.minValue = values[0];
        this.maxValue = values[1];
        this.control.setValue({ min: +this.minValue, max: +this.maxValue });
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.minValue && changes.minValue.previousValue !== changes.minValue.currentValue) {
      this.minValue = changes.minValue.currentValue;
    }
    if (changes.maxValue && changes.maxValue.previousValue !== changes.maxValue.currentValue) {
      this.maxValue = changes.maxValue.currentValue;
    }
  }

  /**
   * method called on apply button emits the value change event on parent class
   */
  applyFilter() {
    if (this.fltrCtrl.valid && +this.minValue < +this.maxValue) {
      if (!this.control.value && (this.minValue && this.maxValue)) {
        this.control.setValue({ min: this.minValue, max: this.maxValue });
      }
      const response = {
        formFieldId: this.formFieldId,
        value: this.control.value
      }
      this.valueChange.emit(response);
    }
  }


  /**
   *
   * @returns selected value of the range slider
   */
  getSelectedRangeValue(): string {
    if (this.control.value) {
      const min = this.control.value.min;
      const max = this.control.value.max;
      if (min && max) {
        return min + '-' + max;
      } else {
        return min ? min : max ? max : ''
      }
    }
    else return '';
  }

  /**
   * check whether the input is valid or not
   * @returns whether the input value is valid
   */
  isInValidInput() {
    if(this.fltrCtrl.hasError('pattern')) {
      return true;
    } else if(+this.minValue > +this.maxValue) {
      return true;
    } else {
      return false;
    }
  }
}
