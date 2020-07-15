import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {
  displayedColumns: string[] = ['attribute', 'shortvalue', 'uom', 'add'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }
}

export interface PeriodicElement {
  attribute: string;
  shortvalue: string;
  uom: string;
  add: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {attribute: 'Type', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Nominal Size', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Outside Diameter', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Inside Diameter', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Material', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Wall Thickness', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Schedule', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Pressure Rating', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Weight', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'Material Specification', shortvalue: 'H', uom: 'H', add:'H'},
  {attribute: 'End Connection', shortvalue: 'H', uom: 'H', add:'H'},
];