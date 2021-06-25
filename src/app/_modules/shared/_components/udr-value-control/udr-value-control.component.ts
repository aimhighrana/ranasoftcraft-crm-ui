import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, UDRDropdownValue } from '@models/schema/schemadetailstable';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

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
  /**
   * Hold single input value ....
   */
  singleInput = '';
  /**
   * Hold start and end value for range selections....
   */
  multipleInput = {
    start: '',
    end: ''
  }
  @Output() valueChange = new EventEmitter();
  @Input() value: string;
  @Input() rangeValue: { start: string; end: string; };
  selectedTimeRange;
  @Input() range = false;
  /**
   * Hold the metadata fields response ....
   */
  @Input() metataData: MetadataModeleResponse = null;
  @Input() fieldId: string;
  selectedMetaData: any;

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
        case metadata.dataType === 'DATS':
          control = 'date';
          break;
        case metadata.dataType === 'DTMS':
          control = 'datetime';
          break;
        case metadata.dataType === 'TIMS':
          control = 'time';
          break;
      }
    }
    return control;
  }
  subscriptions: Array<Subscription> = [];
  searchSub: Subject<string> = new Subject();
  dateValue: Date;
  dateRangeValue: { start: Date; end: Date } = { start: null, end: null };
  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private datePipe: DatePipe
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
      || changes.rangeValue && changes.rangeValue.previousValue !== changes.rangeValue.currentValue
    ) {
      this.singleInput = this.value || '';
      this.loadUDRValueControl();
    }
    this.dateValue = this.value ? new Date(this.value) : null;
    this.dateRangeValue = {
      start: this.rangeValue?.start ? new Date(this.rangeValue.start) : null,
      end: this.rangeValue?.end ? new Date(this.rangeValue.end) : null
    }
    this.selectedTimeRange = (() => {
      const formatDate = (dt) => {
        return dt ? {
          hours: this.datePipe.transform(new Date(dt), 'HH'),
          minutes: this.datePipe.transform(new Date(dt), 'mm'),
        } : null;
      }
      return {
        start: formatDate(this.rangeValue?.start),
        end: formatDate(this.rangeValue?.end)
      }
    })();
    console.log('Date Range value:::', this.dateRangeValue, this.selectedTimeRange);
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
  inputChanged(searchStr, field = '') {
    if (this.range) {
      this.multipleInput[field] = searchStr;
    } else {
      if (this.displayControl === 'radio') {
        this.singleInput = '';
      } else {
        this.singleInput = searchStr;
      }
      this.searchSub.next(searchStr);
    }
    this.emit();
  }

  dateChanged(date: any) {
    if (this.range) {
      this.inputChanged(date.start?.toString() || null, 'start');
      this.inputChanged(date.end?.toString() || null, 'end');
    } else {
      this.inputChanged(date.toString());
    }
  }

  timeChanged(date: any, field = '') {
    console.log('timeChanged', date);
    const time = date.toString() || null;
    if (this.range) {
      this.inputChanged(time, 'start');
    } else {
      this.inputChanged(time);
    }
  }

  /**
   * Should return selected object to parent
   * @param $event current dropdown event
   */
  selected($event) {
    const searchStr = $event.option.viewValue;
    this.singleInput = searchStr;
    this.searchSub.next(searchStr);
    this.emit();
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
  loadUDRValueControl(searchString = this.singleInput) {
    const metadata = this.parseMetadata(this.fieldId);
    if (metadata) {
      metadata.picklist = '0';
      metadata.dataType = 'TIMS';
    }
    this.selectedMetaData = metadata;
    const pickLists = ['1', '4', '30', '35', '37'];
    if (!metadata || !pickLists.includes(metadata.picklist)) {
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

  /**
   * Should emit range or single value to the parent component
   */
  emit() {
    this.valueChange.emit(
      this.range ? this.multipleInput : this.singleInput
    );
  }
}
