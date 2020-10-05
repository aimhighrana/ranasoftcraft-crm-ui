import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonavLayoutComponent } from './nonav-layout.component';

describe('NonavLayoutComponent', () => {
  let component: NonavLayoutComponent;
  let fixture: ComponentFixture<NonavLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonavLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
