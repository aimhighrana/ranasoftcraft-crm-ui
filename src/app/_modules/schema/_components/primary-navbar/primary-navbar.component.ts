import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

@Component({
  selector: 'pros-primary-navbar',
  templateUrl: './primary-navbar.component.html',
  styleUrls: ['./primary-navbar.component.scss']
})
export class PrimaryNavbarComponent implements OnInit {
  @Output() emitAfterSel: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Emitter to emit sidebar toggleing
   */
  @Output() toggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  userDetails: Userdetails = new Userdetails();
  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private sharedService: SharedServiceService
  ) { }

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));
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
          this.sharedService.getSecondaryNavbarList();
        });
    }
  }

  toggleSideBar() {
    this.toggleEmitter.emit()
  }
}
