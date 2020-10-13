import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryNavbarComponent } from './primary-navbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { NavigationDropdownComponent } from '@modules/shared/_components/navigation-dropdown/navigation-dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('PrimaryNavbarComponent', () => {
  let component: PrimaryNavbarComponent;
  let fixture: ComponentFixture<PrimaryNavbarComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryNavbarComponent, SearchInputComponent, NavigationDropdownComponent, NavigationDropdownComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryNavbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sendToParent(), should assign navigation value', async() => {
    const value = 'report';
    component.sendToParent(value);
    expect(component.isNavSelected).toEqual(value);

    const value2 = 'welcome';
    spyOn(router, 'navigate');
    component.sendToParent(value2);
    expect(router.navigate).toHaveBeenCalledWith(['/home/dash/welcome'])
  })
});
