import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-mdo-generic-components',
  templateUrl: './mdo-generic-components.component.html',
  styleUrls: ['./mdo-generic-components.component.scss']
})
export class MdoGenericComponentsComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'position', 'name', 'weight', 'symbol', 'errorcell', 'warningcell', 'successcell', 'reviewcell'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  errorcell: string;
  warningcell: string;
  successcell: string;
  reviewcell: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' },
  {position: '', name: '', weight: '', symbol: '', reviewcell: '', errorcell: '', successcell: '', warningcell: '' }
];

