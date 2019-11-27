import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaLayoutComponent } from './schema-layout.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('SchemaLayoutComponent', () => {
  let component: SchemaLayoutComponent;
  let fixture: ComponentFixture<SchemaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({  
      imports:[MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,MatToolbarModule ,RouterModule.forRoot([])],                               
      declarations: [ SchemaLayoutComponent,BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
