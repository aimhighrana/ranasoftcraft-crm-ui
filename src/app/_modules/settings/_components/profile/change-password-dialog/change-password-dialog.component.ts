import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pros-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  // current password
  currentPassword;
  // form group for change password fields
  changeForm: FormGroup;

  // validation pattern for new password
  patterns = {
    pwdPattern: '^(?=.*\\d.*\\d)(?=.*[a-zA-Z])(?!.*\\s).{8,}$',
    noSpace: '^(?!.*\\s).{8,}$',
    minTwoNumbers: '^(?=.*\\d.*\\d).{8,}$',
    minOneLetter: '^(?=.*[a-zA-Z]).{8,}$'
  };

  // error message to be displayed in banner
  bannerMessage;

  // handles show/hide of error message for password fields
  hasError = {
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false
  };

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentPassword = this.data.currentPassword || '';
  }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * creates new form for password fields
   */
  createForm() {
    this.changeForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.patterns.pwdPattern)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.patterns.pwdPattern)])
    });

    return true;;
  }

  /**
   * closes dialog with a optional response message
   * @param res response message
   */
  closeDialog(res?) {
    this.dialogRef.close(res);
  }

  /**
   * checks password validation and updates password
   */
  changePassword() {
    this.bannerMessage = '';

    if (this.changeForm.invalid) {
      (Object).values(this.changeForm.controls).forEach(control => {
        if(control.invalid) {
          control.markAsTouched()
        }
      });
      return false;
    }

    if (this.currentPassword !== this.changeForm.controls.currentPassword.value) {
      this.bannerMessage = 'Invalid current password';
    } else if (this.changeForm.controls.newPassword.value !== this.changeForm.controls.confirmNewPassword.value) {
      this.bannerMessage = 'Password and confirm password did not match';
    } else if (this.currentPassword === this.changeForm.controls.newPassword.value) {
      this.bannerMessage = 'Cannot set current password as new password';
    }

    if (this.bannerMessage) {
      return false;
    }

    this.closeDialog('Password changed successfully');
  }

  /**
   * gets hint for errors in form fields
   * @param field form field name
   */
  getHint(field) {
    let msg;

    if (this.changeForm.controls[field].touched && this.changeForm.controls[field].errors && this.changeForm.controls[field].errors.required) {
      msg = 'This is a required field';
    } else if (this.changeForm.controls[field].touched && this.changeForm.controls[field].errors && this.changeForm.controls[field].errors.minlength) {
      msg = 'Password should contain minimum of 8 characters';
    } else if (this.changeForm.controls[field].touched && this.changeForm.controls[field].errors && this.changeForm.controls[field].errors.pattern) {
      if (this.changeForm.controls[field].value.match(this.patterns.noSpace) === null) {
        msg = 'Password should not contain space';
      } else if (this.changeForm.controls[field].value.match(this.patterns.minTwoNumbers) === null) {
        msg = 'Password should contain minimum of 2 numbers';
      } else if (this.changeForm.controls[field].value.match(this.patterns.minOneLetter) === null) {
        msg = 'Password should contain minimum of 1 letter';
      }
    }

    if (msg) {
      this.hasError[field] = true;
      return msg;
    }

    this.hasError[field] = false;
    return '';
  }
}
