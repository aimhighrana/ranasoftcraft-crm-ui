import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentTabComponent } from './attachment-tab.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('AttachmentTabComponent', () => {
  let component: AttachmentTabComponent;
  let fixture: ComponentFixture<AttachmentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentTabComponent],
      imports: [AppMaterialModuleForSpec]
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