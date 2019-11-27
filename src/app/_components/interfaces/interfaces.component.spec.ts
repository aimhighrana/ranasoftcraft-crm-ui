import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesComponent } from './interfaces.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, MatAutocompleteModule, MatOptionModule, MatCheckboxModule, MatFormFieldModule, MatPaginatorModule, MatMenuTrigger, MatMenuModule, MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataSource } from '@angular/cdk/table';

describe('InterfacesComponent', () => {
  let component: InterfacesComponent;
  let fixture: ComponentFixture<InterfacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[MatTableModule,FormsModule,ReactiveFormsModule,MatMenuModule,MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,MatFormFieldModule,MatAutocompleteModule,MatOptionModule,MatCheckboxModule,MatFormFieldModule,MatPaginatorModule,BrowserAnimationsModule,RouterModule.forRoot([])],                                              
      declarations: [ InterfacesComponent,BreadcrumbComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
