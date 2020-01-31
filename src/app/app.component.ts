import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeSelectorService } from './_services/theme-selector.service';

@Component({
  selector: 'pros-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ngx-mdo';

  @HostBinding('class') componentCssClass;
  themeSub: Subscription;

  constructor(
    private overlayContainer: OverlayContainer,
    private themeSelector: ThemeSelectorService
  ) { }

  ngOnInit() {
    this.themeSub = this.themeSelector.theme.subscribe(theme => {
      this.overlayContainer.getContainerElement().classList.add(theme);
      this.componentCssClass = theme;
    });
  }

  ngOnDestroy() {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }
}
