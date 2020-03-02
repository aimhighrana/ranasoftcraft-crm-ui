import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesforceComponent } from './salesforce.component';
import { BreadcrumbComponent } from '../../../../shared/_components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AdminTileComponent } from '../../admin-tile/admin-tile.component';

describe('SalesforceComponent', () => {
  let component: SalesforceComponent;
  let fixture: ComponentFixture<SalesforceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, RouterModule.forRoot([])],
      declarations: [ SalesforceComponent, BreadcrumbComponent, AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
