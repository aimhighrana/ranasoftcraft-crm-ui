import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFieldsComponent } from './grid-fields.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('GridFieldsComponent', () => {
  let component: GridFieldsComponent;
  let fixture: ComponentFixture<GridFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({      
      imports:[MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,RouterModule.forRoot([])],                                        
      declarations: [ GridFieldsComponent,BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
