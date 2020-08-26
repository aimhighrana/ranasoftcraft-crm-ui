import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-upload-dataset',
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.scss']
})
export class UploadDatasetComponent implements OnInit {
  displayedColumns: string[] = ['objectno', 'objecttype'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
export interface PeriodicElement {
  objecttype: string;
  objectno: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {objectno: 'Object type', objecttype: 'Bearing ball'},
  {objectno: 'Region', objecttype: 'Sydney'},
];