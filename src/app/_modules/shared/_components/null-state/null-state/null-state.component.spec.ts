import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NullStateComponent } from './null-state.component';

describe('NullStateComponent', () => {
  let component: NullStateComponent;
  let fixture: ComponentFixture<NullStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NullStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NullStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
