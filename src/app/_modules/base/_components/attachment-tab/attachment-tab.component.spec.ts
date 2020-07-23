import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentTabComponent } from './attachment-tab.component';

describe('AttachmentTabComponent', () => {
  let component: AttachmentTabComponent;
  let fixture: ComponentFixture<AttachmentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
