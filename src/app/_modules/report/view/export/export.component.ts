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
      if (res?.errorMsg) {
        this.errorMsg = `Unable to complete export: (${res.errorMsg})`;
      } else {
        if(res){
          this.downloadMDOReport(res,this.data.reportName);
        }
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

  private downloadMDOReport(response: any, reportName:string){
    const binaryData = [];
    const fileName = reportName.replace(/\s/g, '_')
    binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: '.mdopage'}));
    downloadLink.setAttribute('download', fileName +'.mdopage');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
