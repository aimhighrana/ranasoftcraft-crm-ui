import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'pros-salesforce-connection',
  templateUrl: './salesforce-connection.component.html',
  styleUrls: ['./salesforce-connection.component.scss']
})
export class SalesforceConnectionComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  breadcrumb: Breadcrumb = {
    heading: 'Salesforce Connection',
    links: [
      {
        link: '/home/schema',
        text: 'Schema group(s)'
      }
    ]
  };


  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });


  }

}
