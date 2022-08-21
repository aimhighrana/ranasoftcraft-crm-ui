import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emp-create-update',
  templateUrl: './emp-create-update.component.html',
  styleUrls: ['./emp-create-update.component.scss'],
})
export class EmpCreateUpdateComponent implements OnInit {


  _emp:FormGroup = new FormGroup({});


  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._emp = this.formBuilder.group({
      empName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    })
  }

  register() {
    console.log('clicked');
  }

}
