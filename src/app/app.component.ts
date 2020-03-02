import { Component, OnInit, OnDestroy, HostBinding, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeSelectorService } from './_services/theme-selector.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'pros-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ngx-mdo';

  @ViewChild('rightSideNav', { static: true })
  rightSideNav: MatSidenav;

  @HostBinding('class') componentCssClass;
  themeSub: Subscription;
  routeSub: Subscription;
  routerSub: Subscription;
  sideNavCloseStartSub: Subscription;

  themes = [
    { name: 'default-theme',  primary: '#1976d2', bg: '#fafafa'},
    { name: 'mdo-dark',       primary: '#1976d2', bg: '#303030'},
    { name: 'ckh-light',      primary: '#4caf50', bg: '#fafafa'},
    { name: 'ckh-dark',       primary: '#4caf50', bg: '#303030'}
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private overlayContainer: OverlayContainer,
    private themeSelector: ThemeSelectorService
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
}
