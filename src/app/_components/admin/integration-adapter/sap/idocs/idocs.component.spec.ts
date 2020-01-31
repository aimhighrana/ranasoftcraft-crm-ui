import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdocsComponent } from './idocs.component';
import { BreadcrumbComponent } from 'src/app/_components/common/breadcrumb/breadcrumb.component';
import { MatIconModule, MatCardModule, MatListModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('IdocsComponent', () => {
  let component: IdocsComponent;
  let fixture: ComponentFixture<IdocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCardModule, MatListModule, MatToolbarModule, RouterModule.forRoot([])],
      declarations: [ IdocsComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
