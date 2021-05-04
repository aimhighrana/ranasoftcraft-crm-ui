import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pros-download-execution-data',
  templateUrl: './download-execution-data.component.html',
  styleUrls: ['./download-execution-data.component.scss']
})
export class DownloadExecutionDataComponent implements OnInit {

  selectedNodes: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<DownloadExecutionDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }


  /**
   * Close dialog after saved or click close
   */
   close(response?) {
    this.dialogRef.close(response);
  }

  /**
   * Method for download execution data
   */
   downloadExecutionDetails() {
     this.close(this.selectedNodes);
  }

  nodeSelectionChanged(nodeId) {
    const index = this.selectedNodes.findIndex(Id => Id === nodeId)
    if(index === -1) {
      this.selectedNodes.push(nodeId);
    } else {
      this.selectedNodes.splice(index, 1);
    }
  }

}
