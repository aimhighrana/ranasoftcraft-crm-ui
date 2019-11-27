import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SapComponent } from './sap.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { AdminTileComponent } from '../../admin-tile/admin-tile.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('SapComponent', () => {
  let component: SapComponent;
  let fixture: ComponentFixture<SapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({  
      imports:[MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,RouterModule.forRoot([])],    
      declarations: [ SapComponent,BreadcrumbComponent,AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
