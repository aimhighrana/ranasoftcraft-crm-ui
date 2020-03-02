import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesComponent } from './interfaces.component';
import { BreadcrumbComponent } from '../../../shared/_components/breadcrumb/breadcrumb.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InterfacesComponent', () => {
  let component: InterfacesComponent;
  let fixture: ComponentFixture<InterfacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, FormsModule, ReactiveFormsModule, MatMenuModule, MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatCheckboxModule, MatFormFieldModule, MatPaginatorModule, BrowserAnimationsModule, RouterModule.forRoot([])],
      declarations: [ InterfacesComponent, BreadcrumbComponent]
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
