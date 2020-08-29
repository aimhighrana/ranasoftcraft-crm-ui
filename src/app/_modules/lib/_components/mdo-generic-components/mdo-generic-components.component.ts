import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'pros-mdo-generic-components',
  templateUrl: './mdo-generic-components.component.html',
  styleUrls: ['./mdo-generic-components.component.scss']
})
export class MdoGenericComponentsComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'position', 'name', 'weight', 'symbol', 'errorcell', 'warningcell', 'successcell', 'reviewcell'];
  dataSource = ELEMENT_DATA;


  componentName: string;

  // Form-input properties
  label = 'username';
  type = 'text';
  placeholder = 'Enter username here..';
  value = '';
  hint= 'This is hint to show user..';
  isHelpIcon = true;


  // Search bar properties
  searchPlaceholder = 'Search something here..'

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.componentName = params.id;
    })
  }


  getValue(data: string): void{
    this.value = data;
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
