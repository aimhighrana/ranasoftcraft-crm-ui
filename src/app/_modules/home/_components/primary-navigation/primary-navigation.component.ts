import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Userdetails } from '@models/userdetails';
import { UploadDatasetComponent } from '@modules/schema/_components/upload-dataset/upload-dataset.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { HomeService } from '@services/home/home.service';
import { UserService } from '@services/user/userservice.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoadingService } from '@services/loading.service';
import { SchemaService } from '@services/home/schema.service';
import { CreateUpdateSchema } from '@modules/admin/_components/module/business-rules/business-rules.modal';
@Component({
  selector: 'pros-primary-navigation',
  templateUrl: './primary-navigation.component.html',
  styleUrls: ['./primary-navigation.component.scss']
})
export class PrimaryNavigationComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  /**
   * To apply the CSS class on selection of primary navigation
   */
  isNavSelected = ''

  udSub: Subscription;
  userDetails: Userdetails = new Userdetails();


  /**
   * flag to check if secondary sidebar is opened
   */
  secondarySideBarOpened = true;

  /**
   * sidebar content viewchild
   */
  @ViewChild('secondaryContent') secondaryContent: MatSidenavContent;

  /**
   * grabber content viewchild
   */
  @ViewChild('grabberElement') grabberElement: ElementRef<HTMLElement>;

  /**
   * flag to enable/disable resizable
   */
  grab = false;

  /**
   * cursor when enable/disable resizable
   */
  grabCursor = 'default';

  /**
   * Subject for notify localstorage for mdo nav state  state ..
   */
  private appStateSubject: BehaviorSubject<boolean> = new BehaviorSubject(null);

  /**
   * To store count of notifications
   */
  notificationsCount = 0;
  previousSideNavigationWidth : number;
  constructor(
    private userService: UserService,
    public matDialog: MatDialog,
    private sharedService: SharedServiceService,
    private router: Router,
    public homeService: HomeService,
    private loadingService: LoadingService,
    private schemaService: SchemaService
  ) { }

  ngOnInit(): void {
    this.getMdoState();

    this.udSub = this.userService.getUserDetails().subscribe(
      (response: Userdetails) => {
        this.userDetails = response;
      }, error => console.error(`Error : ${error.message}`)
    );

    this.appStateSubject.subscribe(res => {
      if (res) {
        const state = {
          isSecondaryOpen: this.secondarySideBarOpened
        };
        try {
          localStorage.setItem('mdo-state', btoa(JSON.stringify(state)));
        } catch (ex) { console.error(`Error while set application state .. `) };
      }
    });
    this.getNotificationsCount();
    const currentUrl = this.router.url;
    this.checkNavOnReload(currentUrl);
  }

  ngAfterViewInit() {
    this.previousSideNavigationWidth =  this.secondaryContent.getElementRef().nativeElement.clientWidth;
  }

