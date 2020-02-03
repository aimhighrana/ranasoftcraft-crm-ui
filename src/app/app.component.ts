import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeSelectorService } from './_services/theme-selector.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pros-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ngx-mdo';

  @HostBinding('class') componentCssClass;
  themeSub: Subscription;
  routeSub: Subscription;

  themes = [
    { name: 'default-theme',  primary: '#1976d2', bg: '#fafafa'},
    { name: 'mdo-dark',       primary: '#1976d2', bg: '#303030'},
    { name: 'ckh-light',      primary: '#4caf50', bg: '#fafafa'},
    { name: 'ckh-dark',       primary: '#4caf50', bg: '#303030'}
  ];

  constructor(
    private route: ActivatedRoute,
    private overlayContainer: OverlayContainer,
    private themeSelector: ThemeSelectorService
  ) { }

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.themeSub.unsubscribe();
  }

  public changeTheme(theme): void {
    this.themeSelector.theme.next(theme);
  }

  public isActiveTheme(theme): boolean {
    return this.themeSelector.theme.value === theme;
  }
}
