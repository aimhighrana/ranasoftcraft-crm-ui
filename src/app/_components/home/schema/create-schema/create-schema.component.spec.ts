import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSchemaComponent } from './create-schema.component';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconComponent } from 'src/app/_modules/shared/_components/svg-icon/svg-icon.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';

describe('CreateSchemaComponent', () => {
  let component: CreateSchemaComponent;
  let fixture: ComponentFixture<CreateSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSchemaComponent, BreadcrumbComponent, SvgIconComponent, AddTileComponent ],
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
