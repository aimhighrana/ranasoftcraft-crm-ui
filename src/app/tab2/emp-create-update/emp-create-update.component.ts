import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp-create-update',
  templateUrl: './emp-create-update.component.html',
  styleUrls: ['./emp-create-update.component.scss'],
})
export class EmpCreateUpdateComponent implements OnInit {


  _emp:FormGroup = new FormGroup({});


  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this._emp = this.formBuilder.group({
      empName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    });

    this._emp.valueChanges.subscribe(v=>{
      console.log(v);
    })
  }

  register() {
    console.log('clicked');
  }

  close() {
    this.router.navigate(['afl','tabs','employee']);
  }

}
