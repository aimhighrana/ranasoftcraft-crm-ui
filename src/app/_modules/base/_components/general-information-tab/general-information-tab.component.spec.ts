import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInformationTabComponent } from './general-information-tab.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('GeneralInformationTabComponent', () => {
  let component: GeneralInformationTabComponent;
  let fixture: ComponentFixture<GeneralInformationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralInformationTabComponent],
      imports: [AppMaterialModuleForSpec]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInformationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});