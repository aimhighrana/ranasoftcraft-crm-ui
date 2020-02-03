import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeSelectorService } from './_services/theme-selector.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pros-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ngx-mdo';

  @HostBinding('class') componentCssClass;
  themeSub: Subscription;
  routeSub: Subscription;

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
}
