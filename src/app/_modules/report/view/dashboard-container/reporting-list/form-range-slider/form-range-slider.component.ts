import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReportService } from '@modules/report/_service/report.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-form-range-slider',
  templateUrl: './form-range-slider.component.html',
  styleUrls: ['./form-range-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FormRangeSliderComponent implements OnInit {

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
  @Output() valueChange = new EventEmitter<Object>();


  @Input() formFieldId: string;

  @Input() maxValue: string;
  @Input() minValue: string;

  highValue: number = 59;
  subscription: Subscription[] = [];
  fltrCtrl: FormControl = new FormControl();
  regex = '[0-9]{1,}-[0-9]{1,}'
  /**
   * ANGULAR HOOK
   *
   */
  ngOnInit(): void {
    if (!this.control) {
      this.control = new FormControl({ min: this.minValue, max: this.maxValue });
    }
    this.control.setValidators(Validators.pattern(this.regex));
    if (!this.maxValue) {
      this.maxValue = '30';
    }

    if (!this.minValue) {
      this.minValue = '0';
    }
    this.fltrCtrl.valueChanges.subscribe(res => {
      const values = res.split('-');
      this.minValue = values[0];
      this.maxValue = values[1];
      this.control.setValue({ min: this.minValue, max: this.maxValue });
    })
  }


  /**
   * method called on apply button emits the value change event on parent class
   */
  applyFilter() {
    if (this.control.valid && this.minValue < this.maxValue) {
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
}
