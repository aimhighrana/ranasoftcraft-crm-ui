import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../../_services/user/userservice.service'
import { Userdetails } from '@models/userdetails';
import { UserMdoModel } from '@models/collaborator';
import { ReportService } from '../../../_service/report.service'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'pros-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit,OnDestroy {
  /* Email Form group */
  emailFormGrp: FormGroup;

   /* Collection to hold users list */
  users: UserMdoModel[] = [];

  /* Collection to hold email recipients list */
  emailRecipients: string[] = [];

  /* Form control for recipients */
  emailTo = new FormControl('', { validators: [Validators.email, Validators.required] });

  /* List to hold filtered users */
  filteredUsers: Observable<UserMdoModel[]>;

  /* Separator codes */
  separatorKeysCodes: number[] = [ENTER, COMMA];

  /* Options for Attachment */
  optionsList = [
    { label: 'PDF', value: 'PDF' },
    { label: 'PPT', value: 'PPT' }
  ]

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private reportService: ReportService) {
  }

  ngOnInit(): void {
    this.setEmailFormGroup();
    this.getCollaboratorPermission('', 0);
    this.getSelectedTemplate();
    this.filterUsers();
    // this.ref.detectChanges();
  }

  /* Close Slidesheet */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /* Navigate to select template slidesheet */
  selectTemplate() {
    this.router.navigate([{ outlets: { sb:`sb/report/send-email`, outer: 'outer/report/email-template' } }]);
  }

  /* Set Email Form group fields */
  setEmailFormGroup() {
    this.emailFormGrp = this.formBuilder.group({
      subject: new FormControl({value:'', disabled:true}, [Validators.required]),
      message: new FormControl('', [Validators.required]),
      to: new FormControl([''], [Validators.required]),
      attachmentType: new FormControl(['']),
    });
  }

  /* Add the selected user */
  selectUser(event: MatAutocompleteSelectedEvent): void {
    this.addRecipients(event.option.viewValue);
  }

  /* Call to api to send email */
  sendEmail() {
    this.emailFormGrp.patchValue({to: this.emailRecipients})
    if (this.emailFormGrp.invalid) {
      (Object).values(this.emailFormGrp.controls).forEach(control => {
        if(control.disabled === true && control.value === '') {
          control.setErrors({required: true});
        }
        if (control.invalid || (control.disabled === true && control.value === '')) {
          control.markAsTouched()
        }
      });
      return false;
    }
  }

  /* Method to add loggedin user as recipient */
  addMyself() {
    this.userService.getUserDetails().subscribe(
      (response: Userdetails) => {
        this.addRecipients(response?.email);
      }, error => console.error(`Error : ${error.message}`)
    );
  }

  /**
   * Get all collaborators permission
   * @param queryString search able string
   */
  getCollaboratorPermission(queryString: string, fetchCount: number) {
    this.reportService.getCollaboratorPermission(queryString, fetchCount).subscribe(response => {
      if (response && response.users) {
        this.users = response.users;
      }
    }, error => console.error(`Error: ${error}`));
  }

  /* Remove selected user */
  remove(user: string): void {
    const index = this.emailRecipients.indexOf(user);

    if (this.recipientExists(user)) {
      this.emailRecipients.splice(index, 1);
    }
  }

  /* Unsubscribe subscriptions */
  ngOnDestroy(){
    this.reportService.selectedTemplate.unsubscribe();
  }

  //#region Subscription
  getSelectedTemplate() {
    this.reportService.selectedTemplate.subscribe(res => {
      if (res) {
        this.emailFormGrp.patchValue({ subject: res.subject, message: res.message });
      }
    })
  }
  //#endregion

  //#region private methods
  private recipientExists(value) {
    return this.emailRecipients.indexOf(value) >= 0 || false;
  }

  private addRecipients(value) {
    if (!this.recipientExists(value)) {
      this.emailRecipients.push(value);
    }
    this.emailTo.setValue(null);
  }

  private _filter(value: string): UserMdoModel[] {
    const filterValue = value?.toLowerCase();

    return this.users?.filter(user => user?.email?.toLowerCase().indexOf(filterValue) === 0);
  }

  public filterUsers(){
    this.filteredUsers = this.emailTo.valueChanges.pipe(
      map((user: string | null) => user ? this._filter(user) : this.users?.slice()));
  }
  //#endregion
}
