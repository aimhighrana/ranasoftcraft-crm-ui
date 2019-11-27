import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntMappingComponent } from './int-mapping.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, MatLabel, MatTreeModule, MatFormFieldModule, MatMenuModule, MatTableDataSource } from '@angular/material';
import { RouterModule } from '@angular/router';
import { DataSource } from '@angular/cdk/table';

describe('IntMappingComponent', () => {
  let component: IntMappingComponent;
  let fixture: ComponentFixture<IntMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ 
      imports:[DataSource, MatTableDataSource,MatMenuModule,MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,MatFormFieldModule,MatTreeModule,RouterModule.forRoot([])],                                       
      declarations: [ IntMappingComponent,BreadcrumbComponent,DataSource]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
