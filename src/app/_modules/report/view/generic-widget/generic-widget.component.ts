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
  evtFilterCriteria: EventEmitter<Criteria[]> = new EventEmitter<Criteria[]>();


  /**
   * Emit filter criteria change
   */
  abstract emitEvtFilterCriteria(event: any): void;

}