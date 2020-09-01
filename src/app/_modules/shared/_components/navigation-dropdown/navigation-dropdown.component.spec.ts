import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationDropdownComponent } from './navigation-dropdown.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('NavigationDropdownComponent', () => {
  let component: NavigationDropdownComponent;
  let fixture: ComponentFixture<NavigationDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationDropdownComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
