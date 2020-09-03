import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WidgetService } from '@services/widgets/widget.service';
import { BehaviorSubject } from 'rxjs';
import { LayoutTabResponse, MDORECORDESV3 } from '@modules/report/_models/widget';

@Component({
  selector: 'pros-summary-layout',
  templateUrl: './summary-layout.component.html',
  styleUrls: ['./summary-layout.component.scss']
})
export class SummaryLayoutComponent implements OnInit {

  widgetId: string;
  objectNumber: string;
  layoutData:MDORECORDESV3;
  layoutMetadata: BehaviorSubject<LayoutTabResponse[]> = new BehaviorSubject<LayoutTabResponse[]>(null);

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private widgetService:WidgetService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(param => {
      this.widgetId = param.widgetId;
      this.objectNumber = param.objectNumber;
      console.log(this.widgetId,this.objectNumber);
    });
     this.getLayoutMetadata(this.widgetId,this.objectNumber);
      this.layoutMetadata.subscribe(data=>{
        if(data){
           this.getlayoutData(this.widgetId,this.objectNumber);
        }
      })
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

/**
 * Method to get layout metadata based on widgetId and objectNumber
 */

  getLayoutMetadata(widgetId:string,objectNumber:string):void{
    this.widgetService.getLayoutMetadata(widgetId,objectNumber).subscribe(data=>{
      console.log(data);
      this.layoutMetadata.next(data);
    },error=>console.error(`Error : ${error}`));
  }

  /**
   * Method to get layout data based on widgetId and objectNumber
   */

  getlayoutData(widgetId:string,objectNumber:string):void{
    this.widgetService.getlayoutData(widgetId,objectNumber).subscribe(data=>{
      this.layoutData = data;
      console.log(this.layoutData);
    },error=>console.error(`Error : ${error}`));
  }

}
