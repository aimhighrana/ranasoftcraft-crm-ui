import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionType, SchemaDashboardPermission } from '@models/collaborator';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

@Component({
  selector: 'pros-subscriber-invite-sidesheet',
  templateUrl: './subscriber-invite-sidesheet.component.html',
  styleUrls: ['./subscriber-invite-sidesheet.component.scss']
})
export class SubscriberInviteSidesheetComponent implements OnInit {

  /**
   * Form object for Invitation
   */
  invitationForm: FormGroup;
  submitted = false;

  /**
   * Id of schema for which subscribers will be invited
   */
  schemaId: string;


  /**
   * constructor of the class
   * @param globalDialogService global dialog service object
   * @param schemaDetailsService schema details service
   * @param snackBar mat snackbar for notifications
   */
  constructor(
    private _formBuilder: FormBuilder,
    private globalDialogService: GlobaldialogService,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  /**
   * Angular hook
   */
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.schemaId = params.schemaId;
    })

    this.initInviteForm();
  }

  /**
   * Initiate the invitation form
   */
  initInviteForm() {
    this.invitationForm = this._formBuilder.group({
      invites: this._formBuilder.array([])
    });

    this.invitationForm.valueChanges.subscribe((formData) => {
    });

    this.addFormRow();
  }

  /**
   * create new invite form group
   */
  newInvite(): FormGroup {
    return this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  /**
   * Add a form row to invites array
   */
  addFormRow() {
    this.invites().push(this.newInvite());
  }

  /**
   * remove a form row to invites array
   * @param inviteIndex pass the row index to remove
   */
  removeInvite(inviteIndex: number) {
    this.globalDialogService.confirm({ label: 'Sure to delete ?' }, (res) => {
      if (res === 'yes') {
        this.invites().removeAt(inviteIndex);
      }
    });
  }

  /**
   * return the formArray value
   */
  invites(): FormArray {
    return this.invitationForm.get('invites') as FormArray;
  }

  /**
   * Close the dialog
   */
  closeDialog() {
    this.router.navigate([{outlets: {outer: null}}])
  }

  /**
   * Call api to send invite
   */
  sendInvitation() {
    this.submitted = true;
    if(!this.invitationForm.valid){
      this.snackBar.open('Please enter the required fields', 'Dismiss');
      return;
    }
    const body: SchemaDashboardPermission[] = []
    const formData = this.invitationForm.value.invites;
    formData.map((data) => {
      if(data.email){
        body.push(this.mapSubscribers(data));
      }
    });

    this.schemaDetailsService.createUpdateUserDetails(body)
      .subscribe((res) => {
        this.sharedService.setAfterSubscriberSave(res);
        this.closeDialog();
        this.invitationForm.reset();
      })
  }

  /**
   * map subscribers data to correct format for api call
   * @param param pass the form data
   */
  mapSubscribers({email, role}): SchemaDashboardPermission {
    return {
       description: '',
       filterCriteria: [],
       groupHeaderModel: null,
       groupid: '',
       isAdmin: role === 'admin',
       isEditer: role === 'editer',
       isReviewer: role === 'reviewer',
       isViewer: role === 'viewer',
       permissionType: PermissionType.USER,
       plantCode: '',
       roleId: '',
       rolesModel: null,
       schemaId: this.schemaId,
       sno: Math.floor(Math.random() * 100000000000).toString(),
       userMdoModel: null,
       userid: email,
       dataAllocation: null,
       isCopied: false,
       isInvited: true
    }
  }

  /**
   * method to set value manually to inviteForm
   * @param val Pass the value
   * @param key Pass the form key
   * @param index Pass the index
   */
  setFormValue(val: any, key: string, index: number) {
    const availableControls: any = this.invites().controls[index];
    availableControls.controls[key].setValue(val);
  }

}