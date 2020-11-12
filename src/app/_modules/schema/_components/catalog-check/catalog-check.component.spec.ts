import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { CatalogCheckComponent } from './catalog-check.component';

describe('CatalogCheckComponent', () => {
  let component: CatalogCheckComponent;
  let fixture: ComponentFixture<CatalogCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogCheckComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
