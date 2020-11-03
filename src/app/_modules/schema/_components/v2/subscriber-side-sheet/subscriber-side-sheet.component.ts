import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
   * To store subscribers which need to be added for schema
   */
  addSubscriberArr = [];

  /**
   * To have subscribers those are availble to add..
   */
  availableSubscribers = [];


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

    this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;
      this.subscriberId = params.subscriberId;

      this.getCollaborators('');
    })
  }

  /**
   * Function to get all collaborators/subscribers list to show in drop-down
   */
  getCollaborators(queryString) {
    this.collaboratorSubscription = this.schemaDetailsService.getAllUserDetails(queryString)
      .subscribe((response: PermissionOn) => {
        this.subscribers = response.users;
        this.subscribers.forEach(subscriber => {
          subscriber.isAdd = false;
        })
        this.getSubscribersBySchemaId(this.schemaId)
      }, () => {
        this.snackBar.open('error getting subscribers', 'okay', {
          duration: 1000
        })
      });
  }

  /**
   * function to close the sidesheet
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }


  /**
   * function to save the subscriber's details
   */
  save() {
    this.createUpdateSubscriber(this.addSubscriberArr);
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
      this.collaboratorData.forEach(collaborator => {
        const user = this.subscribers.filter(subscriber => subscriber.userName === collaborator.userid)[0];
        const index = this.subscribers.indexOf(user);
        this.subscribers.splice(index, 1)
      });
      this.availableSubscribers = this.subscribers;
    })
  }

  /**
   * to convert name into shortName for subscriber tab
   * @param fname firstName of the subscriber
   * @param lname lastName of the subscriber
   */
  public shortName(fName: string, lName: string) {
    if (fName.length >= 1 && lName.length >= 1) {
      return fName[0] + lName[0];
    } else {
      return '';
    }
  }

  /**
   * Function to add subscriber
   * @param subscriber subscriber object
   */
  addSubscriber(subscriber: any){
    subscriber.isAdd = true;
    const subscriberData = {
        sno: this.subscriberId === 'new' ? (Math.floor(Math.random() * Math.pow(100000, 2))) : this.subscriberId,
        schemaId: this.schemaId,
        isAdmin: false,
        isReviewer: false,
        isViewer: false,
        isEditer: false,
        groupid: '',
        roleId: '',
        userid: subscriber.userName,
        permissionType: 'USER',
        initials: this.shortName(subscriber.fName, subscriber.lName),
        fullName: subscriber.fullName,
        role: '',
        plantCode: ''
    }
    this.addSubscriberArr.push(subscriberData);
  }

  /**
   * Function to remove subscriber
   * @param subscriber subscriber object
   */
  uncheckSubscriber(subscriber: any){
    subscriber.isAdd = false;
    const removeSubscriber = this.addSubscriberArr.filter(user => user.userid === subscriber.userid)[0];
    const index = this.addSubscriberArr.indexOf(removeSubscriber)
    this.addSubscriberArr.splice(index, 1);
  }

  /**
   * ANGULAR HOOK
   * To destroy/close subscription
   */
  ngOnDestroy() {
    this.collaboratorSubscription.unsubscribe();
  }

}
