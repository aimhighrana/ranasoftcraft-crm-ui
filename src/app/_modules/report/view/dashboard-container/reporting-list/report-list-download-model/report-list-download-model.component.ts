import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportingListComponent } from '../reporting-list.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pros-report-list-download-model',
  templateUrl: './report-list-download-model.component.html',
  styleUrls: ['./report-list-download-model.component.scss']
})
export class ReportListDownloadModelComponent implements OnInit {

  pages: string[] = [];

  pageCtrl: FormControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ReportingListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    if(this.data && this.data.recCount) {
      if(this.data.recCount%5000 === 0) {
        const page = this.data.recCount / 5000;
        for(let i=0;i<page;i++) {
          if(i===0) {
            this.pages.push(`${i * 5} - ${(i+1) * 5}K`);
          } else {
            this.pages.push(`${i *5 }K - ${(i+1) * 5}K`);
          }
        }
      } else {
        const page = parseInt(String(this.data.recCount / 5000), 10) + 1;
        for(let i=0;i<page;i++) {
          if(i===0) {
            this.pages.push(`${i * 5} - ${(i+1) * 5}K`);
          } else {
            this.pages.push(`${i * 5}K - ${(i+1) * 5}K`);
          }
        }
      }
    }

  }

  /**
   * Close dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Download data for this page
   */
  download() {
    this.dialogRef.close(this.pageCtrl.value);
  }

}
