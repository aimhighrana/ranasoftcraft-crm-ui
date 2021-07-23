import { Component, OnInit, ViewChild } from '@angular/core';
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
export class SystemTrayComponent implements OnInit {

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
   * loader for notifications
   */
  loader: boolean;

  /**
   * child object to access mat group events
   */
  @ViewChild('matTabgroup') mattabgroup: MatTabGroup;

  jobQueueData: JobQueue[] = [];

  notificationPagination = {
    from: 0,
    to: Math.round(window.innerHeight / 50 * 1.5),
    offset: Math.round(window.innerHeight / 50 * 1.5)
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
  }

  /**
   * Function to get User details
   */
  getUser() {
    this.userService.getUserDetails()
      .subscribe((user: Userdetails) => {
        this.userDetails = user;
        this.getNotifications();
      })
  }

  /**
   * Fire event on tab index change
   * @param currentindex pass the current Index
   */
  indexChange(currentindex: number) {
    currentindex === 0? this.getNotifications(): this.getJobsQueue()
  }

  /**
   * Function to get Notifications
   */
  getNotifications(reload = true) {
    if (reload) {
      this.notificationPagination.from = 0;
      this.notificationPagination.to = this.notificationPagination.offset;
    }
    this.loader = true;
    this.notificationSubscription = this.homeService
      .getNotifications(
        this.userDetails.userName,
        this.notificationPagination.from,
        this.notificationPagination.to
      )
      .subscribe((notifications: Array<CustomNotification>) => {
        this.loader = false;
        notifications.forEach((notification) => {
          notification.showMore = false;
        })
        if (reload) {
          this.notifications = [...notifications];
        } else {
          this.notifications.push(...notifications);
        }
      }, () => {
        this.loader = false;
      });
  }

  /**
   * function to get joba
   */
  getJobsQueue() {
    this.loader = true;
    this.homeService.getJobQueue(this.userDetails.userName, this.userDetails.plantCode)
      .subscribe((jobs: JobQueue[]) => {
        this.loader = false;
        this.jobQueueData.length = 0;
        jobs.forEach((job) => {
          job.initiatedBy = job.initiatedBy.split(' ').map(name => name[0]).join(' ');
        })
        this.jobQueueData.push(...jobs)
      }, () => {
        this.loader = false;
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
  deleteNotification(notificationid: string) {
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      if (response && response === 'yes') {
        const subscriber = this.homeService.deleteNotification([notificationid]).subscribe(() => {
          this.getNotifications();
          subscriber.unsubscribe();
        });
      }
    });
  }

  /**
   * identify unique items and update on change
   */
  trackByFn(index: number, item: CustomNotification) {
    return item?.id;
  }

  /**
   * Function to paginate notifications
   */
  paginateNotification() {
    this.notificationPagination.from += this.notificationPagination.offset;
    this.notificationPagination.to += this.notificationPagination.offset;
    this.getNotifications(false);
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
