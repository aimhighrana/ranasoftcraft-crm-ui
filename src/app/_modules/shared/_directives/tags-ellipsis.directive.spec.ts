import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { TagsEllipsisDirective } from './tags-ellipsis.directive';
import { Injectable, Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

@Injectable()
export class MockElementRef {
  nativeElement: {}
}

@Component({
  template: ``
})
class DummyComponent {
}

export class MockChangeDetectorRef implements ChangeDetectorRef {
  markForCheck(): void { }
  detach(): void { }
  detectChanges(): void { }
  checkNoChanges(): void { }
  reattach(): void { }
}

describe('TagsEllipsisDirective', () => {
  const elRef = new ElementRef({ elementRef: true });
  let directive: TagsEllipsisDirective;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule
        ],
        providers: [
          { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    fixture.detectChanges();
  });


  it('should create an instance', () => {
    directive = new TagsEllipsisDirective(elRef);
    expect(directive).toBeTruthy();
  });

  it('ngAfterViewInit() should manupilate HTML', () => {
    directive = new TagsEllipsisDirective(elRef);
    directive.tags = [{
      name: 'tag1',
      color: 'red'
    }]
    directive.ngAfterViewInit();
    directive.checkForMoreTags();
    expect(directive.html).not.toBeNull()
  })
});
