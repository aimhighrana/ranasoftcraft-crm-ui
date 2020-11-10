import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringReplaceComponent } from './string-replace.component';

describe('StringReplaceComponent', () => {
  let component: StringReplaceComponent;
  let fixture: ComponentFixture<StringReplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringReplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
