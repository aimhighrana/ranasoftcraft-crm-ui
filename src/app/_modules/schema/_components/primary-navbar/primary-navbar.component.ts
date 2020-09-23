import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { HomeService } from '@services/home/home.service';


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

  /**
   * variable to store user details
   */
  userDetails: Userdetails = new Userdetails();

  notificationsCount = 0;
  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private sharedService: SharedServiceService,
    private router: Router,
    public homeService: HomeService
  ) { }

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));
    this.getNotificationsCount();
  }

  sendToParent(val: string) {
    this.emitAfterSel.emit(val);
  }

  /**
   * Function to show dialog
   */
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

  /**
   * Function to listen for the changes and
   * update the count
   */
  getNotificationsCount() {
    this.sharedService.updateNotifications
      .subscribe(() => {
        this.homeService.getNotificationCount(this.userDetails.userName).subscribe((notificationCount) => {
          this.notificationsCount = notificationCount.Count
        })
      })
  }

  /**
   * Function to open notification tray
   */
  openSystemTray() {
    this.router.navigate([{ outlets: { sb: ['sb', 'system-tray'] } }]);
  }
}
