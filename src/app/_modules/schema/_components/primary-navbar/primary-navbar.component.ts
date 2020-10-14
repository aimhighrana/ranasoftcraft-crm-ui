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


  /**
   * To store count of notifications
   */
  notificationsCount = 0;

  /**
   * To apply the CSS class on selection of primary navigation
   */
  isNavSelected = ''

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

    const currentUrl = this.router.url;
    this.checkNavOnReload(currentUrl);
  }

  /**
   * function to send navigation value to parent..
   * @param val navigation value to be emitted..
   */
  sendToParent(val: string) {
    this.emitAfterSel.emit(val);
    this.isNavSelected = val;
    if (val === 'welcome') {
      this.router.navigate(['/home/dash/welcome'])
    }
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

  /**
   * function to check for navigation selection on reloading page
   * @param url current url
   */
  checkNavOnReload(url: string){
    if (url.includes('/home/dash/welcome')) {
      this.isNavSelected = 'welcome'
    }
    if (url.includes('/home/report')) {
      this.isNavSelected = 'report';
    }
    if (url.includes('/home/schema')) {
      this.isNavSelected = 'schema';
    }
  }
}
