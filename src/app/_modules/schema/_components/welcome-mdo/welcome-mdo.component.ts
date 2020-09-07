import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';

@Component({
  selector: 'pros-welcome-mdo',
  templateUrl: './welcome-mdo.component.html',
  styleUrls: ['./welcome-mdo.component.scss']
})
export class WelcomeMdoComponent implements OnInit {

  constructor(public matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openUploadScreen() {
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
