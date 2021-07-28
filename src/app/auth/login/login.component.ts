import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  login: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.login = this.fb.group({
      username : new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required])
    });

    this.login.valueChanges.subscribe(val=>{
      console.log(val);
    });
  }


  doSignin() {
    console.log('Sign process started !!!');
    this.router.navigate(['tabs','home']);
  }

}
