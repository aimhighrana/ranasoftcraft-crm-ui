import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';
import { ReportService } from '../../_service/report.service';
import { WidgetMapInfo, Criteria } from '../../_models/widget';

@Component({
  selector: 'pros-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit, AfterViewInit {

  @Input()
  reportId: number;

  screenWidth: number;
  noOfboxes = 200; // Initial 200
  boxSize: number;

  widgetList: WidgetMapInfo[];
  filterCriteria: Criteria[];

  constructor(
    private reportService: ReportService,
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    if(this.elementRef.nativeElement) {
      this.screenWidth = this.elementRef.nativeElement.offsetWidth;
      this.boxSize = this.screenWidth / this.noOfboxes;
    }
  }

  ngOnInit(): void {
    if(this.reportId) {
      this.reportService.getReportInfo(this.reportId).subscribe(res=>{
        this.widgetList = res.widgets;
      },error=>{
        console.log(`Error ${error}`);
      })
    }
  }

  click(data: any) {
    console.log(data);
  }

  changeFilterCriteria(criteria: Criteria[]) {
    this.filterCriteria = criteria;
  }
}
