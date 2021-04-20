import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'pros-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() {
    this.filteredOptions = this.optionCtrl2.valueChanges.pipe(
      startWith(''),
      map((num: string | null) => num ? this._filter(num) : this.allOptions.slice()));
   }

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

  // mock values for updating form values
  mockValues = {
    userName: 'Test User Name',
    fullName: 'Test',
    preferredName: 'Test Name',
    phone: 21354,
    primaryEmail: 'test@test.com',
    secondaryEmail: 'secEmail@test.com'
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
