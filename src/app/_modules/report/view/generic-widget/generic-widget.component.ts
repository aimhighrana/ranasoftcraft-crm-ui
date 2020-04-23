import { Input, EventEmitter, Output } from '@angular/core';
import { Criteria } from '../../_models/widget';
export abstract class GenericWidgetComponent {

  @Input()
  reportId: number;

  @Input()
  widgetId: number;

  @Input()
  filterCriteria: Criteria[];

  @Output()
  evtClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  evtFilterCriteria: EventEmitter<Criteria[]> = new EventEmitter<Criteria[]>();

  /**
   * Emit  onclick widget
   */
  abstract emitEvtClick(): void;

  /**
   * Emit filter criteria change
   */
  abstract emitEvtFilterCriteria(): void;

}
