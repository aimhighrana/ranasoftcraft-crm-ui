import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { Criteria, DropDownValues } from '@modules/report/_models/widget';
import { ReportService } from '@modules/report/_service/report.service';
import { Subscription } from 'rxjs';
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

  @Input() isTableFilter: boolean = false;
  /**
   * To emit value change of input to parent
   */
  @Output() valueChange = new EventEmitter<Object>();


  @Input() formFieldId: string;
  @Input() selectedMultiSelectData = [];
  optionList: DropDownValues[] = [];

  subscription: Subscription[] = [];
  fltrCtrl: FormControl = new FormControl();
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
  }

  getDropDownValue(searchText?): string | boolean | void {
    const sub = this.reportService.getDropDownValues(this.formFieldId, searchText).subscribe(res => {
      this.optionList = res.map(item => {
        return {
          key: item.CODE,
          value: this.displayCriteria && this.displayCriteria === 'CODE' ? item.CODE : (this.displayCriteria === 'CODE_TEXT' ? item.CODE + '-' + item.TEXT : item.TEXT)
        }
      });
      console.log(this.optionList);
    })
    this.subscription.push(sub);
  }

  applyFilter() {
    const response = {
      formFieldId: this.formFieldId,
      value: { CODE: this.control.value.key, TEXT: this.control.value.value }
    }
    this.valueChange.emit(response);
  }
}
