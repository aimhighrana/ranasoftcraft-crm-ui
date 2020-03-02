import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
@Component({
  selector: 'pros-schema-tile',
  templateUrl: './schema-tile.component.html',
  styleUrls: ['./schema-tile.component.scss']
})
export class SchemaTileComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  bottomLeftLabel: string;
  @Input()
  bottomRightLabel: string;

  @Input()
  info: boolean;
  @Input()
  edit: boolean;
  @Input()
  delete: boolean;
  @Input()
  pulse: boolean;

  @Output()
  evtEdit = new EventEmitter();
  @Output()
  evtDelete = new EventEmitter();
  @Output()
  evtBottomLeft = new EventEmitter();
  @Output()
  evtBottomRight = new EventEmitter();
  @Output()
  evtInfo = new EventEmitter();

  @Input()
  totalValue: number;
  @Input()
  successValue: number;
  @Input()
  errorValue: number;
  @Input()
  skippedValue: number;
  @Input()
  correctionValue: number;
  @Input()
  duplicateValue: number;

  @Input()
  totalUniqueValue: number;
  @Input()
  successUniqueValue: number;
  @Input()
  errorUniqueValue: number;
  @Input()
  skippedUniqueValue: number;

  @Input()
  successTrendValue: number;
  @Input()
  errorTrendValue: number;

  @Input()
  timestamp: string; // this should be date

  showingErrors = true;
  showUnique = false;

  constructor() { }

  ngOnInit() {
  }

  public percentageErrorStr(): number {
    const num = this.showUnique ? (this.totalUniqueValue > 0 ? this.errorUniqueValue / this.totalUniqueValue : 0) : (this.totalValue > 0 ? this.errorValue / this.totalValue : 0);
    return Math.round((num + Number.EPSILON) * 100 * 100) / 100;
  }

  public percentageSuccessStr(): number {
    const num = this.showUnique ? (this.totalUniqueValue > 0 ? this.successUniqueValue / this.totalUniqueValue : 0) : (this.totalValue > 0 ? this.successValue / this.totalValue : 0);
    return Math.round((num + Number.EPSILON) * 100 * 100) / 100;
  }

  public toggle() {
    this.showingErrors = !this.showingErrors;
  }

  public toggleUnique(evt: MatSlideToggleChange) {
    this.showUnique = evt.checked;
  }

  public onEdit() {
    return this.evtEdit.emit();
  }

  public onDelete() {
    return this.evtDelete.emit();
  }

  public onBottomLeft() {
    return this.evtBottomLeft.emit();
  }

  public onBottomRight() {
    return this.evtBottomRight.emit();
  }

  public onInfo() {
    return this.evtInfo.emit();
  }

}
