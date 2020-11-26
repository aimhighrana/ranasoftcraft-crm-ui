import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FieldConfiguration } from '@models/schema/schemadetailstable';
import { Observable, of } from 'rxjs';
import { isEqual } from 'lodash';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-lookup-rule',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupRuleComponent implements OnInit, OnChanges {

  /**
   * observable for autocomplete
   */
  filteredFields: Observable<any[]> = of([]);
  selectedFields: any[] = [];
  availableField: FormControl;

  @Input()
  fieldsObject: FieldConfiguration = {
    list: [],
    labelKey: '',
    valueKey: ''
  }

  /**
   * list of event to consider as selection
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.availableField = new FormControl('');
    this.initTargetAutocomplete();
  }

  removeField(index) {
    this.selectedFields.splice(index, 1);
  }

  displayFn(value) {
    return value ? value[this.fieldsObject.labelKey] : '';
  }

  selectCurrentField(event) {
    const { valueKey, labelKey } = this.fieldsObject;
    const alreadyExists = this.selectedFields.find(item => item[valueKey] === event.option.value);
    if (alreadyExists) {
      this.snackBar.open('This field is already selected', 'Okay', { duration: 5000 });
    } else {
      this.selectedFields.push({
        [labelKey]: event.option.viewValue,
        [valueKey]: event.option.value
      });
    }
    this.availableField.setValue('');
  }

/**
 * Initialize autocomplete for targetfield values
 */
  initTargetAutocomplete() {
    this.filteredFields = this.availableField.valueChanges
      .pipe(
        startWith(''),
        map(keyword => {
          return keyword ?
            this.fieldsObject.list.filter(item => {
              return item[this.fieldsObject.labelKey].toString().toLowerCase().indexOf(keyword) !== -1
            }) : this.fieldsObject.list
        }),
      )
  }

  /**
   * method to prepare target values
   * @param fieldObject pass the updated object to update
   */
  updateTargetValue({ list, labelKey, valueKey }) {
    this.fieldsObject = {
      labelKey,
      valueKey,
      list
    }
  }

  /**
   * Angular hook to detect changes in the input values
   * @param changes check for change using changes variable
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.fieldsObject && !isEqual(changes.fieldsObject.previousValue, changes.fieldsObject.currentValue)) {
      this.updateTargetValue(changes.fieldsObject.currentValue);
    }
  }
}
