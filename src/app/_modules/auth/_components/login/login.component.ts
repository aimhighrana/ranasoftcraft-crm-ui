import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MsteamsConfigService } from '@modules/msteams/_service/msteams-config.service';

@Component({
  selector: 'pros-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * While session expired has return url to navigate that router.
   */
  returnUrl: string;

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
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signInForm.valueChanges.subscribe(val=>{
      this.errorMsg = '';
    });

    this.activatedRouter.queryParams.subscribe(param=>{
      this.returnUrl = param.returnUrl ? param.returnUrl : '';
    });
  }

  /**
   * After successfully loged in
   * Then check .. has redirectUrl is yes then redirect to that url
   * Otherwise navigate to /home
   *
   * Login pre/post processor .. for do authentication ..
   */
  signIn(){
    const userName = this.signInForm.get('userName').value;
    const password = this.signInForm.get('password').value;
    if(!this.signInForm.valid) {
      this.errorMsg = 'Username or password require ';
      return false;
    }
    this.msteamsConfigService.signIn(userName, password).subscribe(res=>{
      localStorage.setItem('JWT-TOKEN', (res['JWT-TOKEN'] ? res['JWT-TOKEN'] : ''));
      localStorage.setItem('JWT-REFRESH-TOKEN', (res['JWT-REFRESH-TOKEN'] ? res['JWT-REFRESH-TOKEN'] :''));
      this.errorMsg = '';

      // after successfully login ... redirect to redirect url
      if(this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.router.navigate(['/home']);
      }
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
