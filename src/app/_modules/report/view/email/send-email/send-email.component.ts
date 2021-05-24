import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../../_services/user/userservice.service'
import { Userdetails } from '@models/userdetails';
import { UserMdoModel } from '@models/collaborator';
import { ReportService } from '../../../_service/report.service'
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'pros-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit,OnDestroy {

  emailFormGrp: FormGroup;
  users: UserMdoModel[] = [];
  emailRecipients: string[] = [];
  emailTo = new FormControl('', { validators: [Validators.email, Validators.required] });
  filteredUsers: Observable<UserMdoModel[]>;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private reportService: ReportService) {

  }

  ngOnInit(): void {
    this.setEmailFormGroup();
    this.getCollaboratorPermission('', 0);
    this.getSelectedTemplate();
    this.filteredUsers = this.emailTo.valueChanges.pipe(
      map((user: string | null) => user ? this._filter(user) : this.users?.slice()));
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  selectTemplate() {
    this.router.navigate([{ outlets: { outer: 'outer/report/email-template' } }]);
  }

  /* Set Email Form group fields */
  setEmailFormGroup() {
    this.emailFormGrp = this.formBuilder.group({
      subject: new FormControl(''),
      message: new FormControl(''),
      to: new FormControl([''], [Validators.email, Validators.required]),
    });
  }

  selectUser(event: MatAutocompleteSelectedEvent): void {
    this.addRecipients(event.option.viewValue)
  }

  /* Call to api to send email */
  sendEmail() {
    this.emailFormGrp.patchValue({to: this.emailRecipients})
    if (this.emailFormGrp.invalid) {
      (Object).values(this.emailFormGrp.controls).forEach(control => {
        if (control.invalid) {
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

  /* Add selected user */
  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim() && !this.recipientExists(value)) {
        this.emailRecipients.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.emailTo.setValue(null);
    }
  }

  remove(user: string): void {
    const index = this.emailRecipients.indexOf(user);

    if (this.recipientExists(user)) {
      this.emailRecipients.splice(index, 1);
    }
  }

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

    this.userInput.nativeElement.value = '';
    this.emailTo.setValue(null);
  }

  private _filter(value: string): UserMdoModel[] {
    const filterValue = value?.toLowerCase();

    return this.users?.filter(user => user?.email?.toLowerCase().indexOf(filterValue) === 0);
  }
  //#endregion
}
