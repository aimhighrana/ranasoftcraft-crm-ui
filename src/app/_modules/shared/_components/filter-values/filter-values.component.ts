import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { debounce } from 'lodash';

@Component({
  selector: 'pros-filter-values',
  templateUrl: './filter-values.component.html',
  styleUrls: ['./filter-values.component.scss']
})
export class FilterValuesComponent implements OnInit, OnChanges {

  formGroup: FormGroup;

  @Input()
  moduleId: string;

  // Input for the material ID to fetch dropdown values
  @Input() fieldId: string;

  // Emit selected values to parent
  @Output() selectedValues: EventEmitter<DropDownValue[]> = new EventEmitter<DropDownValue[]>();

  // To have All dropdown values
  dropValue: DropDownValue[] = [];

  @Input()
  staticFieldValues: string[];

  // To have only selected dropdown values
  @Input()
  checkedValue: DropDownValue[] = [];

  // To have values matches search input text
  searchValue: DropDownValue[];

  /**
   * Datascope is true then fiter value is serach by api
   */
  @Input()
  isDataScope: boolean;

  // Adding debounce to prevent multiple api calls when searching
  delayedCall = debounce((fieldId: string, searchText: string) => {
    if (this.staticFieldValues && this.staticFieldValues.length === 0) {
      this.getDropdownValues(fieldId, searchText);
    } else if(this.isDataScope){
      this.getDropdownValues(fieldId, searchText);
    } else {
      this.searchFromExistingValues(searchText);
    }
  }, 300)

  constructor(private schemaService: SchemaService) { }

  /**
   * Angular hook for detecting Input value changes
   * @param changes Input values to watch for changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldId && changes.fieldId.previousValue !== changes.fieldId.currentValue) {
      this.fieldId = changes.fieldId.currentValue;
      this.updateValues();
    }

    if (changes && changes.checkedValue && changes.checkedValue.previousValue !== changes.checkedValue.currentValue) {
      this.checkedValue = changes.checkedValue.currentValue;
    }
  }

  updateValues() {
    if(this.fieldId){
      if(!this.moduleId) {
        this.generateDropdownValues(this.schemaService.getStaticFieldValues(this.fieldId));
      } else {
        this.getDropdownValues(this.fieldId, '');
      }
    }
    this.checkedValue = [];
  }

  /**
   * Angular hook
   */
  ngOnInit(): void {
    if (this.fieldId && this.moduleId) {
      this.getDropdownValues(this.fieldId, '');
    }
  }

  // Hitting API to get drop-down values
  getDropdownValues(materialId: string, query: string) {
    this.schemaService.dropDownValues(materialId, query).subscribe((data) => {
      if (data && data.length > 0) {
        this.dropValue = data;
        this.searchValue = this.dropValue;
      }
    })
  }

  // Generate static values from excel rows
  generateDropdownValues(dropDownValues: string[]) {
    if (dropDownValues && dropDownValues.length > 0) {
      dropDownValues.map((value, i) => {
        this.dropValue.push({
          CODE: value,
          FIELDNAME: value,
          LANGU: '',
          PLANTCODE: '',
          SNO: `${i + 1}`,
          TEXT: value
        });
      });
    }
    this.searchValue = this.dropValue;
  }

  /**
   * Check that element is already in array or not
   * If yes then pop out if not then push inside the array
   * @param value current dropdown value
   */
  onChange(value: DropDownValue) {
    const selectedCtrl = this.checkedValue.find(fil => fil.CODE === value.CODE);

    if (selectedCtrl) {
      const index = this.checkedValue.indexOf(selectedCtrl);
      this.checkedValue.splice(index, 1);
    } else {
      this.checkedValue.push(value);
    }
  }

  /**
   * Check whether drop is selected
   * @param value current drop value
   */
  isChecked(value: DropDownValue): boolean {
    const codes = this.checkedValue.map(map => map.CODE);
    return codes.indexOf(value.CODE) !== -1 ? true : false;
  }

  /**
   * To emit the selected values on click button
   */
  submit() {
    this.selectedValues.emit(this.checkedValue);
    // this.navList._stateChanges.
  }

  /**
   * To search from the list of values
   */
  searchFromExistingValues(searchText: string) {
    if (searchText.trim()) {
      this.searchValue = this.dropValue.filter((value) => value.FIELDNAME.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.searchValue = this.dropValue;
    }
  }

  /**
   * To search dropdown values according to the search field
   * @param searchText string to search with
   */
  searchData(searchText: string = '') {
    this.delayedCall(this.fieldId, searchText);
  }
}
