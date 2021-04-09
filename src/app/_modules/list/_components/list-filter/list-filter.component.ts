import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss']
})
export class ListFilterComponent implements OnInit {

  optionsList = [
    { label: 'Filters', value: 'value1' },
    { label: 'Classifications', value: 'value2' }
  ]

  rulelist = [
    { label: 'Is', value: 'value1' },
    { label: 'Is not', value: 'value2' }
  ]

  options = [
    {value: 'Today', key: 1},
    {value: 'Yesterday', key: 2},
    {value: 'Last 2 days', key: 3},
    {value: 'Last 3 days', key: 4},
    {value: 'Last 4 days', key: 5},
    {value: 'Last 5 days', key: 6},
    {value: 'Last 6 days', key: 8},
];

  constructor() { }

  ngOnInit(): void {
  }

}
