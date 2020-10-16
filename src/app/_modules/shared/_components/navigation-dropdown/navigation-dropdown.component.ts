import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pros-navigation-dropdown',
  templateUrl: './navigation-dropdown.component.html',
  styleUrls: ['./navigation-dropdown.component.scss']
})
export class NavigationDropdownComponent implements OnInit, OnChanges {

  @Input() modules = [];
  @Output() selectedModule = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
    console.log('modules :: '+ this.modules);
  }

  emitSelection(selection) {
    this.selectedModule.emit(selection)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.value && changes.value.previousValue !== changes.value.currentValue) {
      this.selectedModule.emit(changes.value)
    }
  }

}
