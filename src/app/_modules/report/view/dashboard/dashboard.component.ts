import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../_service/report.service';
@Component({
  selector: 'pros-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Report Dashboard',
    links: []
  };

  reportId: number;
  emitClearBtnEvent: boolean;
  showClearFilterBtn = false;
  constructor(
    private activatedRouter: ActivatedRoute,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params=>{
      this.reportId = params.id;
    });
    if(this.reportId) {
      this.getReportInfo(this.reportId);
    }
  }

  getReportInfo(reportId: number) {
    this.reportService.getReportInfo(reportId).subscribe(res=>{
      console.log(res);
      this.breadcrumb.heading = res.reportName;
    },error=>{
      console.log(`Error ${error}`);
    })
  }

  clearFilters() {
    this.emitClearBtnEvent =  this.emitClearBtnEvent ? false : true;
  }

  showClearBtnEmit(isTrue: boolean) {
    this.showClearFilterBtn = isTrue;
  }

}
