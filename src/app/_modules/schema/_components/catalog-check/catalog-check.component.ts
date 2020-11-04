import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
  action: string;
  status: string;
  materialno: string;
  materialdesc: string;
  materialtype: string;
  materialgrp: string;
  noun: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: '', action: '', status: '', materialno:'', materialdesc: '', materialtype: '', materialgrp: '', noun: ''},
];

@Component({
  selector: 'pros-catalog-check',
  templateUrl: './catalog-check.component.html',
  styleUrls: ['./catalog-check.component.scss']
})




export class CatalogCheckComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = ['select', 'name', 'action', 'status', 'materialno', 'materialdesc', 'materialtype', 'materialgrp', 'noun'];
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

