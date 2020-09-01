import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDatasetComponent } from './upload-dataset.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';

describe('UploadDatasetComponent', () => {
  let component: UploadDatasetComponent;
  let fixture: ComponentFixture<UploadDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDatasetComponent, SearchInputComponent, FilterValuesComponent, FormInputComponent, AddFilterMenuComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDatasetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
