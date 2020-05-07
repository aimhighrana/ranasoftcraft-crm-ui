import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersDropdownComponent } from './filters-dropdown.component';

describe('FiltersDropdownComponent', () => {
  let component: FiltersDropdownComponent;
  let fixture: ComponentFixture<FiltersDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersDropdownComponent, ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
