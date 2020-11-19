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
  styleUrls: ['./subscriber-side-sheet.component.scss'],
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
  * To store subscribers which need to be deleted
  */
 deleteSubscriberArr = [];

  /**
   * Variable to update get subscribers API fetch count
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

      this.getSubscribersBySchemaId(this.schemaId);
    })
  }

  /**
   * Function to get all collaborators/subscribers list to show in drop-down
   * @param queryString: searchString it is used when search subscribers
   * @param fetchCount: Fetch Count to get next batch of subscribers
   */
  getCollaborators(queryString: string, fetchCount: number) {
    this.collaboratorSubscription = this.schemaDetailsService.getAllUserDetails(queryString, fetchCount)
      .subscribe((response: PermissionOn) => {
        if(fetchCount === 0){
          this.subscribers = [];
        }
        response.users.forEach(user => {
          user.isAdd = false;
          this.subscribers = [...this.subscribers, user]
          this.collaboratorData.map((collaborator) => {
            if(collaborator.userid === user.userName){
              user.isAdd = true;
              user.sNo = collaborator.sno;
            }
          })
        })
      }, (error) => {
        console.log('Error while fetching subscribers!!', error.message);
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
    if(this.addSubscriberArr.length > 0){
      this.createUpdateSubscriber(this.addSubscriberArr);
    }
    if(this.deleteSubscriberArr.length > 0) {
      this.deleteSubscriberArr.forEach((subscriber) => {
        this.deleteSubscriber(subscriber.sNo)
      })
    }
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /**
   * Function to Create/Update collaborator/subscriber data
   * @param subscriberInfo data array of subscriber- type is SchemaDashboardPermission
   */
  createUpdateSubscriber(subscriberInfo: SchemaDashboardPermission[]) {
    this.schemaDetailsService.createUpdateUserDetails(subscriberInfo).subscribe(res => {
      this.snackBar.open('Subscriber saved successfully.', 'okay', {duration: 3000});
      this.sharedService.setAfterSubscriberSave(res);
    }, error => {
      console.log('Error while saving subscriber', error.message)
    })
}

  /**
   * Function to get subscribers detail according to the schema id
   * @param schemaId: schema ID
   */
  getSubscribersBySchemaId(schemaId: string) {
    this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((subscriberData) => {
      this.collaboratorData = subscriberData;

      this.getCollaborators('', this.fetchCount);
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
    if(removeSubscriber===undefined || removeSubscriber===null) {
      this.deleteSubscriberArr.push(subscriber);
    }
  }

  /**
   * Function to update fetchCount on scroll
   * @param event: scroll event object
   */
  onScroll(event){
    const viewPortHeight = event.target.offsetHeight; // height of the complete viewport
    const scrollFromTop = event.target.scrollTop;     // height till user has scrolled
    const sideSheetHeight = event.target.scrollHeight; // complete scrollable height of the side sheet document

    const limit = sideSheetHeight - scrollFromTop;
    if(limit === viewPortHeight){
      this.fetchCount++;
      this.getCollaborators('', this.fetchCount);
    }
  }

  /**
   * Function to delete subscriber
   * @param sNo: serial no of subscriber.
   */
  deleteSubscriber(sNo: string) {
    this.schemaDetailsService.deleteCollaborator(sNo).subscribe((response) => {
      console.log('Subscriber Removed..');
      this.sharedService.setAfterSubscriberSave(response);
      // this.router.navigate([{ outlets: { sb: null } }]);
    }, (error) => {
      console.log('Something went wrong while delete subscriber..');
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
