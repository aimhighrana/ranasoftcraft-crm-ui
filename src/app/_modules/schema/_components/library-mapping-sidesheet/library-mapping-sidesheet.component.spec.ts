import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryMappingSidesheetComponent } from './library-mapping-sidesheet.component';

describe('LibraryMappingSidesheetComponent', () => {
  let component: LibraryMappingSidesheetComponent;
  let fixture: ComponentFixture<LibraryMappingSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryMappingSidesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryMappingSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
