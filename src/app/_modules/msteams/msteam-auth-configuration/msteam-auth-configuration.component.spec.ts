import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as microsoftTeams from '@microsoft/teams-js';
import { MsteamsConfigService } from '../_service/msteams-config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MsteamAuthConfigurationComponent } from './msteam-auth-configuration.component';
import { of } from 'rxjs';

describe('MsteamAuthConfigurationComponent', () => {
  let component: MsteamAuthConfigurationComponent;
  let fixture: ComponentFixture<MsteamAuthConfigurationComponent>;
  let msteamsConfigService: jasmine.SpyObj<MsteamsConfigService>;

  beforeEach(async(() => {
    const spyObj = jasmine.createSpyObj('MsteamsConfigService', ['signIn']);
    TestBed.configureTestingModule({
      declarations: [ MsteamAuthConfigurationComponent ],
      imports: [HttpClientTestingModule, AppMaterialModuleForSpec],
      providers:[
        {provide: MsteamsConfigService, useValue: spyObj}
      ]
    })
    .compileComponents();
    msteamsConfigService = TestBed.inject(MsteamsConfigService) as jasmine.SpyObj<MsteamsConfigService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsteamAuthConfigurationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnIt(), should be test with pre required ',async(()=>{
    component.ngOnInit();
  }));


  it('notifySuccess(), should notifiy success to MS Teams', async(() => {
    spyOn(microsoftTeams, 'initialize').and.callFake(() => {
      return '';
    });
    spyOn(microsoftTeams.authentication, 'notifySuccess').and.callFake(() => {
      return '';
    });
    component.notifySuccess();
  }))

  it('signIn(), should sigin and call notifysuccess', async(() => {
    spyOn(microsoftTeams, 'initialize').and.callFake(() => {
      return '';
    });
    spyOn(microsoftTeams.authentication, 'notifySuccess').and.callFake(() => {
      return '';
    });
    msteamsConfigService.signIn.and.returnValue(of());
    component.signIn();
    expect(msteamsConfigService.signIn).toHaveBeenCalled();
  }))
});