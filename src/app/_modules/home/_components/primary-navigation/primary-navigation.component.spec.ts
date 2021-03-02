import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { PrimaryNavigationComponent } from './primary-navigation.component';

describe('PrimaryNavigationComponent', () => {
  let component: PrimaryNavigationComponent;
  let fixture: ComponentFixture<PrimaryNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaryNavigationComponent, SvgIconComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
