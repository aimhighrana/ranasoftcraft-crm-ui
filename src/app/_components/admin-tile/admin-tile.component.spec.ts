import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTileComponent } from './admin-tile.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('AdminTileComponent', () => {
  let component: AdminTileComponent;
  let fixture: ComponentFixture<AdminTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ 
      imports:[MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,RouterModule.forRoot([])],                     
      declarations: [ AdminTileComponent,BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
