import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaGroupFormComponent } from './schema-group-form.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';

describe('SchemaGroupFormComponent', () => {
  let component: SchemaGroupFormComponent;
  let fixture: ComponentFixture<SchemaGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaGroupFormComponent, BreadcrumbComponent],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

