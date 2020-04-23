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

  screenWidth: number;
  noOfboxes = 200; // Initial 200
  boxSize: number;

  widgetList: WidgetMapInfo[];
  filterCriteria = [];

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
    console.log(criteria);
    const criteriaLst: Criteria[] = this.filterCriteria;
    this.ngZone.runOutsideAngular(()=>{
      criteria.forEach(cri=>{
        // if value is empty or null , it mean remove from criteria
        if(cri.conditionFieldValue && cri.conditionFieldValue.trim() !== '') {
          criteriaLst.push(cri);
        } else {
          const previousCri = criteriaLst.filter(fill => fill.conditionFieldId === cri.conditionFieldId);
          if(previousCri.length >0) {
            criteriaLst.splice(criteriaLst.indexOf(previousCri[0]),1);
          }
        }

      });
    });
    // create new Array instance for trigger ngOnChange on child component
    this.filterCriteria = new Array();
    criteriaLst.forEach(loop => this.filterCriteria.push(loop));
  }
}
