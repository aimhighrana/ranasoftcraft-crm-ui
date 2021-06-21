import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Metadata } from '@modules/report/edit/container/metadatafield-control/metadatafield-control.component';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, UDRDropdownValue } from '@models/schema/schemadetailstable';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'pros-udr-value-control',
  templateUrl: './udr-value-control.component.html',
  styleUrls: ['./udr-value-control.component.scss']
})
export class UDRValueControlComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  moduleId: string;

  /**
   * mat-label
   */
  @Input()
  lebel: string;

  /**
   * placeholder for getting
   */
  @Input()
  placeholder = 'Value';

  fieldList: Array<UDRDropdownValue> = [];
  searchStr = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() value: string;
  /**
   * Hold the metadata fields response ....
   */
  @Input() metataData: MetadataModeleResponse = null;
  @Input() fieldId: string;
  get filteredList() {
    return this.fieldList.filter(x => !this.searchStr || x.TEXT.toLowerCase().includes(this.searchStr.toLowerCase()));
  }
  constructor(
    private schemaDetailsService: SchemaDetailsService
  ) { }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    console.log('Changes occured', changes);
    if (changes.fieldId && changes.fieldId.previousValue !== changes.fieldId.currentValue) {
      this.loadDropdownValues();
    } else if (changes.metataData && changes.metataData.firstChange) {
      this.loadDropdownValues();
    }
    if (changes.value) {
      this.searchStr = this.value;
    }
  }

  ngOnInit(): void {
  }

  /**
   * Should send changed text to parent
   */
  inputChanged() {
    this.valueChange.emit(this.searchStr);
  }

  /**
   * Should return selected object to parent
   * @param $event current dropdown event
   */
  selected($event) {
    this.searchStr = $event.option.viewValue;
    this.inputChanged();
  }

  /**
   * Should return required meta data field
   * @param fieldId field name string
   */
  parseMetadata(fieldId: string): any {
    const list = [];
    if (!fieldId || !this.metataData) {
      return null;
    }
    for (const field in this.metataData) {
      list.push(this.metataData[field]);
    }
    for (const item of list) {
      if (item[fieldId]) {
        return item[fieldId];
      }
      for (const field in item) {
        if (typeof item[field] === 'object') {
          list.push(item[field]);
        }
      } 
    }
    return null;
  }

  /**
   * Should update dropdown values
   */
  loadDropdownValues() {
    const metadata = this.parseMetadata(this.fieldId);
    const pickLists = ['1', '30', '37'];
    if (!metadata || !pickLists.includes(metadata.picklist)) {
      this.fieldList = [];
      return;
    }
    this.schemaDetailsService.getUDRDropdownValues(this.fieldId).subscribe((list: Array<UDRDropdownValue>) => {
      this.fieldList = list;
    }, (error) => {
      this.fieldList = [];
      console.error('Error while loading dropdown values', error);
    });
  }
}
