import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupRuleComponent } from './lookup.component';

describe('LookupRuleComponent', () => {
  let component: LookupRuleComponent;
  let fixture: ComponentFixture<LookupRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
