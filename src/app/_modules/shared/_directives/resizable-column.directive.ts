import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[prosResizableColumn]'
})
export class ResizableColumnDirective implements OnInit {

  @Input() index: number;

  @Output() widthChanged = new EventEmitter<number>();

  private startX: number;

  private startWidth: number;

  private column: HTMLElement;

  private table: HTMLElement;

  private thead: HTMLElement;

  private pressed: boolean;

  private width: number;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
    this.renderer.addClass(this.column, 'resizable');
  }

  ngOnInit() {
      const row = this.renderer.parentNode(this.column);
      this.thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(this.thead);

      const resizer = this.renderer.createElement('span');
      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);

      this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
      this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
      this.renderer.listen('document', 'mouseup', this.onMouseUp);
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed && event.buttons) {

      this.renderer.addClass(this.table, 'resizing');

      // Calculate width of column
      this.width = this.startWidth + (event.pageX - this.startX - offset);

      const tableCells = Array.from(
        this.table.querySelectorAll('.mat-row')
      ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index));

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.width}px`);

      // Set table cells width
      for (const cell of tableCells) {
        this.renderer.setStyle(cell, 'width', `${this.width}px`);
      }
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
      if (this.width !== this.startWidth) {
        this.widthChanged.emit(this.width);
      }
    }
  };

}