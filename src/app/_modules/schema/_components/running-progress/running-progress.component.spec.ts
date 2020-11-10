import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningProgressComponent } from './running-progress.component';

describe('RunningProgressComponent', () => {
  let component: RunningProgressComponent;
  let fixture: ComponentFixture<RunningProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
