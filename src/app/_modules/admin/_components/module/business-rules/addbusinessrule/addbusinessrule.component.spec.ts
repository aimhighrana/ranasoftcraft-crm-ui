import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbusinessruleComponent } from './addbusinessrule.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SvgIconComponent } from 'src/app/_modules/shared/_components/svg-icon/svg-icon.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';

describe('AddbusinessruleComponent', () => {
  let component: AddbusinessruleComponent;
  let fixture: ComponentFixture<AddbusinessruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbusinessruleComponent, BreadcrumbComponent, SvgIconComponent, AddTileComponent ],
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbusinessruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
