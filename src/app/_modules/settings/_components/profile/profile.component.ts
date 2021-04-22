import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TransientService } from 'mdo-ui-library';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { UserService } from '@services/user/userservice.service';
import { UserPersonalDetails, UserPreferenceDetails } from '@models/userdetails';

@Component({
  selector: 'pros-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // Form group for the language settings
  languageSettingsForm: FormGroup;

  // stores user preferences
  currentUserPreferences: UserPreferenceDetails;

  // holds the list of filtered options
  filteredLangList: Observable<string[]>;
  filteredTimeZoneList: Observable<string[]>;
  filteredDateFormatList: Observable<string[]>;
  filteredTimeFormatList: Observable<string[]>;
  filteredNumberFormatList: Observable<string[]>;

  // Language settings list
  languagesList: string[];
  timeZoneList: string[];
  dateFormatList: string[];
  timeFormatList: string[];
  numberFormatList: string[];

  // settings form
  settingsForm: FormGroup;

  // updates form after user stops editing
  updateForm = false;

  // stores user personal details obtained from db
  currentUserDetails: UserPersonalDetails;

  // stores error message on personal details update
  formErrMsg;

  constructor(private dialog: MatDialog, private libToast: TransientService, private userService: UserService) { }

  ngOnInit(): void {
    this.createForm();
    this.getUserPersonalDetails();
    this.createLanguageSettingsForm();
  }

  /**
   * fetches data list for all language settings
   */
  getLanguageSettingsList() {
    this.userService.getAllLanguagesList().subscribe((data) => {
      if (data) {
        this.languagesList = data;
      }
    }, (err) => {
      console.log(err);
    });

    this.userService.getDateFormatList().subscribe((data) => {
      if (data) {
        this.dateFormatList = data;
      }
    }, (err) => {
      console.log(err);
    });

    this.userService.getNumberFormatList().subscribe((data) => {
      if (data) {
        this.numberFormatList = data;
      }
    }, (err) => {
      console.log(err);
    });

    this.timeZoneList = ['UTC', 'IST', 'AST'];
    this.timeFormatList = ['Time Format1', 'Time Format2', 'Time Format3'];
  }

  /**
   * gets current user preference and sets in form fields
   */
  getUserPreference() {
    this.userService.getUserPreferenceDetails().subscribe((data) => {
      if (data) {
        this.currentUserPreferences = data;
        this.languageSettingsForm.patchValue({
          language: data.lang || '',
          timeZone: data.timezone || '',
          dateFormat: data.dformat || '',
          timeFormat: data.tformat || '',
          numberFormat: data.nformat || ''
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  /**
   * creates language settings form
   */
  createLanguageSettingsForm() {
    this.languageSettingsForm = new FormGroup({
      language: new FormControl(),
      timeZone: new FormControl(),
      dateFormat: new FormControl(),
      timeFormat: new FormControl(),
      numberFormat: new FormControl()
    });

    this.getLanguageSettingsList();
    this.getUserPreference();
    this.setupFilteredList();
  }

  /**
   * sets up filter for mat auto complete in all form fields
   */
  setupFilteredList() {
    this.filteredLangList = this.languageSettingsForm.controls.language.valueChanges.pipe(
      debounceTime(50),
      startWith(''),
      map((num: string | null) => num ? this.filter(num, this.languagesList) : (this.languagesList ? this.languagesList.slice() : this.languagesList))
    );

    this.filteredTimeZoneList = this.languageSettingsForm.controls.timeZone.valueChanges.pipe(
      debounceTime(50),
      startWith(''),
      map((num: string | null) => num ? this.filter(num, this.timeZoneList) : (this.timeZoneList ? this.timeZoneList.slice() : this.timeZoneList))
    );

    this.filteredDateFormatList = this.languageSettingsForm.controls.dateFormat.valueChanges.pipe(
      debounceTime(50),
      startWith(''),
      map((num: string | null) => num ? this.filter(num, this.dateFormatList) : (this.dateFormatList ? this.dateFormatList.slice() : this.dateFormatList))
    );

    this.filteredTimeFormatList = this.languageSettingsForm.controls.timeFormat.valueChanges.pipe(
      debounceTime(50),
      startWith(''),
      map((num: string | null) => num ? this.filter(num, this.timeFormatList) : (this.timeFormatList ? this.timeFormatList.slice() : this.timeFormatList))
    );

    this.filteredNumberFormatList = this.languageSettingsForm.controls.numberFormat.valueChanges.pipe(
      debounceTime(50),
      startWith(''),
      map((num: string | null) => num ? this.filter(num, this.numberFormatList) : (this.numberFormatList ? this.numberFormatList.slice() : this.numberFormatList))
    );
  }

  /**
   * filters data list
   * @param value filter value
   * @param list current list to filter
   */
  filter(value: string, list): string[] {
    const filterValue = value.toLowerCase();
    return list.filter(num => num.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * fetches user personal details from db
   */
  getUserPersonalDetails() {
    this.userService.getUserPersonalDetails().subscribe((data) => {
      if (data) {
        this.currentUserDetails = data;
        this.setValueForFormControl(data);
      }
    });
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
    const personalDetails: UserPersonalDetails = this.currentUserDetails;
    personalDetails.profileKey.userName = this.settingsForm.controls.userName.value;
    personalDetails.name = this.settingsForm.controls.fullName.value;
    personalDetails.publicName = this.settingsForm.controls.preferredName.value;
    personalDetails.phone = this.settingsForm.controls.phone.value;
    personalDetails.pemail = this.settingsForm.controls.primaryEmail.value;
    personalDetails.semail = this.settingsForm.controls.secondaryEmail.value;

    this.userService.updateUserPersonalDetails(personalDetails).subscribe((res) => {
      if (res && res.errorMsg) {
        this.formErrMsg = res.errorMsg;
      }
    });

    return true;
  }

  /**
   * updates current values in profile form
   * @param data existing data for updating in form
   */
  setValueForFormControl(data) {
    if (data.profileKey && data.profileKey.userName) {
      this.settingsForm.controls.userName.setValue(data.profileKey.userName);
    }

    if (data.name) {
      this.settingsForm.controls.fullName.setValue(data.name);
    }

    if (data.publicName) {
      this.settingsForm.controls.preferredName.setValue(data.publicName);
    }

    if (data.phone) {
      this.settingsForm.controls.phone.setValue(data.phone);
    }

    if (data.pemail) {
      this.settingsForm.controls.primaryEmail.setValue(data.pemail);
    }

    if (data.semail) {
      this.settingsForm.controls.secondaryEmail.setValue(data.semail);
    }
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

  /**
   * opens change password dialog
   */
  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      data: {},
      panelClass: 'change-password-dialog',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(msg => {
      if (msg) {
        this.libToast.open(msg, 'Okay', {
          duration: 2000
        });
      }
    });

    return true;
  }

  /**
   * updates language settings
   * @param field form field name
   */
  updateLanguageSettings(field) {
    console.log(this.languageSettingsForm.controls[field].value);
  }
}
