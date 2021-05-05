import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { UserService } from '@services/user/userservice.service';
import { of, throwError } from 'rxjs';

describe('ChangePasswordDialogComponent', () => {
  let component: ChangePasswordDialogComponent;
  let fixture: ComponentFixture<ChangePasswordDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockValues = {
    currentPassword: 'Test1234',
    newPassword: 'Test12345',
    confirmNewPassword: 'Test12345'
  };

  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordDialogComponent ],
      imports: [
        AppMaterialModuleForSpec,
        MdoUiLibraryModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordDialogComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    userService = fixture.debugElement.injector.get(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createForm()', async(() => {
    expect(component.createForm()).toBeTruthy();
  }));

  it('closeDialog(), should close dialog', async(() => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));

  it('changePassword(), should check for validation and update password', async(() => {
    component.ngOnInit();
    Object.keys(mockValues).forEach((field) => {
      component.changeForm.controls[field].setValue(mockValues[field]);
    });
    const response = {
      acknowledge: true,
      errorMsg: 'Error',
      userName: 'Test Name'
    };
    spyOn(userService, 'updatePassword').and.returnValues(of(response), throwError({message: 'Something went wrong'}));
    component.changePassword();
    expect(component.bannerMessage).toEqual('Error');

    component.changeForm.controls.currentPassword.setValue('Test1234');
    component.changeForm.controls.newPassword.setValue('Test12345');
    component.changeForm.controls.confirmNewPassword.setValue('test12345');
    component.changePassword();
    expect(component.bannerMessage).toEqual('Password and confirm password did not match');

    component.changeForm.controls.confirmNewPassword.setValue('Test1234');
    component.changeForm.controls.newPassword.setValue('Test1234');
    component.changePassword();
    expect(component.bannerMessage).toEqual('Cannot set current password as new password');

    component.ngOnInit();
    component.changePassword();
    expect(component.changeForm.controls.currentPassword.touched).toEqual(true);
  }));

  it('changePassword(), should check for validation and update password', async(() => {
    component.ngOnInit();
    Object.keys(mockValues).forEach((field) => {
      component.changeForm.controls[field].setValue(mockValues[field]);
    });
    const response = {
      acknowledge: true,
      errorMsg: null,
      userName: 'Test Name'
    };
    spyOn(userService, 'updatePassword').and.returnValues(of(response), throwError({message: 'Something went wrong'}));
    component.changePassword();

    expect(component.bannerMessage).toEqual('');
  }));

  it('getHint(), should get error hints', async(() => {
    component.ngOnInit();

    component.changeForm.controls.currentPassword.markAsTouched();
    let msg = component.getHint('currentPassword');
    expect(msg).toEqual('This is a required field');

    component.changeForm.controls.currentPassword.setValue('Test1234');
    component.changeForm.controls.newPassword.setValue('Tes4');
    component.changeForm.controls.newPassword.markAsTouched();
    msg = component.getHint('newPassword');
    expect(msg).toEqual('Password should contain minimum of 8 characters');

    component.changeForm.controls.newPassword.setValue('Test4 5test');
    msg = component.getHint('newPassword');
    expect(msg).toEqual('Password should not contain space');

    component.changeForm.controls.newPassword.setValue('Test4test');
    msg = component.getHint('newPassword');
    expect(msg).toEqual('Password should contain minimum of 2 numbers');

    component.changeForm.controls.newPassword.setValue('153545344535');
    msg = component.getHint('newPassword');
    expect(msg).toEqual('Password should contain minimum of 1 letter');

    Object.keys(mockValues).forEach((field) => {
      component.changeForm.controls[field].setValue(mockValues[field]);
    });
    msg = component.getHint('newPassword');
    expect(msg).toEqual('');
  }));
});
