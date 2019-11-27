import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHomeComponent } from './admin-home.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { AdminTileComponent } from '../admin-tile/admin-tile.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ AdminHomeComponent, BreadcrumbComponent, AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
