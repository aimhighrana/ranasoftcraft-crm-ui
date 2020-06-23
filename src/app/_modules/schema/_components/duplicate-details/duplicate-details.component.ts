import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort} from '@angular/material/sort';

@Component({
  selector: 'pros-duplicate-details',
  templateUrl: './duplicate-details.component.html',
  styleUrls: ['./duplicate-details.component.scss']
})
export class DuplicateDetailsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['master', 'materailno', 'message', 'group', 'type', 'industry', 'description'];
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
  master: string;
  message: string;
  materailno: number;
  group: number;
  type: string;
  industry: string;
  description: string;
}

const ELEMENT_DATA: Element[] = [
  {master: 'ERSA', materailno: 80404665, message: 'Vendor has been created and sent for your approval', group: 98495, type: 'ERSA', industry: 'M', description: 'COVER:TYPE: HEAD NOSE, APPLICATION: FEMALE'},
  {master: 'ERSA', materailno: 12321097, message: 'Vendor has been created and sent for your inprogress', group: 98495, type: 'ERSA', industry: 'L', description: 'COVER:TYPE: HEAD NOSE, APPLICATION: FEMALE'},
  {master: 'ERSA', materailno: 12331096, message: 'Vendor has been created and sent for your reject', group: 98495, type: 'ERSA', industry: 'M', description: 'COVER:TYPE: HEAD NOSE, APPLICATION: FEMALE'},
  {master: 'ERSA', materailno: 12341095, message: 'Vendor has been created and sent for your approval', group: 98495, type: 'ERSA', industry: 'M', description: 'Be'},
  {master: 'ERSA', materailno: 12351094, message: 'materail has been created and sent for your approval', group: 98495, type: 'ERSA', industry: 'S', description: 'COVER:TYPE: HEAD NOSE, APPLICATION: FEMALE'},
];