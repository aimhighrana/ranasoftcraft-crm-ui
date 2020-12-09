import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobaldialogService } from '@services/globaldialog.service';

@Component({
  selector: 'pros-subscriber-invite',
  templateUrl: './subscriber-invite.component.html',
  styleUrls: ['./subscriber-invite.component.scss']
})
export class SubscriberInviteComponent implements OnInit {

  /**
   * Form object for Invitation
   */
  invitationForm: FormGroup;

  /**
   * constructor of the class
   * @param dialogRef mat dialog ref object
   * @param data data from parent component
   * @param globalDialogService global dialog service object
   */
  constructor(
    public dialogRef: MatDialogRef<SubscriberInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder,
    private globalDialogService: GlobaldialogService) { }

  /**
   * Angular hook
   */
  ngOnInit(): void {
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
      email: '',
      role: ''
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
    this.globalDialogService.confirm({label: 'Sure to delete ?'}, (res) => {
      if(res === 'yes'){
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
    this.dialogRef.close()
  }

  /**
   * method to set value manually to inviteForm
   * @param val Pass the value
   * @param key Pass the form key
   * @param index Pass the index
   */
  setFormValue(val: any, key: string, index: number) {
    const availableControls:any = this.invites().controls[index];
    availableControls.controls[key].setValue(val);
  }
}