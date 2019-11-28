import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTileComponent } from './schema-tile.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchemaTileComponent', () => {
  let component: SchemaTileComponent;
  let fixture: ComponentFixture<SchemaTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ SchemaTileComponent, BreadcrumbComponent, SchemaProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
