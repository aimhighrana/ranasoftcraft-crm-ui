import { Input, Output, EventEmitter } from '@angular/core';
import { Widget } from '../../../_models/widget';

export abstract class WidgetComponent{

  @Input()
  boxSize = 0;

  @Input()
  widget: Widget = new Widget();

  @Output()
  evtDelete: EventEmitter<Widget> = new EventEmitter<Widget>();

  @Output()
  evtStyle: EventEmitter<Widget> = new EventEmitter<Widget>();


  constructor() {

  }

  /**
   * Emit when click on remove icon
   */
  abstract emitDeleteEvent(): void;

  /**
   * Emit when click on widge so open the style widget
   */
  abstract emitStyleEvent(): void;


}
