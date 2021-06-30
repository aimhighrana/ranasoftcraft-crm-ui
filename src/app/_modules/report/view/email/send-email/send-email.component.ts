import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../../_services/user/userservice.service'
import { Userdetails } from '@models/userdetails';
import { UserMdoModel } from '@models/collaborator';
import { ReportService } from '../../../_service/report.service'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { EmailRequestBody } from '@modules/report/_models/email';

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
  emailTo = new FormControl(' ', { validators: [Validators.email, Validators.required] });

  /* List to hold filtered users */
  filteredUsers: Observable<UserMdoModel[]>;

  /* Separator codes */
  separatorKeysCodes: number[] = [ENTER, COMMA];

  /* Options for Attachment */
  optionsList = [
    { label: 'PDF', value: 'PDF' },
    { label: 'PPT', value: 'PPT' }
  ]

  /* Subscription list */
  subscriptions: Subscription[] = [];

  /* Email Request Body */
  emailRequestBody: EmailRequestBody;

  /* Report ID */
  reportId: string;

  /* Error message */
  errorMsg: string;

  /* Disable subject input */
  contentEditable = true;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private reportService: ReportService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.reportService.selectedTemplate.next(null);
    this.setEmailFormGroup();
    this.getCollaboratorPermission('', 0);
    this.getSelectedTemplate();
    this.getRequestParam();
  }

  /* Close Slidesheet */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /* Navigate to select template slidesheet */
  selectTemplate() {
    this.router.navigate([{ outlets: { sb:`sb/report/send-email/`+ this.reportId, outer: 'outer/report/email-template' } }]);
  }

  /* Set Email Form group fields */
  setEmailFormGroup() {
    this.emailFormGrp = this.formBuilder.group({
      subject: new FormControl({value:'', disabled: false}, [Validators.required]),
      message: new FormControl('', [Validators.required]),
      to: new FormControl([''], [Validators.required]),
      attachmentType: new FormControl('PDF',),
    });
  }

  /* Add the selected user */
  selectUser(event: MatAutocompleteSelectedEvent): void {
    this.addRecipients(event.option.viewValue);
  }

  /* Call to api to send email */
  sendEmail() {
    /* Validate form first and then call api endpoint */
    if(this.isFormValid()) {
      this.updateEmailForm();

      /* Calling api endpoint to send email */
      this.shareReport();
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
        this.filterUsers();
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
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //#region Subscription
  getSelectedTemplate() {

    const templateSubscription =  this.reportService.selectedTemplate.subscribe(res => {
      if (res) {
        if(res?.emailSubject){
          this.emailFormGrp.controls.subject.disable();
        } else {
          this.emailFormGrp.controls.subject.enable();
        }

        if(res?.emailText){
          this.contentEditable = false;
        } else {
          this.contentEditable = true;
        }

        this.emailFormGrp.patchValue({ subject: res?.emailSubject, message: res?.emailText });
      }
    })

    this.subscriptions.push(templateSubscription);
  }

  public getRequestParam(){
    this.route.params.subscribe((params) => {
      if(!this.reportId) {
        this.reportId = params?.reportId;
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

  public _filter(value: string): UserMdoModel[] {
    const filterValue = value?.toLowerCase();
    if(filterValue){
      return this.users?.filter(user => user?.email?.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.users;
    }

  }

  public filterUsers(){
      this.filteredUsers = this.emailTo.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private updateEmailForm() {
    if(this.emailFormGrp?.controls) {
      this.emailRequestBody = {
        message: this.emailFormGrp.controls.message?.value,
        subject: this.emailFormGrp.controls.subject?.value,
        email: this.emailFormGrp.controls.to?.value,
        attachmentType: this.emailFormGrp.controls.attachmentType?.value,
      }
    }
  }

  public shareReport(){
    this.reportService.shareReport(this.emailRequestBody, this.reportId).subscribe(res =>{
      this.errorMsg = '';
    }, err => {
     this.errorMsg = 'Error while sending email';
    });
  }

  /* To check if form is valid */
  public isFormValid(): boolean{
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

    return true;
  }

  /* Method to add user when added manually, not in the list */
  public addUserManually(email: any) {
    const isEmailValid = this.emailTo.invalid;
    if(email.value && !isEmailValid){
      this.emailTo.setErrors({email: null})
      this.addRecipients(email.value);
    }
  }
  //#endregion
}
