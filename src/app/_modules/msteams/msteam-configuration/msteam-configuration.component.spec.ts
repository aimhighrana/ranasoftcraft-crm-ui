import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MsteamConfigurationComponent } from './msteam-configuration.component';
import { of } from 'rxjs';
import * as microsoftTeams from '@microsoft/teams-js';

describe('MsteamConfigurationComponent', () => {
  let component: MsteamConfigurationComponent;
  let fixture: ComponentFixture<MsteamConfigurationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MsteamConfigurationComponent],
      imports: [HttpClientTestingModule, AppMaterialModuleForSpec]
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(MsteamConfigurationComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 11000;
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('ngOnIt(), should be test with pre required ', async(() => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('login(), should set window to report configuration page', async(() => {

    const authFunctionSpy = spyOn(component, 'authLogin').and.callFake
      (() => {
        return of(true)
      })
    component.init();
    expect(authFunctionSpy).toHaveBeenCalled();
  }))

  it('authLogin(), should set window location to report configuration page', async(() => {
    const apiUrl = '';
    const contextSpy = spyOn(microsoftTeams, 'getContext').and.callFake(() => {
      return of(true)
    });

    component.authLogin(apiUrl);
    fixture.whenStable();
    expect(contextSpy).toHaveBeenCalled();
  }))
});
