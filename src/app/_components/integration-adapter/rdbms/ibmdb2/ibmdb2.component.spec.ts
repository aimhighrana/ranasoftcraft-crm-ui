import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IBMDB2Component } from './ibmdb2.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatChipsModule, MatDividerModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('IBMDB2Component', () => {
  let component: IBMDB2Component;
  let fixture: ComponentFixture<IBMDB2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, RouterModule.forRoot([])],
      declarations: [ IBMDB2Component, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IBMDB2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
