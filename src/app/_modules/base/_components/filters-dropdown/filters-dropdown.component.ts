import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Filters } from '@models/task-list/filters';

@Component({
  selector: 'pros-filters-dropdown',
  templateUrl: './filters-dropdown.component.html',
  styleUrls: ['./filters-dropdown.component.scss']
})
export class FiltersDropdownComponent implements OnInit {
  // for recieving filters
  @Input() filters: Filters;

  // for emitting updated filters
  @Output() updateFilters: EventEmitter<Filters> = new EventEmitter<Filters>();

  // for closing filters
  @Output() closeFilterBox: EventEmitter<boolean> = new EventEmitter<boolean>();

  // flag for showing advanced filters
  showAdvancedFilters = false;
  /**
   * constructor of @class FiltersDropdownComponent
   */
  constructor() { }

  ngOnInit(): void { }

  /**
   * function to emit closure of filterbox
   */
  closeFilter() {
    this.closeFilterBox.emit(true);
  }

  /**
   * function to toggle advanced filters
   */
  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }
  /**
   * Common function to set the selected flag of array of list to be emitted to server
   * @param name the name of filter
   * @param value the selected value of the filer
   */
  setFilter(name: string, value) {
    // for mat-select
    const arrayFilters = ['priorities', 'statuses', 'regions', 'requested_by'];
    let selectedObject;

    if (arrayFilters.includes(name)) {
      this.filters[name].map((filter) => filter.selected = false);
      selectedObject = this.filters[name].find((filter) => filter.value === value.value.value);
    } else {
      this.filters[name].map((filter) => filter.selected = false);
      selectedObject = this.filters[name].find((filter) => filter.value === value);
    }
    selectedObject.selected = true;
  }

  /**
   * function to emit the updated filter to the parent class
   */
  updateFilter() {
    this.updateFilters.emit(this.filters);
  }
}
