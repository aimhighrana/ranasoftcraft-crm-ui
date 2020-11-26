import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pros-null-state',
  templateUrl: './null-state.component.html',
  styleUrls: ['./null-state.component.scss']
})
export class NullStateComponent implements OnInit {

  @Input()
  iconPath = './assets/images/empty-table.svg';

  @Input()
  iconWidth = 140;

  @Input()
  subtext = 'Nothing to see here';

  @Input()
  message = 'Your data check did not return any results. Please modify your parameters and try again.';

  @Input()
  button = {
    text: 'Check Data',
    icon: 'wand'
  };
  @Output()
  action: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  emitAction(){
    this.action.emit();
  }
}
