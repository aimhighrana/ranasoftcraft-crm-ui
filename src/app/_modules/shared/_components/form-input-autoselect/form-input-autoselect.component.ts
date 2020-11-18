import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { isEqual } from 'lodash';

@Component({
  selector: 'pros-form-input-autoselect',
  templateUrl: './form-input-autoselect.component.html',
  styleUrls: ['./form-input-autoselect.component.scss']
})
export class FormInputAutoselectComponent implements OnInit, OnChanges {
  @Input()
  updatedOptionsList: any[] = [];

  optionList: any[] = [];

  @Input()
  valueKey: string;

  @Input()
  tooltipKey: string;

  @Input()
  labelKey: string;

  @Input()
  preSelectedValue: any;

  @Input()
  viewMoreAction: string;

  @Input()
  extraOption: string;

  @Input()
  extraOptionLabel: string;

  @Input()
  fieldLabel: string;

  @Output()
  optionSelectedEmit: EventEmitter<any> = new EventEmitter(null);

  @Output()
  openCustomDialog: EventEmitter<any> = new EventEmitter(null);

  filteredOptions: Observable<any[]>;
  selectedMdoFldCtrl: FormControl;
  constructor() {
    this.selectedMdoFldCtrl = new FormControl();
   }

  /**
   * get the value using the key passed as an input to this component
   * @param option pass dropdown options object
   */
  getValue(option){
    if(this.valueKey && option[this.valueKey]) {
      return option[this.valueKey];
    } else {
      return option;
    }
  }

  /**
   * get the label using the key passed as an input to this component
   * @param option pass dropdown options object
   */
  getLabel(option) {
    if(option[this.labelKey]) {
      return option[this.labelKey];
    }
  }

  /**
   * get the tooltip using the key passed as an input to this component
   * @param option pass dropdown options object
   */
  getTooltipText(option) {
    if(option[this.tooltipKey]) {
      return option[this.tooltipKey];
    }
  }

  ngOnInit(): void {
  }

  initFilter() {
    this.filteredOptions = this.selectedMdoFldCtrl.valueChanges.pipe(
      debounceTime(400),
      startWith(''),
      map(value => this._filter(value))
    );
  }

  /**
   * method to filter dropdown values based on the typed string
   * @param value pass the value to be looked up in the list of values
   */
  private _filter(value: any): any[] {
    if(value){
      const filterValue = (isNaN(value))? value.toLowerCase(): value;

      return this.optionList.filter(option => this.getLowerCaseLabel(option[this.labelKey]).indexOf(filterValue) === 0);
    }

    return this.optionList;
  }

  /**
   * convert string to lowercase
   * @param value pass the string to be converted to lowercase
   */
  getLowerCaseLabel(value) {
    return value? value.toLowerCase(): '';
  }

  /**
   * method to prevent re rendering in a list
   * @param fld track by for performance improvement
   */
  suggestedMdoFldTrkBy(fld): string {
    if (fld) {
      return fld[this.valueKey];
    }
    return null;
  }

  /**
   * method to show consistent selected values
   * @param object pass object from which the value should be displayed
   */
  mdoFieldDisplayWith(object): string {
    return object ? object[this.labelKey] : '';
  }

  /**
   * emit the selected values
   * @param sel selected option or action
   */
  emitOptionSelected(event: any) {
    let action: string;
    this.initFilter();
    if(event && event.option){
      action = event.option.value
    } else {
      action = event;
    }

    if(action === this.viewMoreAction || action === this.extraOption){
      this.openCustomDialog.emit(action);
    } else {
      this.optionSelectedEmit.emit(action);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!isEqual(changes.updatedOptionsList.previousValue, changes.updatedOptionsList.currentValue)){
      if(changes.updatedOptionsList.currentValue && changes.updatedOptionsList.currentValue.length>0){
        this.optionList = changes.updatedOptionsList.currentValue;
        this.initFilter();
      }
    }
  }
}
