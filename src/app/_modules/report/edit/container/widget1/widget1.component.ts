import { Component, OnInit } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';

@Component({
  selector: 'pros-widget1',
  templateUrl: './widget1.component.html',
  styleUrls: ['./widget1.component.scss']
})
export class Widget1Component extends  WidgetComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  emitDeleteEvent(): void {
    throw new Error('Method not implemented.');
  }
  emitStyleEvent(): void {
    throw new Error('Method not implemented.');
  }



}
