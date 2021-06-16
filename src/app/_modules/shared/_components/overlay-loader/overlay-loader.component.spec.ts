import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { OverlayLoaderComponent } from './overlay-loader.component';

describe('OverlayLoaderComponent', () => {
  let component: OverlayLoaderComponent;
  let fixture: ComponentFixture<OverlayLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayLoaderComponent ],
      imports: [MdoUiLibraryModule, AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
