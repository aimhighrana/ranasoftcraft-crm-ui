import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'pros-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;

  displayedColumns = ['excel','mapping','field', 'check'];
  dataSource = [{
    excelFld:'Object Number',
    mdoFld:'Mdo Fld2',
    isChecked: false
  },{
    excelFld:'Construction Type ',
    mdoFld:'Mdo Fld2',
    isChecked: false
  },{
    excelFld:'Unit of weight',
    mdoFld:'Mdo Fld2',
    isChecked: false
  },{
    excelFld:'Postal code',
    mdoFld:'Mdo Fld2',
    isChecked: false
  },{
    excelFld:'Sales office',
    mdoFld:'Mdo Fld2',
    isChecked: false
  },{
    excelFld:'Region',
    mdoFld:'Mdo Fld2',
    isChecked: false
  }];



  breadcrumb: Breadcrumb = {
    heading: 'Upload Data',
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
    this.threeFormGroup = this._formBuilder.group({
      threeCtrl: ['', Validators.required]
    });
  }

}
