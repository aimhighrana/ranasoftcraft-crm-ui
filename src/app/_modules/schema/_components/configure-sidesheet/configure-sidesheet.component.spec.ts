import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ConfigureSidesheetComponent } from './configure-sidesheet.component';

describe('ConfigureSidesheetComponent', () => {
  let component: ConfigureSidesheetComponent;
  let fixture: ComponentFixture<ConfigureSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureSidesheetComponent, SearchInputComponent ],
      imports: [
        AppMaterialModuleForSpec, SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
