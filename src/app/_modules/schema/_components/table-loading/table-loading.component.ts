import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pros-table-loading',
  templateUrl: './table-loading.component.html',
  styleUrls: ['./table-loading.component.scss']
})
export class TableLoadingComponent implements OnInit, OnChanges {

  /**
   * Get number of column for skiton ..
   */
  @Input()
  columnCount = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.columnCount.currentValue !== changes.columnCount.previousValue) {
      this.columnCount = changes.columnCount.currentValue;
    }
  }

  ngOnInit(): void {
  }

}
