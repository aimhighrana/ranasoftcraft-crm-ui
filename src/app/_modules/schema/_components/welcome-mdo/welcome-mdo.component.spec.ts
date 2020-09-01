import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMdoComponent } from './welcome-mdo.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('WelcomeMdoComponent', () => {
  let component: WelcomeMdoComponent;
  let fixture: ComponentFixture<WelcomeMdoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMdoComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
