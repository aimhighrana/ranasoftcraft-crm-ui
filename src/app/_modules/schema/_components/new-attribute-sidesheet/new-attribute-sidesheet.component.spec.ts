import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAttributeSidesheetComponent } from './new-attribute-sidesheet.component';

describe('NewAttributeSidesheetComponent', () => {
  let component: NewAttributeSidesheetComponent;
  let fixture: ComponentFixture<NewAttributeSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAttributeSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAttributeSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
