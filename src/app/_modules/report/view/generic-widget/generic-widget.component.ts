import { Input, EventEmitter, Output } from '@angular/core';
import { Criteria, WidgetColorPalette, ReportDashboardPermission } from '../../_models/widget';
import { MatDialog } from '@angular/material/dialog';
import { WidgetColorPaletteComponent } from '@modules/report/edit/widget-color-palette/widget-color-palette.component';
import { BehaviorSubject } from 'rxjs';
export abstract class GenericWidgetComponent {

  @Input()
  reportId: number;

  @Input()
  widgetId: number;

  @Input()
  filterCriteria: Criteria[];

  @Input()
  permissons: ReportDashboardPermission;


  @Output()
  evtFilterCriteria: EventEmitter<Criteria[]> = new EventEmitter<Criteria[]>();

  public afterColorDefined: BehaviorSubject<WidgetColorPalette> = new BehaviorSubject<WidgetColorPalette>(null);

  /**
   * Define colors for stacked ..
   */
  widgetColorPalette: WidgetColorPalette;

  constructor(
    public matDialog?: MatDialog
  ){
    console.log(this.permissons);
  }

  /**
   * Emit filter criteria change
   */
  abstract emitEvtFilterCriteria(event: any): void;

  /**
   * Open the color palette for all widget dynamic
   */
  openColorPalette(req: WidgetColorPalette) {
    const dialogRef = this.matDialog.open(WidgetColorPaletteComponent, {
      height: '626px',
      width: '800px',
      disableClose: true,
      autoFocus: false,
      data:{
        widgetColorPalette: req
      }
    });
    if(dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        this.afterColorDefined.next(result);
      });
    }
  }

}
