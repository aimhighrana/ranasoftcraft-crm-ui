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

  /**
   * array of options to show in the dropdown
   */
  @Input()
  updatedOptionsList: any[] = [];

  /**
   * local variable for holding the filtered options
   */
  optionList: any[] = [];

  /**
   * this key is used to get the value from the selected item
   * if the item is an object
   */
  @Input()
  valueKey: string;

  /**
   * this key is used to get the tooltip from the selected item
   * if the item is an object
   */
  @Input()
  tooltipKey: string;

  /**
   * this key is used to get the label from the selected item
   * if the item is an object
   */
  @Input()
  labelKey: string;

  /**
   * hold or pass the preselected values
   */
  @Input()
  preSelectedValue: any;

  /**
   * Define the action that will happen when
   * selecting the extra option in the list
   */
  @Input()
  viewMoreAction: string;

  /**
   * Define the action that will happen when
   * the extra button at the end of the input
   * gets clicked
   */
  @Input()
  extraOption: string;

  /**
   * Define the label show for the extra option at
   * the end of the list
   */
  @Input()
  extraOptionLabel: string;

  /**
   * Define the field label
   */
  @Input()
  fieldLabel: string;

  /**
   * Event emitter for the selected option
   */
  @Output()
  optionSelectedEmit: EventEmitter<any> = new EventEmitter(null);

  /**
   * Event emitter for extra button at the end of the input
   */
  @Output()
  openCustomDialog: EventEmitter<any> = new EventEmitter(null);

  /**
   * Event emitter to emit event while searching..
   */
  @Output()
  emitSearchValue: EventEmitter<any> = new EventEmitter(null);

  /**
   * Event emitter to emit event on click extra label
   */
  @Output()
  emitExtraLabelClick: EventEmitter<any> = new EventEmitter(null);

  /**
   * Observable for filtered option
   * used to filter results as a search term is typed
   */
  filteredOptions: Observable<any[]>;

  /**
   * Form control for the input field
   */
  selectedMdoFldCtrl: FormControl;

  /**
   * option that holds a value to identify if the results array is empty
   */
  hasResult: boolean;
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
    this.selectedMdoFldCtrl.valueChanges.subscribe((value) => {
      this.emitSearchValue.emit(value);
    })
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
    let availableOptions = this.optionList;
    if(value){
      const filterValue = (isNaN(value))? value.toLowerCase(): value;

      availableOptions = this.optionList.filter(option => this.getLowerCaseLabel(option[this.labelKey]).indexOf(filterValue) === 0);
    }
    this.hasResult = availableOptions.length>0;
    return availableOptions;
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

  /**
   * Function to emit event on click extra label
   */
  emitClickEvent() {
    this.emitExtraLabelClick.emit();
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
