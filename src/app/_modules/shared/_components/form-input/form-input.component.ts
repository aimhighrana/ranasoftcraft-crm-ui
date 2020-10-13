import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pros-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInputComponent implements OnInit, OnChanges {

  constructor() { }

  /**
   * Define an indiviual form control
   */
  control: FormControl;

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
   * To get input type from parent
   */
  @Input() type: string;

  @Input() isHelpIcon: boolean;

  /**
   * To get hint below the input field from parent
   */
  @Input() hint: string;

  /**
   * To get maximum length of input
   */
  @Input() maxLength: number;

  /**
   * To emit value change of input to parent
   */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Flag to get value of disabled and set readonly value
   */
  @Input() set disabled(value) {
    this.readonly = value ? true : false;
  }

  readonly = false;

  /**
   * ANGULAR HOOK
   *
   */
  ngOnInit(): void {
    this.control = new FormControl();
    if (this.value !== undefined) {
      this.control.setValue(this.value);
    }
    this.control.valueChanges.subscribe(
      (data) => {
        this.valueChange.emit(data);
      }
    );
  }


  /**
   * ANGULAR HOOK
   * To detect the changes from parent and update value
   * @param  changes: object contains prev and current value
   */

  ngOnChanges(changes: SimpleChanges) {
    if (!changes || !changes.value) return;
    if (changes.value.previousValue !== undefined && (changes.value.previousValue !== changes.value.currentValue)) {
      this.value = changes.value.currentValue;
    }
  }
}
