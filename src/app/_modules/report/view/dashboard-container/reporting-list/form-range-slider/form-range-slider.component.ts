import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'pros-form-range-slider',
  templateUrl: './form-range-slider.component.html',
  styleUrls: ['./form-range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FormRangeSliderComponent implements OnInit, OnChanges {

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

  /**
   * that holds the pre selected values of range slider
   */
  @Input() preSelectedValue: any;
  minValue: number;
  maxValue: number;
  highValue = 59;
  subscription: Subscription[] = [];
  fltrCtrl: FormControl = new FormControl();
  regex = '[0-9]{1,}-[0-9]{1,}';
  appliedValueCtrl: FormControl = new FormControl();
  /**
   * that holds info that whether apply button is clicked or not
   */
  isBtnClicked: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * ANGULAR HOOK
   *
   */

  ngOnInit(): void {
    if(!this.control) {
      this.control = new FormControl();
    }
    if (this.control.value) {
      this.fltrCtrl.setValue(this.getSelectedRangeValue());
      this.maxValue = this.control.value.max;
      this.minValue = this.control.value.min;
    }
    this.fltrCtrl.setValidators(Validators.pattern(this.regex));
    this.fltrCtrl.updateValueAndValidity();

    this.fltrCtrl.valueChanges.subscribe(res => {
      if (this.fltrCtrl.valid && res) {
        const values = res.split('-');
        this.minValue = values[0];
        this.maxValue = values[1];
        this.control.setValue({ min: +this.minValue, max: +this.maxValue });
      } else {
        this.control.setValue(null);
      }
    })

    this.isBtnClicked.subscribe(res => {
      if (res) {
        this.appliedValueCtrl.setValue(`${this.minValue} - ${this.maxValue}`);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.control && changes.control.previousValue !== changes.control.currentValue && !changes.control.currentValue.value) {
      this.minValue = 10;
      this.maxValue = 30;
    }

    if (changes.preSelectedValue && changes.preSelectedValue.previousValue !== changes.preSelectedValue.currentValue) {
      if (!changes.preSelectedValue.currentValue) {
        this.appliedValueCtrl.setValue(null);
      }
      else {
        if(!changes.preSelectedValue.previousValue || (changes.preSelectedValue.previousValue.min !== changes.preSelectedValue.currentValue.min || changes.preSelectedValue.previousValue.max !== changes.preSelectedValue.currentValue.max)) {
          this.preSelectedValue = changes.preSelectedValue.currentValue;
          this.appliedValueCtrl.setValue(`${this.preSelectedValue.min}-${this.preSelectedValue.max}`);
        }
      }
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
      this.isBtnClicked.next(true);
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
        return min + '-' + max;
    }
    else return '';
  }

  /**
   * check whether the input is valid or not
   * @returns whether the input value is valid
   */
  isInValidInput() {
    if (this.fltrCtrl.hasError('pattern')) {
      return true;
    } else if (+this.minValue > +this.maxValue) {
      return true;
    } else {
      return false;
    }
  }
}
