import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';

@Component({
  selector: 'pros-primary-navbar',
  templateUrl: './primary-navbar.component.html',
  styleUrls: ['./primary-navbar.component.scss']
})
export class PrimaryNavbarComponent implements OnInit {
  @Output() emitAfterSel: EventEmitter<string> = new EventEmitter<string>();

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  sendToParent(val: string) {
    this.emitAfterSel.emit(val);
  }

  selectedModule(event) {
    switch (event) {
      case 'uploadDataset':
        const dialogRef = this.matDialog.open(UploadDatasetComponent, {
          height: '800px',
          width: '700px',
          data: {},
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
    }
  }
}
