import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
import { LoadingService } from 'src/app/_services/loading.service';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
@Component({
  selector: 'pros-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  udSub: Subscription;
  userDetails: Userdetails = new Userdetails();;

  activatedPrimaryNav = 'welcome';

  /**
   * flag to check if primary sidebar is opened
   */
  primarySideBarOpened = true;

  /**
   * flag to check if secondary sidebar is opened
   */
  secondarySideBarOpened = true;

  /**
   * child element of primary sidebar
   */
  @ViewChild('primarySidenav') primarySidenav: MatSidenav;

  /**
   * sidebar content viewchild
   */
  @ViewChild('secondaryContent') secondaryContent: MatSidenavContent;

  /**
   * flag to enable/disable resizeable
   */
  grab = false;

  /**
   * constructor of class
   * @param userService User service object
   * @param loadingService Loading service object
   */
  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.udSub = this.userService.getUserDetails().subscribe(
      (response: Userdetails) => {
        this.userDetails = response;
      }
    );
  }

  ngAfterViewInit() {
    this.enableResizeable();
  }

  isLoading() {
    return this.loadingService.isLoading();
  }

  ngOnDestroy() {
    this.udSub.unsubscribe();
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
   * function to modify the width of primary sidebar
   */
  togglePrimarySideBar() {
    if (this.primarySideBarOpened) {
      document.getElementById('primarySidenav').style.width = '73px';
      document.getElementById('primaryContent').style.marginLeft = '73px';
      this.primarySideBarOpened = false;
    } else {
      document.getElementById('primarySidenav').style.width = '200px';
      document.getElementById('primaryContent').style.marginLeft = '199px';
      this.primarySideBarOpened = true;
    }
  }

  /**
   * function to modify the width of secondary sidebar
   */
  toggleSecondarySideBar() {
    if (this.secondarySideBarOpened) {
      document.getElementById('secondarySidenav').style.width = '16px';
      document.getElementById('secondaryContent').style.marginLeft = '73px';
      this.secondarySideBarOpened = false;
    } else {
      document.getElementById('secondarySidenav').style.width = '264px';
      document.getElementById('secondaryContent').style.marginLeft = '199px';
      this.secondarySideBarOpened = true;
    }
  }

  /**
   * function to enable resizeable
   */
  enableResizeable() {
    const sidebar = document.getElementById('secondarySidenav')
    const content = this.secondaryContent.getElementRef().nativeElement;

    const grabberElement = document.createElement('div');
    grabberElement.style.height = '100%';
    grabberElement.style.width = '2px';
    grabberElement.style.backgroundColor = '#eaeaea';
    grabberElement.style.position = 'absolute';
    grabberElement.style.cursor = 'col-resize';
    grabberElement.style.resize = 'horizontal';
    grabberElement.style.overflow = 'auto';

    grabberElement.addEventListener('mousedown', () => {
      this.grab = true;
      sidebar.style.cursor = 'col-resize';
    });

    grabberElement.addEventListener('mouseup', () => {
      this.grab = false;
      sidebar.style.cursor = 'default';
    });

    sidebar.addEventListener('mouseup', () => {
      this.grab = false;
      sidebar.style.cursor = 'default';
      grabberElement.style.backgroundColor = '#fff';
    });

    document.addEventListener('mouseup', () => {
      if (this.grab) {
        this.grab = false;
        sidebar.style.cursor = 'default';
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (this.grab) {
        const newWidth = e.clientX - 75 - (grabberElement.offsetWidth / 2);
        const widthPercent = ((window.innerWidth - newWidth) / window.innerWidth * 100);
        if (widthPercent > 70 && widthPercent < 94) {
          sidebar.style.width = newWidth + 'px';
        }
      }
    });
    content.prepend(grabberElement);
  }
}
