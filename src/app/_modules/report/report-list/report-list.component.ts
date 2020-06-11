import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { ReportService } from '../_service/report.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Widget, ReportDashboardPermission } from '../_models/widget';
import { MatSnackBar } from '@angular/material/snack-bar';
export class ReportList {
  reportId: string;
  reportName: string;
  widgets: Widget[];
  permission: ReportDashboardPermission;
}
@Component({
  selector: 'pros-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Report List',
    links: []
  };

  reportList: ReportList[] = [];
  reportListOb: Observable<ReportList[]> = of([]);
  searchReportListCtrl: FormControl = new FormControl('');

  constructor(
    private reportService: ReportService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reportsList();
    this.searchReportListCtrl.valueChanges.subscribe(val=>{
      if(val && typeof val === 'string') {
        this.reportListOb = of(this.reportList.filter(fill => fill.reportName.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !==-1));
      } else {
        this.reportListOb = of(this.reportList);
      }
    });
  }

  reportsList() {
    this.reportService.reportList().subscribe(res=>{
      this.reportList = res;
      this.reportListOb = of(res);
    },error=>console.error(`Error : ${error}`));
  }

  delete(reportId: string) {
    this.reportService.deleteReport(reportId).subscribe(res=>{
      if(res) {
        this.snackbar.open(`Successfully Deleted`, 'Close',{duration:3000});
        this.reportsList();
      }
    },err=>console.error(`Error: ${err}`))
  }

}
