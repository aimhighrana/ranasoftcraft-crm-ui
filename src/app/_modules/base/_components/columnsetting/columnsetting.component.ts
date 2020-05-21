import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'pros-columnsetting',
  templateUrl: './columnsetting.component.html',
  styleUrls: ['./columnsetting.component.scss']
})
export class ColumnsettingComponent implements OnInit {
  @Input() tableColumns = [];
  @Output() updateColumns = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  emitChange(column, event: MatCheckboxChange) {
    column.visible = event.checked;
    this.updateColumns.emit(this.tableColumns);
  }
  closeSettingColumn() {
    this.close.emit(true)
  }
}
