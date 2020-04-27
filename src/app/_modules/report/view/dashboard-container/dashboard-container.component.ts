import { Component, OnInit, Input, AfterViewInit, ElementRef, NgZone } from '@angular/core';
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

  screenWidth = 0;
  noOfboxes = 200; // Initial 200
  boxSize: number;

  widgetList: WidgetMapInfo[];
  filterCriteria: Criteria[] = [];

  constructor(
    private reportService: ReportService,
    private elementRef: ElementRef,
    private ngZone: NgZone
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
    this.filterCriteria = new Array();
    criteria.forEach(loop => this.filterCriteria.push(loop));
  }
}
