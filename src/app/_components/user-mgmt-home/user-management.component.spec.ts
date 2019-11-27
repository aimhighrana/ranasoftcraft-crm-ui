import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementComponent } from './user-management.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AdminTileComponent } from '../admin-tile/admin-tile.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, RouterModule.forRoot([])],
      declarations: [ UserManagementComponent, BreadcrumbComponent , AdminTileComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
