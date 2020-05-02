import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { ReportService } from '../_service/report.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
export class ReportList {
  reportId: string;
  reportName: string;
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
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.reportService.reportList().subscribe(res=>{
      this.reportList = res;
      this.reportListOb = of(res);
    },error=>console.error(`Error : ${error}`));

    this.searchReportListCtrl.valueChanges.subscribe(val=>{
      if(val && typeof val === 'string') {
        this.reportListOb = of(this.reportList.filter(fill => fill.reportName.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !==-1));
      } else {
        this.reportListOb = of(this.reportList);
      }
    });
  }

}
