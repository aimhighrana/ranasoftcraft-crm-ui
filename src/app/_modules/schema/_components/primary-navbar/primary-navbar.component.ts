import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pros-primary-navbar',
  templateUrl: './primary-navbar.component.html',
  styleUrls: ['./primary-navbar.component.scss']
})
export class PrimaryNavbarComponent implements OnInit {

  @Output()
  emitAfterSel: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  sendToParent(val: string) {
    this.emitAfterSel.emit(val);
  }
}
