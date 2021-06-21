import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  schema: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {schema: 'Schema A', name: 'Today'},
  {schema: 'Schema B', name: 'Yesterday'},
  {schema: 'Schema C', name: 'Never'},
  {schema: 'Schema D', name: 'Never'},
];

@Component({
  selector: 'pros-schema-migration',
  templateUrl: './schema-migration.component.html',
  styleUrls: ['./schema-migration.component.scss']
})
export class SchemaMigrationComponent implements OnInit {

  displayedColumns: string[] = ['schema', 'name', 'icon'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
