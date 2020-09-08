import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaInfoComponent } from './schema-info.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';

describe('SchemaInfoComponent', () => {
  let component: SchemaInfoComponent;
  let fixture: ComponentFixture<SchemaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaInfoComponent, FilterValuesComponent, AddFilterMenuComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaInfoComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
