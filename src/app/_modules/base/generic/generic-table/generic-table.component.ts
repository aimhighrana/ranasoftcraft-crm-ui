import { Component, Input } from '@angular/core';

@Component({
  selector: 'pros-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent {
  displayedColumns: string[] = [];
  dataSource = [];
  tableData;

  @Input() set gridData(tableData) {
    if (tableData) {
      if (tableData.DATA.length > 0) {
        this.tableData = tableData;
         this.displayedColumns.push(...tableData.HEADER.map(item => item.fieldId));
        this.dataSource.push(...tableData.DATA);
      }
    }
  }

  constructor() { }

  /**
   * Function to get the text
   * @param ele the selected row element
   * @param column the column name
   */
  getText(ele, column) {
    if (ele[column]) {
      return ele[column].textdisplay ? ele[column].textdisplay : '-'
    }
    return ''
  }

  /**
   * Function to get column name on the basis of fieldid
   * @param column fieldid
   */
  getColumnDescription(column) {
    const findObject = this.tableData.HEADER.find(item => item.fieldId === column);
    if (findObject) {
      return findObject.fieldDescri;
    }
    return ''
  }
}
