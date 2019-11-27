import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutComponent } from './admin-layout.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ AdminLayoutComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
