import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NewPrimaryNavbarComponent } from './new-primary-navbar.component';

describe('NewPrimaryNavbarComponent', () => {
  let component: NewPrimaryNavbarComponent;
  let fixture: ComponentFixture<NewPrimaryNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPrimaryNavbarComponent, SvgIconComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPrimaryNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
