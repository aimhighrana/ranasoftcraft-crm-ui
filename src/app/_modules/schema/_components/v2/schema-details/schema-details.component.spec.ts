import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDetailsComponent } from './schema-details.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';

describe('SchemaDetailsComponent', () => {
  let component: SchemaDetailsComponent;
  let fixture: ComponentFixture<SchemaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaDetailsComponent, FilterValuesComponent, AddFilterMenuComponent, SearchInputComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDetailsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
