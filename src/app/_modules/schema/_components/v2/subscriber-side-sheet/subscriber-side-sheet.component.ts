import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PermissionOn } from '@models/collaborator';
import { Router, ActivatedRoute } from '@angular/router';
import { SchemaDashboardPermission } from '@models/collaborator';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

@Component({
  selector: 'pros-subscriber-side-sheet',
  templateUrl: './subscriber-side-sheet.component.html',
  styleUrls: ['./subscriber-side-sheet.component.scss']
})
export class SubscriberSideSheetComponent implements OnInit, OnDestroy {

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

  moduleId: string;
  schemaId: string;
  subscriberId: string;

  collaboratorData: SchemaDashboardPermission[] = [];

  collaboratorSubscription = new Subscription();
  /**
   * constructor of the class
   * @param dialogRef mat dialog ref object
   * @param data data from parent component
   * @param schemaDetailsService schema deails service object
   * @param snackBar snackbar object
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
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

    this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;
      this.subscriberId = params.subscriberId;


      if (this.subscriberId !== 'new') {
        this.getSubscriberBySno(this.schemaId, this.subscriberId)
        console.log(this.getSubscriberBySno(this.schemaId, this.subscriberId));
      }

      if (this.subscriberId === 'new') {
        this.getSubscribersBySchemaId(this.schemaId);
      }
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

  /**
   * Function to get all collaborators/subscribers list to show in drop-down
   */
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

  /**
   * Function to get subscriber information according to the serial no
   * This function will be in used when we will edit subscriber details
   * @param schemaId Id of the current schema
   * @param sNo serial no of the subscriber/collaborator
   */
  getSubscriberBySno(schemaId: string, sNo: string) {
    this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((collaborator) => {
      this.collaboratorData = collaborator;

      this.collaboratorData.filter((data) => {
        if (data.sno.toString() === sNo) {
          this.form.controls.field.setValue(data.userMdoModel);
          this.form.controls.field.disable({ onlySelf: true, emitEvent: true })

          if (data.isAdmin) {
            this.form.controls.role.setValue('Admin')
          }
          if (data.isEditer) {
            this.form.controls.role.setValue('Editer')
          }
          if (data.isReviewer) {
            this.form.controls.role.setValue('Reviewer')
          }
          if (data.isAdmin === false && data.isEditer === false && data.isReviewer === false) {
            this.form.controls.role.setValue('Viewer')
          }
          return data;
        }
      })
    })
  }

  /**
   * Function to use with autocomplete form field to show collaborators/subscribers name
   */
  displayWith(item) {
    return item ? item.fullName : '';
  }

  /**
   * function to close the sidesheet
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
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
        sno: this.subscriberId === 'new' ? (Math.floor(Math.random() * Math.pow(100000, 2))) : this.subscriberId,
        schemaId: this.schemaId,
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
        role: '',
        plantCode: ''
      }
      if (formObject.isAdmin) { formObject.role = 'isAdmin' }
      if (formObject.isReviewer) { formObject.role = 'isReviewer' }
      if (formObject.isViewer) { formObject.role = 'isViewer' }
      if (formObject.isEditer) { formObject.role = 'isEditer' }

      const subscriberData = [];
      subscriberData.push(formObject);
      console.log(subscriberData)

      let existingSubscriber = false;
      if (this.subscriberId === 'new') {
        this.collaboratorData.forEach((collaborator) => {
          if (collaborator.userid === formObject.userid) {
            existingSubscriber = true;
            this.snackBar.open('Subscriber already exists', 'okay', {
              duration: 3000
            })
          }
        })
      }
      if (this.subscriberId !== 'new' || existingSubscriber === false) {
        this.collaboratorData.forEach((collaborator) => {
          if (collaborator.userid === formObject.userid) {
            collaborator.filterCriteria ? (subscriberData[0].filterCriteria = collaborator.filterCriteria) : (subscriberData[0].filterCriteria = [])
            }})
        this.createUpdateSubscriber(subscriberData)
      }
    } else {
      this.snackBar.open('Please enter both the fields', 'okay', {duration: 3000})
    }
  }

  /**
   * Function to Create/Update collaborator/subscriber data
   * @param subscriberInfo data array of subscriber- type is SchemaDashboardPermission
   */
  createUpdateSubscriber(subscriberInfo: SchemaDashboardPermission[]) {
    this.schemaDetailsService.createUpdateUserDetails(subscriberInfo).subscribe(res => {
      this.snackBar.open('Subscriber saved successfully.', 'okay', {duration: 3000});
      this.sharedService.setAfterSubscriberSave(res);
      this.router.navigate([{ outlets: { sb: null } }]);
    }, error => {
      console.log('Error while saving subscriber', error.message)
    })
  }

  /**
   * Function to get subscribers detail according to the schema id
   */
  getSubscribersBySchemaId(schemaId: string) {
    this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((subscriberData) => {
      this.collaboratorData = subscriberData;
    })
  }


  /**
   * ANGULAR HOOK
   * To destroy/close subscription
   */
  ngOnDestroy() {
    this.collaboratorSubscription.unsubscribe();
  }

}
