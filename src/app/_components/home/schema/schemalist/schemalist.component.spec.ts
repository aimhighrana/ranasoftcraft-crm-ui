import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemalistComponent } from './schemalist.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';

describe('SchemalistComponent', () => {
  let component: SchemalistComponent;
  let fixture: ComponentFixture<SchemalistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ SchemalistComponent, BreadcrumbComponent, SchemaTileComponent, SchemaProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
