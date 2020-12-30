import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { HomeService } from '@services/home/home.service';
import { SchemaService } from '@services/home/schema.service';
import { CreateUpdateSchema } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';


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

  /**
   * Only information about active profile menues ..
   */
  profileMenu = [{id:'signout', name:'Sign out'}];
  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private sharedService: SharedServiceService,
    private router: Router,
    public homeService: HomeService,
    private schemaService: SchemaService
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
    if(!event) {
      const dialogRef = this.matDialog.open(UploadDatasetComponent, {
        height: '800px',
        width: '800px',
        data: {selecteddata:event},
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.sharedService.getSecondaryNavbarList();
      });
    } else {
      const param = {
        moduleId: event.objectid,
        schemaId: event.schemaId? event.schemaId: null
      }
      this.createSchema(param);
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
    if (url.includes('/home/dash/welcome') || url.includes('/home/schema/schema-details')) {
      this.isNavSelected = 'welcome'
    }
    else if (url.includes('/home/report')) {
      this.isNavSelected = 'report';
    }
    else if (url.includes('/home/schema')) {
      this.isNavSelected = 'schema';
    }
    this.emitAfterSel.emit(this.isNavSelected);
  }

  /**
   * Signout ...
   */
  signOut() {
    try {
      delete localStorage['JWT-TOKEN'];
      delete localStorage['JWT-REFRESH-TOKEN'];
    }finally {
      this.router.navigate(['auth','login']);
    }
  }

  /**
   * Function to create new schema
   * @param moduleId: module Id
   */
  createSchema({moduleId, schemaId}) {
    if(moduleId && schemaId){
      this.router.navigate([{outlets: {sb: `sb/schema/check-data/${moduleId}/${schemaId}`}}])
    }
    if(moduleId && !schemaId){
      const schemaReq: CreateUpdateSchema = new CreateUpdateSchema();
      schemaReq.moduleId = moduleId;
      schemaReq.discription = 'New schema';
      this.schemaService.createUpdateSchema(schemaReq).subscribe((response) => {
        if(response) {
          schemaId = response;
          this.router.navigate([{outlets: {sb: `sb/schema/check-data/${moduleId}/${schemaId}`}}]);
        }
      }, (error)=>{
        console.log('Something went wrong while creating schema', error.message);
      })
    }
  }
}
