import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersDropdownComponent } from './filters-dropdown.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';

describe('FiltersDropdownComponent', () => {
  let fixture: ComponentFixture<FiltersDropdownComponent>;
  let component: FiltersDropdownComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      declarations: [FiltersDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersDropdownComponent);
    component = fixture.componentInstance;
  });

  it('toggleAdvancedFilters() should work', () => {
    component.showAdvancedFilters = true;
    component.toggleAdvancedFilters();
    expect(component.showAdvancedFilters).toEqual(false);
  });
});
