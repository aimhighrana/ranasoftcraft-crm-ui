import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionOn, UserMdoModel } from '@models/collaborator';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ROLENAMES } from 'src/app/_constants';

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

  subscribers: UserMdoModel[] = [];
  filteredSubscribers: UserMdoModel[] = [];

  submitted = false;

  collaboratorSubscription = new Subscription();

  selectedCollaborators: Array<UserMdoModel> = [];
  incomingSelectedSubscribers: Array<UserMdoModel> = [];
  selectedRoleType: string;
  roles = [
    ROLENAMES.ADMIN,
    ROLENAMES.REVIEWER,
    ROLENAMES.VIEWER,
    ROLENAMES.EDITOR
  ]

  /**
   * Fetch count for subscribers
   */
  fetchCount = 0;

  /**
   * constructor of the class
   * @param dialogRef mat dialog ref object
   * @param data data from parent component
   * @param schemaDetailsService schema deails service object
   * @param snackBar snackbar object
   */
  constructor(
    public dialogRef: MatDialogRef<NewSchemaCollaboratorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public schemaDetailsService: SchemaDetailsService,
    public snackBar: MatSnackBar) {
      if(data && data.selectedSubscibersList && data.selectedSubscibersList.length>0){
        this.incomingSelectedSubscribers = data.selectedSubscibersList;
      }
     }

  /**
   * Angular Hook
   */
  ngOnInit(): void {
    this.initForm();
    this.getCollaborators('', this.fetchCount);
    this.collaboratorSubscription = this.form.controls.field.valueChanges
      .subscribe((value) => {
        this.fetchCount = 0;
        this.getCollaborators(value, this.fetchCount);
      });
  }

/**
 * Initialize form
 */
  initForm(){
    this.form = new FormGroup({
      field: new FormControl('', [Validators.required]),
      fullName: new FormControl(),
      role: new FormControl('', [Validators.required]),
      groupid: new FormControl(''),
      roleId: new FormControl(),
      isAdmin: new FormControl(false),
      isReviewer: new FormControl(false),
      isViewer: new FormControl(false),
      isEditor: new FormControl(false),
      permissionType: new FormControl('USER'),
      initials: new FormControl()
    });
  }


  /**
   * function to add the list of selected users
   * @param event the selected event with selected option
   */
  addSelectedField(event: MatAutocompleteSelectedEvent) {
    this.form.controls.fullName.setValue(event.option.value.fullName);
    this.form.controls.initials.setValue(event.option.value.fName[0] + event.option.value.lName[0]);
  }

  getCollaborators(queryString, fetchCount) {
    this.collaboratorSubscription = this.schemaDetailsService.getAllUserDetails(queryString, fetchCount)
      .subscribe((response: PermissionOn) => {
        const subscribers: UserMdoModel[] = response.users;
        subscribers.forEach((subscriber: UserMdoModel) => {
          subscriber.initials = (subscriber.fName[0] + subscriber.lName[0]).toUpperCase();
          subscriber.selected = false;
          subscriber.userId = subscriber.userId ? subscriber.userId : Math.floor( Math.random() * 1000000000000 ).toString()
        });

        this.subscribers = this.removeSelectedSubscribers(subscribers, this.incomingSelectedSubscribers);
        this.filteredSubscribers = this.removeSelectedSubscribers(subscribers, this.incomingSelectedSubscribers);

      }, () => {
        this.snackBar.open('Error getting subscribers', 'okay', {
          duration: 1000
        })
      });
  }

  removeSelectedSubscribers(allSubscribers, selectedSubscribers){
    return allSubscribers.filter( subscriber =>
      selectedSubscribers.every( selected =>
          selected.userId !== subscriber.userid
      )
  )
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
    this.form.controls.isEditor.setValue(false);

    if (permissions.value === ROLENAMES.ADMIN) {
      this.form.controls.isAdmin.setValue(true)
    }

    if (permissions.value === ROLENAMES.REVIEWER) {
      this.form.controls.isReviewer.setValue(true)
    }

    if (permissions.value === ROLENAMES.VIEWER) {
      this.form.controls.isViewer.setValue(true)
    }

    if (permissions.value === ROLENAMES.EDITOR) {
      this.form.controls.isEditor.setValue(true)
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
        isEditor: this.form.controls.isEditor.value,
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
      if (formObject.isEditor) { formObject.role = 'isEditor' }
      this.dialogRef.close(formObject);
    } else {
      this.snackBar.open('Please enter both the fields', 'okay', { duration: 5000 })
    }
  }


  saveSelection(){
    this.dialogRef.close(this.selectedCollaborators);
  }

  ngOnDestroy() {
    this.collaboratorSubscription.unsubscribe();
  }

  addOrDeleteCollaborator(collaborator: UserMdoModel) {
    const index = this.selectedCollaborators.findIndex(subscriber => subscriber.userId === collaborator.userId);
    if (index>-1) {
      collaborator.selected = false;
      this.selectedCollaborators.splice(index, 1);
    } else {
      collaborator.selected = true;
      this.selectedCollaborators.push(collaborator);
    }
  }

  /**
   *
   * @param role currently selected role
   */
  selectCurrentRole(role: string) {
    this.selectedRoleType = role;
    this.filteredSubscribers = this.subscribers.filter((sub) => sub.roleId === role);
  }
}
