import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImportReport, ReportCategory } from '@modules/report/_models/widget';
import { WidgetService } from '@services/widgets/widget.service';
import { ConfirmationDialogComponent } from 'mdo-ui-library';

@Component({
  selector: 'pros-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  readonly ReportCategory = ReportCategory;

  uploadLoader = false;
  importData: ImportReport;
  isDuplicate: boolean;
  successful: boolean;
  displayedColumns: string[] = ['description', 'importedAt'];
  displayedColumnsEror: string[] = ['message', 'category'];
  dataSource: any[]
  isMissingModule: boolean;
  seletedFile: File;
  errorMsg: string;
  warningMessage:string;

  constructor(
    private widgetService: WidgetService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<ImportComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

  /**
   * Close dialog
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * When selecting a file
   */
  fileChange(fileList: FileList) {
    const file = fileList.item(0);
    const fileName = file?.name.toLocaleLowerCase();
    if (!file) {
      this.errorMsg = 'Unable to complete upload: (Select a file)';
    } else if (!fileName.endsWith('.mdopage')) {
      this.errorMsg = 'Unable to complete upload: (Incorrect file type)';
    } else {
      this.errorMsg = null;
      this.seletedFile = file;
      this.uploadLoader = true;
      this.dataSource = [{
        description: this.seletedFile.name,
        importedAt: new Date()
      }];
      this.dialogRef.disableClose = true;
    }
  }

  /**
   * Upload file
   */
  importReport() {
    this.widgetService.importUploadReport(this.seletedFile).subscribe(res => {
      this.importData = res

      if (!this.importData?.alreadyExits && this.importData?.acknowledge) {
        this.successful = true;
        this.dialogRef.close();
      }
    }, error => {
      this.importData = error.error;
      if (this.importData?.logs) {
        if (this.importData.logs?.some(s => s.category === ReportCategory.DUPLICATE_REPORT)) {
          this.isDuplicate = true;
          this.warningMessage = `An existing report shares the name ${this.seletedFile.name} . Duplicate or Replace`;
        } else if (this.importData.logs.some(s => s.category === ReportCategory.MISSING_MODULE)) {
          this.isMissingModule = true;
        } else if (this.importData.logs.some(s => s.category === ReportCategory.MISSING_FIELDS)) {
          this.isMissingModule = true;
        }
      } else {
        this.errorMsg = 'Error while importing file';
      }
    });
  }

  /**
   * On Back button click
   */
  back() {
    this.importData = undefined;
    this.dataSource = undefined;
    this.uploadLoader = false;
    this.successful = false;
    this.isDuplicate = false;
    this.isMissingModule = false;
    this.errorMsg = '';
    this.dialogRef.disableClose = false;
  }

  /**
   * Add report
   */
  addReport(replaceOld: boolean = false, keepCopy: boolean = false) {
    this.widgetService.importReport(this.importData.fileSno, replaceOld, keepCopy).subscribe(res => {
      this.dialogRef.addPanelClass('display-dialog');
      const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
        width: '600px',
        disableClose:true,
        data:   {
          dialogTitle:'Confirmation',
          label : 'Existing schedule will not be duplicated. Schedule will need to be reconfigued. '
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result  === 'yes'){
          this.close();
        } else {
          this.dialogRef.removePanelClass('display-dialog');
        }
      });
    });
  }
}
