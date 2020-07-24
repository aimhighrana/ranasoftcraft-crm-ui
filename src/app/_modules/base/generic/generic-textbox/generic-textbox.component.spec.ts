import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTextboxComponent } from './generic-textbox.component';

describe('GenericTextboxComponent', () => {
  let component: GenericTextboxComponent;
  let fixture: ComponentFixture<GenericTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
