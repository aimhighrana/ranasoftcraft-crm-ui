import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceoptionsDialogComponent } from './advanceoptions-dialog.component';

describe('AdvanceoptionsDialogComponent', () => {
  let component: AdvanceoptionsDialogComponent;
  let fixture: ComponentFixture<AdvanceoptionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceoptionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceoptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
