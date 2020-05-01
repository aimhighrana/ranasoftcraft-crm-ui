import { Component, OnInit, Input, EventEmitter, Output, NgZone } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Widget } from '../../_models/widget';
import { Breadcrumb } from 'src/app/_models/breadcrumb';

@Component({
  selector: 'pros-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Dashboard Builder',
    links: []
  };


  screenWidth: number;
  pixcel = 100; // Initial 200
  eachBoxSize = 0;

  @Input()
  widgetList: Widget[] = [];

  @Output()
  emitChangedPosition: EventEmitter<Widget[]> = new EventEmitter<Widget[]>();

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    const screenWidth = document.body.offsetWidth;
    this.screenWidth  = screenWidth;
    this.eachBoxSize = this.screenWidth / this.pixcel;
    console.log(`Screen width : ${screenWidth}`);
    console.log(`eachBoxSize : ${this.eachBoxSize}`);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    const movedX = event.distance.x;
    const movedY = event.distance.y;
    console.log(event.item.element.nativeElement);
    console.log(`Moved x: ${movedX} , and moved y : ${movedY}`);
    const dropableWidget  =  this.widgetList.filter(wid => wid.widgetId === event.item.element.nativeElement.id)[0];
    const boxX = Math.round(((dropableWidget.x * this.eachBoxSize) + movedX) / this.eachBoxSize);
    const boxY = Math.round(((dropableWidget.y * this.eachBoxSize) + movedY) / this.eachBoxSize);
    if(boxX >=0 && (boxX * this.eachBoxSize) <= this.screenWidth) {
      dropableWidget.x = boxX;
      dropableWidget.y = boxY;
      this.preapreNewWidgetPosition(dropableWidget);
    }
  }

  preapreNewWidgetPosition(dropableWidget: Widget) {
    this.ngZone.runOutsideAngular(()=>{
      const oldWidget  =  this.widgetList.filter(wid => wid.widgetId === dropableWidget.widgetId)[0];
      this.widgetList.splice(this.widgetList.indexOf(oldWidget),1);
      this.widgetList.push(dropableWidget);
      this.emitChangedPosition.emit(this.widgetList);
    });
  }

}
