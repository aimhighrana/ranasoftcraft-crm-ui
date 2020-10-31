import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../_service/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  reportId: number;
  emitClearBtnEvent: boolean;
  showClearFilterBtn = false;
  reportName: string;
  collaboratorEditPermission: false ;
  collaboratorDeletePermission: false ;
  collaboratorAdminPermission: false ;

  /**
   * If is from msteam then don't need edit and delete ..
   */
  isFromMsteam = false;

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRouter: ActivatedRoute,
    public reportService: ReportService,
    private snackbar: MatSnackBar,
    private sharedService: SharedServiceService,
    private router: Router,
    private globalDialogService: GlobaldialogService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params=>{
      this.reportId = params.id;
      if(this.reportId) {
        this.emitClearBtnEvent = false ;
        this.showClearFilterBtn = false ;
        this.getReportInfo(this.reportId);
      }
    });

    const isFrmMsteam = this.sharedService.getIsFromMsTeamLogedIn().subscribe(res=>{
      this.isFromMsteam = res;
    });

    if(window.location  && window.location.href && window.location.href.indexOf('nonav') !==-1) {
      this.isFromMsteam = true;
    }
    this.subscriptions.push(isFrmMsteam);
  }

  getReportInfo(reportId: number) {
    const repInfo = this.reportService.getReportInfo(reportId).subscribe(res=>{
      this.reportName = res.reportName;
      this.collaboratorEditPermission = res.permissons ? res.permissons.isEditable : false;
      this.collaboratorDeletePermission = res.permissons ? res.permissons.isDeleteable : false;
      this.collaboratorAdminPermission = res.permissons ? res.permissons.isAdmin : false;

    },error=>{
      console.log(`Error ${error}`);
    });
    this.subscriptions.push(repInfo);
  }

  clearFilters() {
    this.emitClearBtnEvent =  true;
  }

  showClearBtnEmit(isTrue: boolean) {
    setTimeout(() => this.showClearFilterBtn = isTrue, 50)
    if (isTrue){
      this.emitClearBtnEvent = false ;
    }
  }

  delete() {
    this.globalDialogService.confirm({label:'Are you sure to delete ?'}, (response) =>{
      if(response && response === 'yes') {
        this.reportService.deleteReport((this.reportId.toString())).subscribe(res=>{
          if(res) {
            this.sharedService.setReportListData();
            this.snackbar.open(`Successfully Deleted`, 'Close',{duration:3000});
          }
        },err=>console.error(`Error: ${err}`))
      }
    });
  }

  editReport() {
    this.sharedService.setTogglePrimaryEmit();
    this.router.navigate(['/home', 'report', 'dashboard-builder', this.reportId.toString()]);
  }

}
