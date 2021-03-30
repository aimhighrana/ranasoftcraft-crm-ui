import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  materialnumber: string;
  materialdescription: string;
  materialtype: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {materialnumber: 'ERSA2925', materialdescription: 'BRG,BALL,ANNU', materialtype: 'ERSA-Spare part',},
  {materialnumber: 'ERSA2925', materialdescription: 'BRG,BALL,ANNU,6319,DBL', materialtype: 'ERSA-Spare part',},
  {materialnumber: 'ERSA2924', materialdescription: 'BRG,BALL,ANNU 100MM', materialtype: 'VERP-packaging',},

];

@Component({
  selector: 'pros-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  displayedColumns: string[] = ['materialnumber', 'materialdescription', 'materialtype',];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
