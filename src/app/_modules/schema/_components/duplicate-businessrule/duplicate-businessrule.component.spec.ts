import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateBusinessruleComponent } from './duplicate-businessrule.component';

describe('DuplicateBusinessruleComponent', () => {
  let component: DuplicateBusinessruleComponent;
  let fixture: ComponentFixture<DuplicateBusinessruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateBusinessruleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateBusinessruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
