import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionOn, UserMdoModel } from '@models/collaborator';
import { Observable, of, Subscription } from 'rxjs';
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

  subscribers: UserMdoModel[] = [];
  filteredSubscribers: UserMdoModel[] = [];
  submitted = false;
  collaboratorSubscription = new Subscription();
  selectedCollaborators: Array<UserMdoModel> = [];
  incomingSelectedSubscribers: Array<UserMdoModel> = [];
  selectedRoleType: string;

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
    this.getCollaborators('', this.fetchCount);
  }

  getCollaborators(queryString, fetchCount) {
    this.collaboratorSubscription = this.schemaDetailsService.getAllUserDetails(queryString, fetchCount)
      .subscribe((response: PermissionOn) => {
        const subscribers: UserMdoModel[] = response.users;
        subscribers.forEach((subscriber: UserMdoModel) => {
          subscriber.selected = false;
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
        selected.userid !== subscriber.userName
      )
    )
  }

  /**
   * function to close the dialog
   */
  closeDialogComponent() {
    this.dialogRef.close();
  }

  /**
   * function to save the subscriber's details
   */
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

}