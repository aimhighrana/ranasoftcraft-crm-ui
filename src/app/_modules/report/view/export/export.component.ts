import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WidgetService } from '@services/widgets/widget.service';

@Component({
  selector: 'pros-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  errorMsg: string;
  reportName: string;

  constructor(
    private widgetService: WidgetService,
    public dialogRef: MatDialogRef<ExportComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.reportName = data.reportName;
  }

  ngOnInit(): void {
  }

  onConfirm() {
    this.widgetService.exportReport(this.data.reportId).subscribe(res => {
      if (res.errorMsg) {
        this.errorMsg = `Unable to complete export: (${res.errorMsg})`;
      } else {
        this.dialogRef.close();
      }
    }, error => {
      if (error.error && error.error.errorMsg) {
        this.errorMsg = `Unable to complete export: (${error.error.errorMsg})`;
      } else if (error.error && error.error.error) {
        this.errorMsg = `Unable to complete export: (${error.error.error})`;
      } else {
        this.errorMsg = `Unable to complete export: (network error)`;
      }
    });
  }

  /**
   * Close dialog
   */
   close() {
    this.dialogRef.close();
  }
}
