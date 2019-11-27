import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaComponent } from './schema.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchemaComponent', () => {
  let component: SchemaComponent;
  let fixture: ComponentFixture<SchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ SchemaComponent, BreadcrumbComponent, SchemaTileComponent, SchemaProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
