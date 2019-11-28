import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaProgressbarComponent } from './schema-progressbar.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchemaProgressbarComponent', () => {
  let component: SchemaProgressbarComponent;
  let fixture: ComponentFixture<SchemaProgressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ SchemaProgressbarComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
