import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestComponent } from './rest.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('RestComponent', () => {
  let component: RestComponent;
  let fixture: ComponentFixture<RestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, RouterModule.forRoot([])],
      declarations: [ RestComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
