import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'pros-listcolumnsetting',
  templateUrl: './listcolumnsetting.component.html',
  styleUrls: ['./listcolumnsetting.component.scss']
})
export class ListColumnsettingComponent implements OnInit, AfterViewInit {
  @Input() tableColumns: any = [];
  @Output() updateColumns: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  searchform = new FormGroup({
    searchFilter: new FormControl()
  });
  tableColumnscpy: any;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.searchform.controls.searchFilter.valueChanges.subscribe((txt) => {
      this.tableColumns = txt ? this.tableColumns.filter(item => item.fieldText.toLowerCase().includes(txt.toLowerCase())) : this.tableColumnscpy;
    })
    if (this.tableColumns) {
      this.tableColumnscpy = {};
      this.tableColumnscpy = JSON.parse(JSON.stringify(this.tableColumns));
    }
  }

  emitChange(column, event) {
    column.visible = event.checked;
    this.updateColumns.emit(this.tableColumns);
  }

  // close the column
  closeSettingColumn() {
    this.close.emit(true)
  }
}
