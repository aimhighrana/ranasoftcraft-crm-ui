import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';
import { Subscription } from 'rxjs';
import { CustomNotification } from '@models/customNotification';
import { MatTabGroup } from '@angular/material/tabs';
import { HomeService } from '@services/home/home.service'
import { JobQueue } from '@models/jobQueue';
import { GlobaldialogService } from '@services/globaldialog.service';
@Component({
  selector: 'pros-system-tray',
  templateUrl: './system-tray.component.html',
  styleUrls: ['./system-tray.component.scss']
})
export class SystemTrayComponent implements OnInit, AfterViewInit {

  /**
   * Variable to store the user details
   */
  userDetails: Userdetails

  /**
   * notification subscription
   */
  notificationSubscription = new Subscription();

  /**
   * variable to store notifications
   */
  notifications: Array<CustomNotification> = [];

  /**
   * child object to access mat group events
   */
  @ViewChild('matTabgroup') mattabgroup: MatTabGroup;

  jobQueueData: JobQueue[] = [];

  notificationPagination = {
    from: 0,
    to: 10
  }

  /**
   * Constructor of class
   * @param router Router object
   * @param userService User service object
   */
  constructor(
    private router: Router,
    public globalDialogService: GlobaldialogService,
    public userService: UserService,
    public homeService: HomeService,
  ) { }

  /*
   * Angular hook
   */
  ngOnInit(): void {
    this.getUser();
    if (this.userDetails) {
      this.getNotifications();
    }
  }

  /**
   * Function to get User details
   */
  getUser() {
    this.userService.getUserDetails()
      .subscribe((user: Userdetails) => {
        this.userDetails = user;
      })
  }

  /**
   * Angular hook
   */
  ngAfterViewInit() {
    this.mattabgroup.selectedIndexChange
      .subscribe((index) => {
        switch (index) {
          case 0: this.getNotifications(); break;
          case 1: this.getJobsQueue(); break
        }
      })
  }

  /**
   * Function to get Notifications
   */
  getNotifications() {
    this.notificationSubscription = this.homeService
      .getNotifications(
        this.userDetails.userName,
        this.notificationPagination.from,
        this.notificationPagination.to
      )
      .subscribe((notifications: Array<CustomNotification>) => {
        notifications.forEach((notification) => {
          notification.showMore = false;
        })
        this.notifications = [...notifications];
      });
  }

  /**
   * function to get joba
   */
  getJobsQueue() {
    this.homeService.getJobQueue(this.userDetails.userName, this.userDetails.plantCode)
      .subscribe((jobs: JobQueue[]) => {
        this.jobQueueData.length = 0;
        jobs.forEach((job) => {
          job.initiatedBy = job.initiatedBy.split(' ').map(name => name[0]).join(' ');
        })
        this.jobQueueData.push(...jobs)
      })
  }

  /**
   * Function to update notification
   * @param notification the selection notification
   */
  updateNotification(notification: CustomNotification) {
    notification.msgUnread = '1';
    this.homeService.updateNotification([notification]).subscribe(() => {
      this.getNotifications();
    })
  }

  /**
   * Delete a notification
   * @param notificationid id of selected notification
   */
  deleteNotification(notificationid) {
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      if(response && response === 'yes') {
        const subscriber = this.homeService.deleteNotification([notificationid]).subscribe(() => {
          subscriber.unsubscribe();
          setTimeout(() => {
            this.getNotifications();
          }, 1000);
        });
      }
    });
  }

  /**
   * Function to paginate notifications
   */
  paginateNotification() {
    this.notificationPagination.from += 10
    this.notificationPagination.to += 10
    this.getNotifications()
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  download(link: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = `${link}`;
    downloadLink.setAttribute('target', '_blank');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
