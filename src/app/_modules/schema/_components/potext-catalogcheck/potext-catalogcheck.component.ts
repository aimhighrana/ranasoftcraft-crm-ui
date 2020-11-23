import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
  action: string;
  catalog: string;
  sorttext: string;
  partno: string;
  vendor: string;
  podoc: string;
  poitem: string;
  qty: string;
  price: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: '', action: '', catalog: '', sorttext:'', partno: '', vendor: '', podoc: '', poitem: '', qty: '', price: ''},
];

@Component({
  selector: 'pros-potext-catalogcheck',
  templateUrl: './potext-catalogcheck.component.html',
  styleUrls: ['./potext-catalogcheck.component.scss']
})
export class PotextCatalogcheckComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = ['select', 'name', 'action', 'catalog', 'sorttext', 'partno', 'vendor', 'podoc', 'poitem', 'qty', 'price'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  ngOnInit(): void {
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

}
