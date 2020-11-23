import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModifierSidesheetComponent } from './new-modifier-sidesheet.component';

describe('NewModifierSidesheetComponent', () => {
  let component: NewModifierSidesheetComponent;
  let fixture: ComponentFixture<NewModifierSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewModifierSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModifierSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
