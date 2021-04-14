import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { WidgetService } from '@services/widgets/widget.service';

interface DuplicateDialogReq {
  reportName: string;
  reportId: string;
}

@Component({
  selector: 'pros-duplicate-report',
  templateUrl: './duplicate-report.component.html',
  styleUrls: ['./duplicate-report.component.scss']
})
export class DuplicateReportComponent implements OnInit {
  errorMsg: string;
  reportName: string;

  constructor(
    public dialogRef: MatDialogRef<DuplicateReportComponent>,
    private widgetService: WidgetService,
    private router: Router,
    private sharedService: SharedServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DuplicateDialogReq
  ) {
    this.reportName = 'Copy of ' + data.reportName;
  }

  ngOnInit(): void {
  }

  /**
   * Copy report and navigate over to dashboard-builder, or display error message.
   */
  onConfirm() {
    this.widgetService.copyReport(this.data.reportId, this.reportName).subscribe(res => {
      if (res.errorMsg) {
        this.errorMsg = `Unable to duplicate: (${res.errorMsg})`;
      } else {
        this.sharedService.setReportListData();
        this.sharedService.setTogglePrimaryEmit();
        this.router.navigate(['/home', 'report', 'dashboard-builder', res.reportId]);
        this.dialogRef.close();
      }
    }, error => {
      if (error.error && error.error.errorMsg) {
        this.errorMsg = `Unable to duplicate: (${error.error.errorMsg})`;
      } else {
        this.errorMsg = `Unable to duplicate: (${error.message})`;
      }
    })
  }

  /**
   * Close dialog
   */
  onCancel() {
    this.dialogRef.close();
  }
}
