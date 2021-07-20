import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Criteria } from '@modules/report/_models/widget';
import { ReportService } from '@modules/report/_service/report.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'pros-form-radio-button-group',
  templateUrl: './form-radio-button-group.component.html',
  styleUrls: ['./form-radio-button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FormRadioButtonGroupComponent implements OnInit {

  constructor(private reportService: ReportService) { }


  /**
   * Define an indiviual form control
   */
  @Input() control: FormControl;

  /**
   * Getting placeholder from parent
   */
  @Input() placeholder: string;

  @Input() filterCriteria: Criteria[] = [];

  @Input() displayCriteria: string;

  @Input() isTableFilter: string;
  /**
   * To emit value change of input to parent
   */
  @Output() valueChange = new EventEmitter<object>();


  @Input() formFieldId: string;
  @Input() selectedMultiSelectData = [];
  optionList: any[] = [];

  subscription: Subscription[] = [];
  fltrCtrl: FormControl = new FormControl();

  appliedFltrCtrl: FormControl = new FormControl();

  isBtnClickedEvnt: BehaviorSubject<string> = new BehaviorSubject(null);
  /**
   * ANGULAR HOOK
   *
   */
  ngOnInit(): void {
    if (!this.control) {
      this.control = new FormControl();
    }
    this.fltrCtrl.valueChanges.pipe(startWith(''), debounceTime(500)).subscribe(res => {
      this.getDropDownValue(res);
    })

    if (this.control.value) {
      this.appliedFltrCtrl.setValue(this.control.value.value);
    }
    this.isBtnClickedEvnt.subscribe(res => {
      if (res) {
        this.appliedFltrCtrl.setValue(res);
      }
    })
  }

  getDropDownValue(searchText?): string | boolean | void {
    const sub = this.reportService.getDropDownValues(this.formFieldId, searchText).subscribe(res => {
      this.optionList = res.map(item => {
        return {
          value: item.CODE,
          key: this.displayCriteria && this.displayCriteria === 'CODE' ? item.CODE : (this.displayCriteria === 'CODE_TEXT' ? item.CODE + '-' + item.TEXT : item.TEXT)
        }
      });
      console.log(this.optionList);
    })
    this.subscription.push(sub);
  }

  applyFilter() {
    const selectedValue = this.optionList.find(item => item.value === this.control.value);
    const response = {
      formFieldId: this.formFieldId,
      value: { CODE: selectedValue.value, TEXT: selectedValue.key }
    }
    this.control.setValue(selectedValue.key)
    this.isBtnClickedEvnt.next(selectedValue.key);
    this.valueChange.emit(response);
  }

  clearSelectedFilter() {
    this.control.reset();
    this.fltrCtrl.reset();
    const response = {
      formFieldId: this.formFieldId,
      value: null
    }
    this.valueChange.emit(response);
    this.appliedFltrCtrl.reset();
  }
}
