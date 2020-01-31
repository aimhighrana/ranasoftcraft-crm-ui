import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotifComponent } from './email-notif.component';
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { AdminTileComponent } from '../admin-tile/admin-tile.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmailNotifComponent', () => {
  let component: EmailNotifComponent;
  let fixture: ComponentFixture<EmailNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ EmailNotifComponent, BreadcrumbComponent, AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
