import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TransientService } from 'mdo-ui-library';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '@services/user/userservice.service';
import { UserPersonalDetails } from '@models/userdetails';

@Component({
  selector: 'pros-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  /**
   * Form control for the input
   */
   optionCtrl2 = new FormControl();

   /**
    * hold the list of filtered options
    */
   filteredOptions: Observable<string[]>;

   /**
    * Available options list
    */
   allOptions: string[] = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

   /**
    * Reference to the input
    */
   @ViewChild('optionInput2') optionInput2: ElementRef<HTMLInputElement>;

   /**
    * reference to auto-complete
    */
   @ViewChild('auto') matAutocomplete: MatAutocomplete;
   selectedValue: any;

   selected: any;


  // settings form
  settingsForm: FormGroup;
  // updates form after user stops editing
  updateForm = false;
  // stores user personal details obtained from db
  currentUserDetails: UserPersonalDetails;
  // stores error message on personal details update
  formErrMsg;

  constructor(private dialog: MatDialog, private libToast: TransientService, private userService: UserService) {
    this.filteredOptions = this.optionCtrl2.valueChanges.pipe(
      startWith(''),
      map((num: string | null) => num ? this._filter(num) : this.allOptions.slice()));
  }

   /**
    * mehtod to filter items based on the searchterm
    * @param value searchTerm
    * @returns string[]
    */
   _filter(value: string): string[] {
     const filterValue = value.toLowerCase();

     return this.allOptions.filter(num => num.toLowerCase().indexOf(filterValue) === 0);
   }

   /**
    * method to add item to selected items
    * for single sleect
    * @param event item
    */
    selectSingle(event: MatAutocompleteSelectedEvent): void {
     this.selectedValue = event.option.value;
   }

  ngOnInit(): void {
    this.createForm();
    this.getUserPersonalDetails();
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
}
