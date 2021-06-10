import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReportService } from '@modules/report/_service/report.service';
import { Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'pros-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FormCheckboxComponent implements OnInit {

  constructor(private reportService: ReportService) { }


  /**
   * Define an indiviual form control
   */
  @Input() control: FormControl;

  /**
   * Getting placeholder from parent
   */
  @Input() placeholder: string;

  @Input() isTableFilter: boolean = false;

  /**
   * To emit value change of input to parent
   */
  @Output() valueChange = new EventEmitter<Object>();

  @Input() value: string;

  @Input() formFieldId: string;

  @Input() label : string;

  subscription: Subscription[] = [];


  /**
   * ANGULAR HOOK
   *
   */
  ngOnInit(): void {
    if (!this.control) {
      this.control = new FormControl();
    }
  }

  /**
 * ANGULAR HOOK
 * To detect the changes from parent and update value
 * @param  changes: object contains prev and current value
 */

  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * apply filter and emit the output event
   */
  applyFilter() {
    const response = {
      formFieldId: this.formFieldId,
      value: this.control.value
    }
    this.valueChange.emit(response);
  }


  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    })
  }

}
