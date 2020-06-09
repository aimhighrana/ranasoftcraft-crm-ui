import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { MsteamConfigurationComponent } from './msteam-configuration.component';

describe('MsteamConfigurationComponent', () => {
  let component: MsteamConfigurationComponent;
  let fixture: ComponentFixture<MsteamConfigurationComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ MsteamConfigurationComponent ],
      imports:[HttpClientTestingModule, AppMaterialModuleForSpec],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsteamConfigurationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnIt(), should be test with pre required ',async(()=>{
    component.ngOnInit();
  }));

  it('login(), should set window location to report configuration page', async(() => {
    component.login();
  }))
});
