import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessrulelibrarySidesheetComponent } from './businessrulelibrary-sidesheet.component';

describe('BusinessrulelibrarySidesheetComponent', () => {
  let component: BusinessrulelibrarySidesheetComponent;
  let fixture: ComponentFixture<BusinessrulelibrarySidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessrulelibrarySidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessrulelibrarySidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
