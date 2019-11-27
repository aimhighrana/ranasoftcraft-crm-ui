import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsComponent } from './fields.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('FieldsComponent', () => {
  let component: FieldsComponent;
  let fixture: ComponentFixture<FieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, RouterModule.forRoot([])],
      declarations: [ FieldsComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
