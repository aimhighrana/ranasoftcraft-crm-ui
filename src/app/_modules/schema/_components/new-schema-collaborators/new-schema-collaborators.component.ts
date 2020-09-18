import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionOn } from '@models/collaborator';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'pros-new-schema-collaborators',
  templateUrl: './new-schema-collaborators.component.html',
  styleUrls: ['./new-schema-collaborators.component.scss']
})
export class NewSchemaCollaboratorsComponent implements OnInit, OnDestroy {

  /**
   * To get the list of users and perform filter
   */
  filteredModules: Observable<{}> = of([]);

  /**
   * form object
   */
  form: FormGroup;

  subscribers = [];

  submitted = false;

  collaboratorSubscription = new Subscription();
  /**
   * constructor of the class
   * @param dialogRef mat dialog ref object
   * @param data data from parent component
   * @param schemaDetailsService schema deails service object
   * @param snackBar snackbar object
   */
  constructor(
    private dialogRef: MatDialogRef<NewSchemaCollaboratorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private schemaDetailsService: SchemaDetailsService,
    private snackBar: MatSnackBar) { }

  /**
   * Angular Hook
   */
  ngOnInit(): void {
    this.form = new FormGroup({
      field: new FormControl('', [Validators.required]),
      fullName: new FormControl(),
      role: new FormControl('', [Validators.required]),
      groupid: new FormControl(''),
      roleId: new FormControl(),
      isAdmin: new FormControl(false),
      isReviewer: new FormControl(false),
      isViewer: new FormControl(false),
      isEditer: new FormControl(false),
      permissionType: new FormControl('USER'),
      initials: new FormControl()
    });
    this.collaboratorSubscription = this.form.controls.field.valueChanges.subscribe((value) => {
      this.getCollaborators(value);
    })
  }

  /**
   * function to add the list of selected users
   * @param event the selected event with selected option
   */
  addSelectedField(event: MatAutocompleteSelectedEvent) {
    this.form.controls.fullName.setValue(event.option.value.fullName);
    this.form.controls.initials.setValue(event.option.value.fName[0] + event.option.value.lName[0]);
  }

  getCollaborators(queryString) {
    this.collaboratorSubscription = this.schemaDetailsService.getAllUserDetails(queryString)
      .subscribe((response: PermissionOn) => {
        this.subscribers = response.users;
      }, () => {
        this.snackBar.open('error getting subscribers', 'okay', {
          duration: 1000
        })
      });
  }

  displayWith(item) {
    return item ? item.fullName : '';
  }

  /**
   * function to close the dialog
   */
  closeDialogComponent() {
    this.dialogRef.close();
  }

  setPermissions(permissions) {
    this.form.controls.isAdmin.setValue(false);
    this.form.controls.isReviewer.setValue(false);
    this.form.controls.isViewer.setValue(false);
    this.form.controls.isEditer.setValue(false);

    if (permissions.value === 'Admin') {
      this.form.controls.isAdmin.setValue(true)
    }

    if (permissions.value === 'Reviewer') {
      this.form.controls.isReviewer.setValue(true)
    }

    if (permissions.value === 'Viewer') {
      this.form.controls.isViewer.setValue(true)
    }

    if (permissions.value === 'Editer') {
      this.form.controls.isEditer.setValue(true)
    }
  }

  /**
   * function to save the subscriber's details
   */
  save() {
    if (this.form.valid) {
      const formObject = {
        isAdmin: this.form.controls.isAdmin.value,
        isReviewer: this.form.controls.isReviewer.value,
        isViewer: this.form.controls.isViewer.value,
        isEditer: this.form.controls.isEditer.value,
        groupid: '',
        roleId: '',
        userid: this.form.controls.field.value.userName,
        permissionType: 'USER',
        initials: this.form.controls.initials.value,
        fullName: this.form.controls.fullName.value,
        role: ''
      }
      if (formObject.isAdmin) { formObject.role = 'isAdmin' }
      if (formObject.isReviewer) { formObject.role = 'isReviewer' }
      if (formObject.isViewer) { formObject.role = 'isViewer' }
      if (formObject.isEditer) { formObject.role = 'isEditer' }
      this.dialogRef.close(formObject);
    } else {
      this.snackBar.open('Please enter both the fields', 'okay', {duration: 5000})
    }
  }

  ngOnDestroy() {
    this.collaboratorSubscription.unsubscribe();
  }
}
