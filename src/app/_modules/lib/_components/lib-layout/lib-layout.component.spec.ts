import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibLayoutComponent } from './lib-layout.component';

describe('LibLayoutComponent', () => {
  let component: LibLayoutComponent;
  let fixture: ComponentFixture<LibLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