/**
 * angular hooks
 */
  ngAfterViewChecked() {
    const currentWidth = this.secondaryContent.getElementRef().nativeElement.clientWidth;
    if(currentWidth !== this.previousSideNavigationWidth) {
      this.previousSideNavigationWidth = currentWidth;
      this.sharedService.setSecondarySideNavBarState(this.secondarySideBarOpened);
    }
  }
  ngOnDestroy() {
    this.udSub.unsubscribe();
    this.appStateSubject.complete();
    this.appStateSubject.unsubscribe();
  }

  /**
   * Get state from local storage
   */
  getMdoState() {
    try {
      const appState = localStorage.getItem('mdo-state');
      if (appState) {
        const json = JSON.parse(atob(appState));
        const secondaryNav: boolean = json.isSecondaryOpen ? json.isSecondaryOpen : false;
        this.secondarySideBarOpened = secondaryNav;
      }
    } catch (ex) {
      // console.error(`Error while getting state from localstorage .. ${ex}`)
    }
  }

  isLoading() {
    return this.loadingService.isLoading();
  }


  /**
   * Get selected role description
   */
  get selectedRoleDesc(): string {
    if (this.userDetails.currentRoleId) {
      const selRole = this.userDetails.assignedRoles.filter(fil => fil.roleId === this.userDetails.currentRoleId)[0];
      return selRole ? selRole.roleDesc : this.userDetails.currentRoleId;
    }
    return '';
  }

  /**
   * function to enable resizable
   */
  resizableMousedown(evt: MouseEvent) {
    this.grab = true;
    this.grabCursor = 'col-resize';
    document.body.style.cursor = this.grabCursor;
    if ((document as any).selection) {
      (document as any).selection.empty()
    } else {
      window.getSelection().removeAllRanges()
    }
  }

  /**
   * function to resize on resizable
   */
  resizableMousemove(evt: MouseEvent) {
    if (this.grab) {
      const newWidth = evt.clientX - 75 - (this.grabberElement.nativeElement.offsetWidth / 2);
      const widthPercent = ((window.innerWidth - newWidth) / window.innerWidth * 100);
      if (widthPercent > 70 && widthPercent < 94) {
        document.getElementById('secondarySidenav').style.width = newWidth + 'px';
        document.getElementById('secondaryContent').style.marginLeft = newWidth+10+'px';
        this.sharedService.setSecondarySideNavBarState(this.secondarySideBarOpened);
      }
    }
  }

  /**
   * function to disable resizable
   */
  resizableMouseup(evt: MouseEvent) {
    this.grab = false;
    this.grabCursor = 'default';
    document.body.style.cursor = this.grabCursor;
  }


  /**
   * function to modify the width of secondary sidebar
   */
  toggleSecondarySideBar() {
    console.log('secondaryContentet', this.secondaryContent);
    this.secondarySideBarOpened = !this.secondarySideBarOpened;
    this.sharedService.setSecondarySideNavBarState(this.secondarySideBarOpened);
    this.appStateSubject.next(true);
  }


  /**
   * function to send navigation value to parent..
   * @param val navigation value..
   */
  sendToParent(val: string) {
    this.isNavSelected = val;
    if (val === 'welcome') {
        this.router.navigate(['/home/dash/welcome'])
    }
  }

  /**
   * function to check for navigation selection on reloading page
   * @param url current url
   */
  checkNavOnReload(url: string) {
    if (url.includes('/home/dash/welcome') || url.includes('/home/schema/schema-details')) {
      this.isNavSelected = 'welcome'
    }else if (url.includes('/home/report')) {
      this.isNavSelected = 'report';
    }else if (url.includes('/home/schema')) {
      this.isNavSelected = 'schema';
    }else {
      this.isNavSelected = 'list';
    }
  }

  /**
   * Function to listen for the changes and
   * update the count
   */
  getNotificationsCount() {
     this.sharedService.updateNotifications.subscribe(() => {
        this.homeService.getNotificationCount(this.userDetails.userName).subscribe((nCount) => {
          this.notificationsCount = nCount.Count
        })
    })
  }

  /**
   * Function to show dialog
   */
  selectedModule(event) {
    if (!event) {
      const dialogRef = this.matDialog.open(UploadDatasetComponent, {
        height: '800px',
        width: '800px',
        data: { selecteddata: event },
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        this.sharedService.getSecondaryNavbarList();
      });
    } else {
      const param: any = {
        moduleId: event.objectid,
        schemaId: event.schemaId ? event.schemaId : null,
        moduleDesc: event.objectdesc
      }
      this.createSchema(param);
    }
  }

  /**
   * Function to open notification tray
   */
  openSystemTray() {
    this.router.navigate([{ outlets: { sb: ['sb', 'system-tray'] } }]);
  }

  /**
   * Function to create new schema
   * @param moduleId: module Id
   */
  createSchema({ moduleId, schemaId, moduleDesc }) {
    if (moduleId && schemaId) {
      this.router.navigate([{ outlets: { sb: `sb/schema/check-data/${moduleId}/${schemaId}` } }], { queryParams: { name: moduleDesc } })
    }
    if (moduleId && !schemaId) {
      const schemaReq: CreateUpdateSchema = new CreateUpdateSchema();
      schemaReq.moduleId = moduleId;
      schemaReq.discription = 'New schema';
      this.schemaService.createUpdateSchema(schemaReq).subscribe((response) => {
        const receivedSchemaId = response;
         this.router.navigate(
           [`/home/schema/schema-info/${moduleId}/${receivedSchemaId}`],
           { queryParams: {isCheckData: false} }
         );
      }, (error) => {
        console.log('Something went wrong while creating schema', error.message);
      });
    }
  }

  /**
   * Signout ...
   */
  signOut() {
    try {
      delete localStorage['JWT-TOKEN'];
      delete localStorage['JWT-REFRESH-TOKEN'];
    } finally {
      this.router.navigate(['auth', 'login']);
    }
  }

  /**
   * Open settings sidesheet
   */
  openSettings() {
    this.router.navigate([{ outlets: { sb: `settings` } }]);
  }
}
