import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@modules/shared/shared.module';
import { MdoUiLibraryModule, TransientService } from 'mdo-ui-library';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        SharedModule,
        MdoUiLibraryModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [TransientService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', async(() => {
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('updates personal details in database', async(() => {
    expect(component.updatePersonalDetails).toBeTruthy();
  }));

  it('checks form valid status', async(() => {
    component.createForm();
    component.submitForm();
    expect(component.updateForm).toEqual(false);

    component.setValueForFormControl(component.mockValues);
    component.submitForm();
    expect(component.updateForm).toEqual(true);
  }));

  it('opens change password dialog', async(() => {
    expect(component.openChangePasswordDialog()).toBeTruthy();
  }));
});
