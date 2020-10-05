import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MsteamsConfigService } from '../_service/msteams-config.service';
import * as microsoftTeams from '@microsoft/teams-js';

@Component({
  selector: 'pros-msteam-auth-configuration',
  templateUrl: './msteam-auth-configuration.component.html',
  styleUrls: ['./msteam-auth-configuration.component.scss']
})
export class MsteamAuthConfigurationComponent implements OnInit {
  signInForm = new FormGroup({
    userName : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])
  });

  /**
   * Hold error messgae while login ..
   */
  errorMsg: string;

  constructor(
    private msteamsConfigService: MsteamsConfigService,
  ) { }

  ngOnInit(): void {
    this.signInForm.valueChanges.subscribe(val=>{
      this.errorMsg = '';
    });
  }

  // Notify MS Teams app for success to return to the configuration page of app for report configuration
  notifySuccess(){
    microsoftTeams.initialize();
    microsoftTeams.authentication.notifySuccess();
  }

  // Sign in with user crendentials and save JWT-TOKEN and JWT-REFRESH-TOKEN in localstorage for intercepting purspose
  signIn(){
    const userName = this.signInForm.get('userName').value;
    const password = this.signInForm.get('password').value;
    if(!this.signInForm.valid) {
      this.errorMsg = 'Username or password require ';
      return false;
    }
    this.msteamsConfigService.signIn(userName, password).subscribe(res=>{
      localStorage.setItem('JWT-TOKEN', res.headers.get('JWT-TOKEN'));
      localStorage.setItem('JWT-REFRESH-TOKEN', res.headers.get('JWT-REFRESH-TOKEN'));
      this.notifySuccess();
      this.errorMsg = '';
    },error=>{
      console.error(`Error : ${error}`);
      this.errorMsg = 'Invalid username or password ';
    });;
  }

  /**
   * Set email or username to frmCtrl
   * @param val update username/ email val
   */
  emailChange(val: string) {
    this.signInForm.get('userName').setValue(val)
  }

  /**
   * Update password to form control
   * @param val changed password ..
   */
  passChange(val: string) {
    this.signInForm.get('password').setValue(val);
  }
}
