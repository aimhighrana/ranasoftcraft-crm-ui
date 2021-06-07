import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '@modules/shared/shared.module';
import { MdoUiLibraryModule, TransientService } from 'mdo-ui-library';

import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '@services/user/userservice.service';
import { of, throwError } from 'rxjs';
import { UserPersonalDetails, UserPreferenceDetails } from '@models/userdetails';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ AppMaterialModuleForSpec, 
        SharedModule,
        MdoUiLibraryModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        HttpClientTestingModule
      ],
      providers: [TransientService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    userService = fixture.debugElement.injector.get(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getUserPersonalDetails(), should get personal details', async(() => {
    const personalDetails: UserPersonalDetails = new UserPersonalDetails();
    personalDetails.name = 'Test';
    personalDetails.publicName = 'Test';
    personalDetails.phone = 54545;
    personalDetails.pemail = 'test@test.com';
    personalDetails.semail = 'test@test.com';

    spyOn(userService, 'getUserPersonalDetails').and.returnValues(of(personalDetails), throwError({message: 'Something went wrong'}));
    component.ngOnInit();
    expect(userService.getUserPersonalDetails).toHaveBeenCalled();

    expect(component.currentUserDetails).toEqual(personalDetails);
    expect(component.currentUserDetails.name === personalDetails.name).toBeTruthy();
  }));

  it('updatePersonalDetails(), should update personal details in db', async(() => {
    const personalDetails: UserPersonalDetails = new UserPersonalDetails();
    personalDetails.profileKey = {
      tenantId: '',
      userName: 'Test Name'
    }
    spyOn(userService, 'getUserPersonalDetails').and.returnValues(of(personalDetails), throwError({message: 'Something went wrong'}));
    component.ngOnInit();

    const response = {
      acknowledge: true,
      errorMsg: 'Error',
      userName: 'Test Name'
    };
    spyOn(userService, 'updateUserPersonalDetails').and.returnValues(of(response), throwError({message: 'Something went wrong'}));

    expect(component.updatePersonalDetails()).toBeTruthy();
  }));

  it('getUserPreference(), should get user preference', async(() => {
    const userPref: UserPreferenceDetails = new UserPreferenceDetails();
    spyOn(userService, 'getUserPreferenceDetails').and.returnValues(of(userPref), throwError({message: 'Something went wrong'}));

    spyOn(userService, 'getAllLanguagesList').and.returnValues(of([]), throwError({message: 'Something went wrong'}));
    spyOn(userService, 'getDateFormatList').and.returnValues(of([]), throwError({message: 'Something went wrong'}));
    spyOn(userService, 'getNumberFormatList').and.returnValues(of([]), throwError({message: 'Something went wrong'}));

    component.createLanguageSettingsForm();

    expect(component.languageSettingsForm.controls.language.value).toEqual('');
  }));

  it('updates personal details in database', async(() => {
    expect(component.updatePersonalDetails).toBeTruthy();
  }));

  it('checks form valid status', async(() => {
    component.createForm();
    component.submitForm();
    expect(component.updateForm).toEqual(false);
  }));

  it('opens change password dialog', async(() => {
    expect(component.openChangePasswordDialog()).toBeTruthy();
  }));

  it('setValue(), should set field value', async(() => {
    component.createForm();
    component.setValue('userName', 'Test');

    expect(component.settingsForm.controls.userName.value === 'Test').toBeTruthy();
  }));

  it('getDropdownPos(), should set dropdown position', async(() => {
    const spy = jasmine.createSpyObj(MatAutocomplete,['closed','opened']);
    expect(component.getDropdownPos(spy)).toEqual('chevron-down');
  }));

  it('filter(), should filter based on key', async(() => {
    const list = ['test1', 'test2', 'test3'];
    expect(component.filter('test1', list)).toEqual(['test1']);
  }));

  it('makeLangSettingsUpdateCall(), should make http call to update language settings', async(() => {
    const response = {
      acknowledge: true,
      errorMsg: 'Error',
      userName: 'Test Name'
    };
    spyOn(userService, 'updateUserPreferenceDetails').and.returnValues(of(response), throwError({message: 'Something went wrong'}));

    component.currentUserPreferences = new UserPreferenceDetails();
    component.timeZoneList = ['IST'];
    component.makeLangSettingsUpdateCall('IST', 'timezone', component.timeZoneList);

    expect(component.currentUserPreferences.timezone).toEqual('IST');
  }));

  it('makeLangSettingsUpdateCall(), should make http call to update language settings', async(() => {
    const response = {
      acknowledge: true,
      errorMsg: null,
      userName: 'Test Name'
    };
    spyOn(userService, 'updateUserPreferenceDetails').and.returnValues(of(response), throwError({message: 'Something went wrong'}));

    component.currentUserPreferences = new UserPreferenceDetails();
    component.timeZoneList = ['IST'];
    component.makeLangSettingsUpdateCall('UTC', 'timezone', component.timeZoneList);

    component.makeLangSettingsUpdateCall('IST', 'timezone', component.timeZoneList);
    expect(component.langFormErrMsg).toEqual('');
  }));

  it('updateLanguageSettings()', async(() => {
    component.createLanguageSettingsForm();
    spyOn(component, 'makeLangSettingsUpdateCall');

    component.languagesList = ['Eng'];
    component.updateLanguageSettings('language');
    expect(component.makeLangSettingsUpdateCall).toHaveBeenCalled();

    component.dateFormatList = ['dd/mm/yyyy'];
    component.updateLanguageSettings('dateFormat');
    expect(component.makeLangSettingsUpdateCall).toHaveBeenCalled();

    component.numberFormatList = ['0'];
    component.updateLanguageSettings('numberFormat');
    expect(component.makeLangSettingsUpdateCall).toHaveBeenCalled();

    component.timeZoneList = ['IST'];
    component.updateLanguageSettings('timeZone');
    expect(component.makeLangSettingsUpdateCall).toHaveBeenCalled();

    component.timeFormatList = ['00:00'];
    component.updateLanguageSettings('timeFormat');
    expect(component.makeLangSettingsUpdateCall).toHaveBeenCalled();
  }));
});
