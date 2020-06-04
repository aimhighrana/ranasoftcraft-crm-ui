import { Component, OnInit, ViewChild, AfterViewInit, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'pros-tasklist-table',
  templateUrl: './tasklist-table.component.html',
  styleUrls: ['./tasklist-table.component.scss']
})
export class TasklistTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['task', 'description', 'requester', 'received', 'date', 'module', 'priority', 'tag'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}

export interface Element {
  description: string;
  task: number;
  requester: number;
  received: number;
  date: number;
  module: string;
  priority: string;
  tag: string;
}

const ELEMENT_DATA: Element[] = [
  {task: 12311098, description: 'Vendor has been created and sent for your approval', requester: 1, received: 1, date: 1, module: 'M', priority: 'H', tag: 'R'},
  {task: 12321097, description: 'Vendor has been created and sent for your approval', requester: 4, received: 1, date: 1, module: 'M', priority: 'He', tag: 'R'},
  {task: 12331096, description: 'Vendor has been created and sent for your approval', requester: 6, received: 1, date: 1, module: 'M', priority: 'Li', tag: 'R'},
  {task: 12341095, description: 'Vendor has been created and sent for your approval', requester: 9, received: 1, date: 1, module: 'M', priority: 'Be', tag: 'R'},
  {task: 12351094, description: 'Vendor has been created and sent for your approval', requester: 1, received: 1, date: 1, module: 'M', priority: 'B', tag: 'R'},
];