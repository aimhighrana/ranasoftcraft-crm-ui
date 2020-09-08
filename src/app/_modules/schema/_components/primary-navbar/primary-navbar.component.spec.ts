import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryNavbarComponent } from './primary-navbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { NavigationDropdownComponent } from '@modules/shared/_components/navigation-dropdown/navigation-dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PrimaryNavbarComponent', () => {
  let component: PrimaryNavbarComponent;
  let fixture: ComponentFixture<PrimaryNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryNavbarComponent, SearchInputComponent, NavigationDropdownComponent, NavigationDropdownComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryNavbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
