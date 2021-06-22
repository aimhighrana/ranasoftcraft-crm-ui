import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, UDRDropdownValue } from '@models/schema/schemadetailstable';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  @Output() valueChange = new EventEmitter();
  @Input() value: string;
  /**
   * Hold the metadata fields response ....
   */
  @Input() metataData: MetadataModeleResponse = null;
  @Input() fieldId: string;
  selectedMetaData: any;
  get filteredList() {
    return this.fieldList.filter(x => !this.searchStr || x.TEXT.toLowerCase().includes(this.searchStr.toLowerCase()));
  }

  get displayControl(): string {
    let control = 'dropdown';
    const metadata = this.selectedMetaData;
    if (metadata) {
      switch (true) {
        case metadata.picklist === '0' && (['CHAR', 'ALTN', 'ISCN', 'REQ', 'DEC'].includes(metadata.dataType)):
        case metadata.picklist === '22' && metadata.dataType === 'CHAR':
          control = 'text';
          break;
        case metadata.picklist === '0' && metadata.dataType === 'NUMC':
          control = 'number';
          break;
        case metadata.picklist === '2' && metadata.dataType === 'CHAR':
          control = 'checkbox';
          break;
        case metadata.picklist === '4' && metadata.dataType === 'CHAR':
        case metadata.picklist === '35' && !metadata.dataType:
          control = 'radio';
          break;
        case metadata.picklist === 'DATS' && metadata.dataType === 'CHAR':
          control = 'date';
          break;
        case metadata.picklist === 'DTMS' && metadata.dataType === 'CHAR':
          control = 'datetimerange';
          break;
        case metadata.picklist === 'TIMS' && metadata.dataType === 'CHAR':
          control = 'timerange';
          break;
      }
    }
    return control;
  }
  subscriptions: Array<Subscription> = [];
  searchSub: Subject<string> = new Subject();
  constructor(
    private schemaDetailsService: SchemaDetailsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (changes.fieldId && changes.fieldId.previousValue !== changes.fieldId.currentValue
      || changes.metataData && changes.metataData.previousValue !== changes.metataData.currentValue
      || changes.value && changes.value.previousValue !== changes.value.currentValue
    ) {
      console.log('CHANGES', changes);
      this.searchStr = this.value;
      this.loadUDRValueControl();
    }
  }

  ngOnInit(): void {
    const subscription = this.searchSub.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchString) => {
      this.loadUDRValueControl(searchString);
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Should send changed text to parent
   */
  inputChanged(searchStr) {
    if (this.displayControl === 'radio') {
      this.searchStr = '';
    } else {
      this.searchStr = searchStr;
    }
    this.searchSub.next(searchStr);
    this.valueChange.emit(this.searchStr);
  }

  dateChanged(date: Date) {
    this.inputChanged(date.toString());
  }
  dateRangeChanged(dateObj: {start:Date, end: Date}) {
    this.valueChange.emit({
      start: dateObj.start?.toString() || '',
      end: dateObj.end?.toString() || ''
    });
    console.log('Date range selected:', dateObj);
  }

  /**
   * Should return selected object to parent
   * @param $event current dropdown event
   */
  selected($event) {
    const searchStr = $event.option.viewValue;
    this.searchStr = searchStr;
    this.searchSub.next(searchStr);
    this.valueChange.emit(this.searchStr);
  }
  checkboxChanged($event) {
    this.valueChange.emit(`${$event}`);
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
      if (this.metataData[field]) {
        list.push(this.metataData[field]);
      }
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
   * Should update value control type and data
   */
  loadUDRValueControl(searchString = this.searchStr) {
    const metadata = this.parseMetadata(this.fieldId);
    this.selectedMetaData = metadata;
    const pickLists = ['1', '30', '35', '37'];
    if (metadata) {
      metadata.picklist = 'DTMS';
      metadata.dataType = 'CHAR';
    } else if (!metadata || !pickLists.includes(metadata.picklist)) {
      this.fieldList = [];
      return;
    }
    if (!['radio', 'dropdown'].includes(this.displayControl)) {
      searchString = '';
    }
    this.schemaDetailsService.getUDRDropdownValues(this.fieldId, searchString).subscribe((list: Array<UDRDropdownValue>) => {
      this.fieldList = list;
    }, (error) => {
      this.fieldList = [];
      console.error('Error while loading dropdown values', error);
    });
  }
}
