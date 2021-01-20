import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavUserdefinedComponent } from './sidenav-userdefined.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SharedModule } from '@modules/shared/shared.module';

describe('SidenavUserdefinedComponent', () => {
  let component: SidenavUserdefinedComponent;
  let fixture: ComponentFixture<SidenavUserdefinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavUserdefinedComponent, FormInputComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavUserdefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
