import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetlistComponent } from './widgetlist.component';

describe('WidgetlistComponent', () => {
  let component: WidgetlistComponent;
  let fixture: ComponentFixture<WidgetlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
