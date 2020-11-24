import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusinessRuleType } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { FieldConfiguration, TransformationFormData } from '@models/schema/schemadetailstable';

@Component({
  selector: 'pros-transformation-rule',
  templateUrl: './transformation-rule.component.html',
  styleUrls: ['./transformation-rule.component.scss']
})
export class TransformationRuleComponent implements OnInit, OnChanges {
  form: FormGroup;

  filteredTargetFields: Observable<any[]> = of([]);
  selectedTargetFields: any[] = [];

  filteredSourceFields: Observable<any[]> = of([]);
  selectedSourceField: any = null;

  /**
   * list of event to consider as selection
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * target field array from a module
   */
  @Input()
  targetFieldsObject: FieldConfiguration = {
    valueKey: '',
    labelKey: '',
    list: []
  };

  /**
   * source field array from a module
   */
  @Input()
  sourceFieldsObject: FieldConfiguration = {
    valueKey: '',
    labelKey: '',
    list: []
  };

  @Input()
  submitted = false;

  @Input()
  selectedRuleType: string;

  @Input()
  initialTransformationData: TransformationFormData;

  @Output()
  transformationFormOutput: EventEmitter<TransformationFormData> = new EventEmitter(null);
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the form object and
   * subscribe to any required control value changes
   * or the whole form values
   */
  initializeForm() {
    this.form = new FormGroup({
      sourceFields: new FormControl('', [Validators.required]),
      targetFields: new FormControl(''),
      excludeScript: new FormControl('', [Validators.required]),
      includeScript: new FormControl('', [Validators.required]),
    });

    this.initTargetAutocomplete();
    this.initSourceAutocomplete();
    // Apply conditional validation based on rule type
    this.form.valueChanges.subscribe((formData) => {
      this.transformationFormOutput.emit({
        ...formData,
        selectedTargetFields: this.selectedTargetFields
      });
    });

    this.patchFormValues(this.initialTransformationData);
  }

  /**
   * Patch form values with the existing value
   * @param initialData form data to patch
   */
  patchFormValues(initialData: TransformationFormData) {
    if (initialData) {
      this.form.patchValue(initialData);
      if (initialData.selectedTargetFields.length > 0) {
        this.selectedTargetFields = initialData.selectedTargetFields;
      }
    }
  }

  /**
   * delete selected source field
   */
  removeSourceField() {
    this.selectedSourceField = null;
    this.form.controls.sourceFields.setValue('');
  }

  /**
   * Initialize autocomplete for targetfield values
   */
  initTargetAutocomplete() {
    this.filteredTargetFields = this.form.controls.targetFields.valueChanges
      .pipe(
        startWith(''),
        map(keyword => {
          return keyword ?
            this.targetFieldsObject.list.filter(item => {
              return item[this.targetFieldsObject.labelKey].toString().toLowerCase().indexOf(keyword) !== -1
            }) : this.targetFieldsObject.list
        }),
      )
  }

  /**
   * Initialize autocomplete for targetfield values
   */
  initSourceAutocomplete() {
    this.filteredSourceFields = this.form.controls.sourceFields.valueChanges
      .pipe(
        startWith(''),
        map(keyword => {
          return keyword ?
            this.sourceFieldsObject.list.filter(item => {
              return item[this.sourceFieldsObject.labelKey].toString().toLowerCase().indexOf(keyword) !== -1
            }) : this.sourceFieldsObject.list
        }),
      )
  }

  /**
   * method to prepare target values
   * @param list array of objects
   */
  updateTargetValue({ list, labelKey, valueKey }) {
    this.targetFieldsObject = {
      labelKey,
      valueKey,
      list
    }
  }

  /**
   * method to prepare source values
   * @param list array of objects
   */
  updateSourceValue({ list, labelKey, valueKey }) {
    this.sourceFieldsObject = {
      labelKey,
      valueKey,
      list
    }
  }

  /**
   * Select target fields from the array of Objects
   * @param event pass the value to be added
   */
  selectTargetField(event) {
    const { valueKey, labelKey } = this.targetFieldsObject;
    const alreadyExists = this.selectedTargetFields.find(item => item[valueKey] === event.option.value);
    if (alreadyExists) {
      this.snackBar.open('This field is already selected', 'Okay', { duration: 5000 });
    } else {
      this.selectedTargetFields.push({
        [labelKey]: event.option.viewValue,
        [valueKey]: event.option.value
      });
    }
    this.form.controls.targetFields.setValue('');
  }

  /**
   * Select source fields from the array of Objects
   * different implementation to allow only one value
   * to be selected
   * @param event pass the value to be added
   */
  selectSourceField(event) {
    const { valueKey, labelKey } = this.sourceFieldsObject;
    this.selectedSourceField = {
      [labelKey]: event.option.viewValue,
      [valueKey]: event.option.value
    };
    this.form.controls.sourceFields.setValue(event.option.value);
  }

  /**
   * remove selected target field
   * @param id pass the id to remove
   */
  removeTargetField(id) {
    this.selectedTargetFields.splice(id, 1);
  }

  // Getter to check if the rule is TransformationRule
  get isTransformationRule() {
    return this.selectedRuleType === BusinessRuleType.BR_TRANSFORMATION_RULE;
  }

  // Getter to check if the rule is TransformationLookupRule
  get isTransformationLookupRule() {
    return this.selectedRuleType === BusinessRuleType.BR_TRANSFORMATION_LOOKUP_RULE;
  }

  /**
   * method to modified the data to view in mat autocomplete
   * @param value value to be modified
   */
  displayFnTarget(value) {
    return value ? value[this.targetFieldsObject.labelKey] : '';
  }

  /**
   * method to modified the data to view in mat autocomplete
   * @param value value to be modified
   */
  displayFnSource(value) {
    return value ? value[this.sourceFieldsObject.labelKey] : '';
  }

  /**
   * function to set the value in the form
   * @param value entered value
   * @param field the selected field of form
   */
  getFormValue(value, field) {
    this.form.controls[field].setValue(value);
  }

  /**
   * Angular hook to detect changes in the input values
   * @param changes check for change using changes variable
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!isEqual(changes.targetFieldsObject.previousValue, changes.targetFieldsObject.currentValue)) {
      this.updateTargetValue(changes.targetFieldsObject.currentValue);
    }
    if (!isEqual(changes.sourceFieldsObject.previousValue, changes.sourceFieldsObject.currentValue)) {
      this.updateSourceValue(changes.sourceFieldsObject.currentValue);
    }
    if (!isEqual(changes.selectedRuleType.previousValue, changes.selectedRuleType.currentValue)) {
      this.selectedRuleType = changes.selectedRuleType.currentValue;
    }
    if (!isEqual(changes.submitted.previousValue, changes.submitted.currentValue)) {
      this.submitted = changes.submitted.currentValue;
    }
  }
}
