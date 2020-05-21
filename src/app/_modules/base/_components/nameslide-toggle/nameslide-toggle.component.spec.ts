import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameslideToggleComponent } from './nameslide-toggle.component';

describe('NameslideToggleComponent', () => {
  let component: NameslideToggleComponent;
  let fixture: ComponentFixture<NameslideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameslideToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameslideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
