import { Directive, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
  autoComplete: MatAutocomplete;
  scrollEvent: Event;
}

@Directive({
  selector: '[prosAutoCompleteScroll]'
})
export class AutoCompleteScrollDirective implements OnDestroy {
  timeoutRef: any;
  @Input() thresholdPercent = 0.8;
  @Output() autoCompleteScroll = new EventEmitter<IAutoCompleteScrollEvent>();
  onDestroy = new Subject();

  constructor(public autoComplete: MatAutocomplete) {
    this.autoComplete.opened.pipe(
      tap(() => {
        this.timeoutRef = setTimeout(() => {
          this.removeScrollEventListener();
          this.autoComplete.panel.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
          });
      }),takeUntil(this.onDestroy)
    ).subscribe();

    this.autoComplete.closed
      .pipe(
        tap(() => this.removeScrollEventListener()),
        takeUntil(this.onDestroy)
      ).subscribe();
  }

  private removeScrollEventListener() {
    if (this.autoComplete.panel) {
      this.autoComplete.panel.nativeElement.removeEventListener('scroll',this.onScroll);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutRef);
    this.onDestroy.next();
    this.onDestroy.complete();

    this.removeScrollEventListener();
  }

  onScroll(event: any) {
    if (this.thresholdPercent === undefined) {
      this.autoCompleteScroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
    } else {
      const threshold = (this.thresholdPercent * 120 * event.target.scrollHeight) / 100;
      const current = event.target.scrollTop + event.target.clientHeight;
      if (current > threshold) {
        this.autoCompleteScroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
      }
    }
  }
}
