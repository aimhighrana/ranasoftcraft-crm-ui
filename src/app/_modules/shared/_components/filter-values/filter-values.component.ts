import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';

@Component({
  selector: 'pros-filter-values',
  templateUrl: './filter-values.component.html',
  styleUrls: ['./filter-values.component.scss']
})
export class FilterValuesComponent implements OnInit, OnChanges {

  formGroup: FormGroup;

  // Input for the material ID to fetch dropdown values
  @Input() fieldId: string;

  // Emit selected values to parent
  @Output() selectedValues: EventEmitter<DropDownValue[]> = new EventEmitter<DropDownValue[]>();

  // To have All dropdown values
  dropValue: DropDownValue[] = [];

  // To have only selected dropdown values
  @Input()
  checkedValue: DropDownValue[] = [];

  // To have values matches search input text
  searchValue: DropDownValue[];

  constructor(private schemaService: SchemaService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.fieldId && changes.fieldId.previousValue !== changes.fieldId.currentValue) {
      this.fieldId = changes.fieldId.currentValue;
      this.getDropdownValues(this.fieldId, '');
      this.checkedValue = [];
    }

    if(changes && changes.checkedValue && changes.checkedValue.previousValue !== changes.checkedValue.currentValue) {
      this.checkedValue = changes.checkedValue.currentValue
    }
  }

  ngOnInit(): void {

    if(this.fieldId) {
      this.getDropdownValues(this.fieldId, '');
    }
  }

  // Hitting API to get drop-down values
  getDropdownValues(materialId: string, query: string) {
    this.schemaService.dropDownValues(materialId, query).subscribe((data) => {
      this.dropValue = data;
      this.searchValue = this.dropValue;
    })
  }

  /**
   * Check that element is already in array or not
   * If yes then pop out if not then push inside the array
   * @param value current dropdown value
   */
  onChange(value: DropDownValue) {
    const selectedCtrl = this.checkedValue.filter(fil => fil.CODE === value.CODE)[0];

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
   * To search dropdown values according to the search field
   * @param searchText current value of search field
   */
  searchData(searchText: string) {
    if(searchText) {
      setTimeout(()=>{
        this.getDropdownValues(this.fieldId, searchText);
      }, 1000);
    } else {
      setTimeout(()=>{
        this.getDropdownValues(this.fieldId, '');
      }, 1000);
    }
  }

}
