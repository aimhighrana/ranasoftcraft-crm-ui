import { Input, EventEmitter, Output, Component } from '@angular/core';
import { Criteria } from '../../_models/widget';

@Component({
  selector: 'pros-generic-widget',
  template: ''
})
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
