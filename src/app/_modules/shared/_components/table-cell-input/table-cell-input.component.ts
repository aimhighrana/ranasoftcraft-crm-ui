import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldInputType } from '@models/schema/schemadetailstable';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'pros-table-cell-input',
  templateUrl: './table-cell-input.component.html',
  styleUrls: ['./table-cell-input.component.scss']
})
export class TableCellInputComponent implements OnInit, AfterViewInit {

  @Input()
  fieldId: string;

  @Input()
  inputType: FieldInputType;

  @Input()
  value: any;

  @Output()
  inputBlur = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef;


  FIELD_TYPE = FieldInputType;

  selectFieldOptions: DropDownValue[] = [];
  filterdOptionsObs: Observable<DropDownValue[]>;

  searchControl = new FormControl();

  constructor(private schemaService: SchemaService) { }

  ngOnInit(): void {

    if ((this.inputType === this.FIELD_TYPE.SINGLE_SELECT) || (this.inputType === this.FIELD_TYPE.MULTI_SELECT)) {
      this.prepareDropdownOptions();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.nativeElement.focus();
      // if(this.inputType.)
    }, 10)

  }

  prepareDateFormat() {
    if (this.value) {
      return new Date(moment(this.value, 'DD/MM/YYYY').format('MM/DD/YYYY'));
    }
    return '';
  }

  formatDate(date) {
    return moment(date.toString()).format('MM/DD/YYYY');
  }

  emitChngSelectValue(event) {

    if (event.relatedTarget && event.relatedTarget.id.indexOf('mat-option') > -1) {
      event.preventDefault();
      console.log('selection blur')
      return;
    }

    setTimeout(() => {
      const selectedOption = this.selectFieldOptions.find(option => option.TEXT.toLocaleLowerCase() === event.target.value.toLowerCase());
      const selectedValue = selectedOption ? selectedOption.CODE : this.value;
      this.emitInputBlur(selectedValue);
    }, 500)
  }

  formatMultiSelectValue(value) {
    this.emitInputBlur(value)
  }

  filterSelectFieldOptions(searchText) {
    return this.selectFieldOptions.filter(option => option.TEXT.toLowerCase().includes(searchText.toLowerCase()));
  }

  prepareDropdownOptions() {
    this.schemaService.dropDownValues(this.fieldId, '').subscribe((data) => {
      this.selectFieldOptions = data;
      this.filterdOptionsObs = this.searchControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        map(v => this.filterSelectFieldOptions(v))
      )
    })
  }

  emitInputBlur(value) {
    this.inputBlur.emit(value);
  }

}
