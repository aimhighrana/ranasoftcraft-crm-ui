import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[prosTagsEllipsis]'
})
export class TagsEllipsisDirective implements AfterViewInit {
  /**
   * List of tags from the service
   */
  @Input() tags;
  html = '';
  constructor(public el: ElementRef) { }

  /**
   * Event Hook
   */
  ngAfterViewInit() {
    this.tags.forEach((tag, index) => {
      if (index < 2) {
        this.html = this.html + `<mat-chip class="mat-chip mat-focus-indicator mat-standard-chip" style="background-color:${tag.color}">${tag.value}</mat-chip>`;
      }
    });
    this.checkForMoreTags();
    this.el.nativeElement.innerHTML = this.html;
  }
  /**
   * function to test more tags
   */

  checkForMoreTags() {
    if (this.tags.length > 2) {
      this.html = this.html + `<button class="mat-focus-indicator moretag mat-icon-button mat-button-base mat-primary" aria-haspopup="true" [matMenuTriggerFor]="taglist">+${this.tags.length - 2}</button>`;
      const moreThantwo = this.tags.splice(2);
      this.html = this.html + `<mat-menu #taglist="matMenu" style='display:none'>`;
      moreThantwo.forEach((tag) => {
        this.html = this.html + `<button mat-menu-item>${tag.value}</button>`;
      });
      this.html = this.html + `</mat-menu>`;
    }
  }
}
