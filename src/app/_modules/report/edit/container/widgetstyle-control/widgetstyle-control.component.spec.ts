import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetstyleControlComponent } from './widgetstyle-control.component';

describe('WidgetstyleControlComponent', () => {
  let component: WidgetstyleControlComponent;
  let fixture: ComponentFixture<WidgetstyleControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetstyleControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetstyleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
