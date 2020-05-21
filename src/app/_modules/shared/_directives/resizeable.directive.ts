import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[prosResizeable]'
})
export class ResizeableDirective implements OnInit {

  @Input() summaryShown;
  @Input() resizableGrabWidth = 2;
  @Input() resizableMinWidth = 10;

  dragging = false;
  constructor(public el: ElementRef) {

    function preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    }


    const newWidth = (wid) => {
      const updatedWidth = Math.max(this.resizableMinWidth, wid);
      el.nativeElement.style.width = (updatedWidth) + 'px';
    }

    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      newWidth(evt.clientX - el.nativeElement.offsetLeft)
      evt.stopPropagation();
    };

    // const dragMoveG = (evt) => {
    //   if (!this.dragging) {
    //     return;
    //   }
    //   const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - el.nativeElement.offsetLeft)) + 'px';
    //   el.nativeElement.style.width = (evt.clientX - el.nativeElement.offsetLeft) + 'px';
    //   evt.stopPropagation();
    // };


    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };

    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = 'col-resize';
      } else {
        el.nativeElement.style.cursor = 'default';
      }
    }
    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void {
    this.summaryShown.subscribe((value: boolean) => {
      this.el.nativeElement.style['border-right'] = value ? this.resizableGrabWidth + 'px solid rgba(0, 0, 0, 0.12)' : null;
    })
  }

  inDragRegion(evt) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
  }
}
