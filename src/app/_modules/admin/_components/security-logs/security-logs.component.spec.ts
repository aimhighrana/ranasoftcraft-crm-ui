import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLogsComponent } from './security-logs.component';
import { BreadcrumbComponent } from '../../../shared/_components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AdminTileComponent } from '../admin-tile/admin-tile.component';

describe('SecurityLogsComponent', () => {
  let component: SecurityLogsComponent;
  let fixture: ComponentFixture<SecurityLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, RouterModule.forRoot([])],
      declarations: [ SecurityLogsComponent, BreadcrumbComponent, AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
