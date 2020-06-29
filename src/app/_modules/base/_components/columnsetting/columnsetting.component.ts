import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
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

  saveChange(column, event) {
    console.log(column, event)
    column.visible = event.checked;
  }

  closeSettingColumn() {
    this.close.emit(true)
  }
  drop(event) {
    moveItemInArray(this.tableColumns, event.previousIndex, event.currentIndex);
    console.log(event)
    }
}
