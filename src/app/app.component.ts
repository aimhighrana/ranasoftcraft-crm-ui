import { Component, OnInit, OnDestroy, HostBinding, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer, ComponentType } from '@angular/cdk/overlay';
import { ThemeSelectorService } from './_services/theme-selector.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobaldialogService } from '@services/globaldialog.service';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'pros-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ngx-mdo';

  @ViewChild('rightSideNav', { static: true })
  rightSideNav: MatSidenav;

  @ViewChild('rightSideNav1', { static: true })
  rightSideNav1: MatSidenav;

  @ViewChild('globalDialog', { static: true }) globalDialog: TemplateRef<any>;

  @HostBinding('class') componentCssClass;
  themeSub: Subscription;
  routeSub: Subscription;
  routerSub: Subscription;
  sideNavCloseStartSub: Subscription;
  dialogRef: MatDialogRef<Component>;

  dialogSubscriber: Subscription;

  themes = [
    { name: 'default-theme', primary: '#FD6329', bg: '#E4EAEF' },
    { name: 'mdo-dark', primary: '#1976d2', bg: '#303030' },
    { name: 'ckh-light', primary: '#4caf50', bg: '#fafafa' },
    { name: 'ckh-dark', primary: '#4caf50', bg: '#303030' },
    { name: 'pros-light', primary: '#FD6329', bg: '#E4EAEF' }
  ];
  portal: ComponentPortal<unknown>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private overlayContainer: OverlayContainer,
    private themeSelector: ThemeSelectorService,
    private matDialog: MatDialog,
    private globaldialogService: GlobaldialogService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.routerSub = this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ).subscribe((evt: NavigationEnd) => {
      if (evt.url.indexOf('(sb:') > 0) {
        this.rightSideNav.open();
      } else {
        this.rightSideNav.close();
      }
      if (evt.url.indexOf('outer:') > 0) {
        this.rightSideNav1.open();
      } else {
        this.rightSideNav1.close();
      }
    });
    this.routeSub = this.route.queryParams.subscribe((params) => {
      if (params.jwtToken) {
        localStorage.setItem('JWT-TOKEN', params.jwtToken);
      }
      if (params.jwtRefreshToken) {
        localStorage.setItem('JWT-REFRESH-TOKEN', params.jwtRefreshToken);
      }
    });
    this.themeSub = this.themeSelector.theme.subscribe(theme => {
      this.overlayContainer.getContainerElement().classList.add(theme);
      this.componentCssClass = theme;
    });
    const routerRef = this.router;
    this.sideNavCloseStartSub = this.rightSideNav.closedStart.subscribe(() => {
      if (routerRef.url.indexOf('(sb:') > 0) {
        routerRef.navigateByUrl(routerRef.url.substring(0, routerRef.url.indexOf('(sb:')));
      }
    });

    this.globaldialogService.dialogToggleEmitter
      .subscribe((dialogData: { componentName: ComponentType<unknown>, data: {}, dialogState: string }) => {
        console.log(dialogData)

        this.dialogRef = this.matDialog.open(dialogData.componentName, {
          height: '800px',
          width: '700px',
          disableClose: true,
          data: dialogData.data
        })
          .updatePosition({ right: '10px' });
        this.dialogRef.afterClosed().subscribe(result => {
          this.globaldialogService.closeModel(result);
        });
      });

  }

  ngOnDestroy() {
    this.sideNavCloseStartSub.unsubscribe();
    this.themeSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.routerSub.unsubscribe();
  }

  public changeTheme(theme): void {
    this.themeSelector.theme.next(theme);
  }

  public isActiveTheme(theme): boolean {
    return this.themeSelector.theme.value === theme;
  }

  closeGlobalDialog(event) {
    console.log(event)
    this.dialogRef.close();
  }

}
