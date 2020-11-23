import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNounSidesheetComponent } from './new-noun-sidesheet.component';

describe('NewNounSidesheetComponent', () => {
  let component: NewNounSidesheetComponent;
  let fixture: ComponentFixture<NewNounSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNounSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNounSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
