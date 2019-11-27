import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLayoutComponent } from './home-layout.component';
import { MatToolbarModule, MatCardModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeLayoutComponent', () => {
  let component: HomeLayoutComponent;
  let fixture: ComponentFixture<HomeLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ HomeLayoutComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
