import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdbmsComponent } from './rdbms.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AdminTileComponent } from '../../admin-tile/admin-tile.component';

describe('RdbmsComponent', () => {
  let component: RdbmsComponent;
  let fixture: ComponentFixture<RdbmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, RouterModule.forRoot([])],
      declarations: [ RdbmsComponent, BreadcrumbComponent, AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdbmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
