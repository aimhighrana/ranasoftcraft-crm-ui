import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_services/user/userservice.service';
import { Userdetails } from 'src/app/_models/userdetails';
import { LoadingService } from 'src/app/_services/loading.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'pros-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit, OnDestroy {

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
   * child element of secondary sidebar
   */
  @ViewChild('secondarySidenav') secondarySidenav: MatSidenav;

  /**
   * constructor of class
   * @param userService User service object
   * @param loadingService Loading service object
   */
  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.udSub = this.userService.getUserDetails().subscribe(
      (response: Userdetails) => {
        this.userDetails = response;
      }
    );
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
      document.getElementById('primarySidenav').style.width = '69px';
      document.getElementById('primaryContent').style.marginLeft = '74px';
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
      document.getElementById('secondarySidenav').style.width = '15px';
      document.getElementById('secondaryContent').style.marginLeft = '74px';
      this.secondarySideBarOpened = false;
    } else {
      document.getElementById('secondarySidenav').style.width = '264px';
      document.getElementById('secondaryContent').style.marginLeft = '199px';
      this.secondarySideBarOpened = true;
    }
  }
}
