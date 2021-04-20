import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pros-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // settings form
  settingsForm: FormGroup;
  // updates form after user stops editing
  updateForm = false;

  // mock values for updating form values
  mockValues = {
    userName: 'Test User Name',
    fullName: 'Test',
    preferredName: 'Test Name',
    phone: 21354,
    primaryEmail: 'test@test.com',
    secondaryEmail: 'secEmail@test.com'
  }

  constructor() { }

  ngOnInit(): void {
    this.createForm();
    this.setValueForFormControl(this.mockValues);
  }

  /**
   * creates form for settings profile
   */
  createForm() {
    this.settingsForm = new FormGroup({
      userName: new FormControl({ value: '', disabled: true }),
      fullName: new FormControl('', [Validators.required]),
      preferredName: new FormControl('', [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      primaryEmail: new FormControl('', [Validators.email, Validators.required]),
      secondaryEmail: new FormControl('', [Validators.email])
    });
  }

  /**
   * updates user detals in database
   */
  updatePersonalDetails() {
    console.log(this.settingsForm.controls);
  }

  /**
   * updates current values in profile form
   * @param value existing data for updating in form
   */
  setValueForFormControl(value) {
    Object.keys(value).forEach((key) => {
      this.setValue(key, value[key]);
    });
  }

  /**
   * sets values to the specified field in form
   * @param field form field
   * @param val field value
   */
  setValue(field, val) {
    this.settingsForm.get(field).setValue(val);
  }

  /**
   * checks form for valid form values
   */
  submitForm() {
    if (this.settingsForm.invalid) {
      (Object).values(this.settingsForm.controls).forEach(control => {
        if(control.invalid) {
          control.markAsTouched(  )
        }
      });
      return false;
    }
    this.updateForm = true;
    setTimeout(() => {
      if (this.updateForm) {
        this.updatePersonalDetails();
      }
    }, 1000);
  }
}
