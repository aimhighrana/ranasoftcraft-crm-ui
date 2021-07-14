import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute, AttributeDataType, AttributeDefaultValue } from '@models/schema/classification';
import { GlobaldialogService } from '@services/globaldialog.service';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { TransientService } from 'mdo-ui-library';

@Component({
  selector: 'pros-attribute-default-value',
  templateUrl: './attribute-default-value.component.html',
  styleUrls: ['./attribute-default-value.component.scss']
})
export class AttributeDefaultValueComponent implements OnInit {

  attributeForm: FormGroup;

  ATTRIBUTE_DATA_TYPE = AttributeDataType;

  submitted = false;

  nounSno: string;
  isMapped = false;

  valueList: Array<AttributeDefaultValue> = [];
  searchStr = '';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private globalDialogService: GlobaldialogService,
    private nounModifierService: NounModifierService,
    private schemaDetailsService: SchemaDetailsService,
    private transientService: TransientService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.buildAttributeForm();

    this.activatedRoute.params.subscribe(params => {
      this.nounSno = params.nounSno;
      this.activatedRoute.queryParams.subscribe((queryParams) => {
        this.isMapped = Boolean(queryParams.isMapped === 'true');

      });
    });

  }

  /**
   * Build attribute form
   */
  buildAttributeForm() {
    if (!this.nounModifierService.attributeValuesModels) {
      this.nounModifierService.attributeValuesModels = [];
    }
    this.valueList = this.nounModifierService.attributeValuesModels;
  }

  /**
   * function to return formField
   */
  formField(field: string) {
    return this.attributeForm.get(field);
  }

  /**
   * set form control value
   * @param controlName from control name
   * @param value value to be set
   */
  setControlValue(controlName: string, value) {
    this.attributeForm.get(controlName).setValue(value);
  }

  isValidRow(row: AttributeDefaultValue) {
    return row && row.CODE && row.shortValue
  }

  close() {
    const isAnyInvalidRow = this.valueList.find(row => !this.isValidRow(row));
    if (isAnyInvalidRow) {
      this.transientService.confirm({
        data: { label: 'Empty entries will not be saved. Click Ok to continue.' },
        disableClose: true,
        autoFocus: false,
        backdropClass: 'no-backdrop'
      }, (response) => {
        if (response === 'yes') {
          this.nounModifierService.attributeValuesModels = this.valueList.filter(this.isValidRow);
          this.router.navigate([{ outlets: { [`outer2`]: null } }], {
            queryParams: { isMapped: this.isMapped }
          });
        }
      });
    } else {
      this.nounModifierService.attributeValuesModels = this.valueList;
      this.router.navigate([{ outlets: { [`outer2`]: null } }], {
        queryParams: { isMapped: this.isMapped }
      });
    }
  }

  uploadData() {
    if (document.getElementById('uploadFileCtrl')) {
      document.getElementById('uploadFileCtrl').click();
    }

    return true;
  }

  addValueRow() {
    const valueRow: AttributeDefaultValue = {
      CODE: '',
      shortValue: ''
    };
    this.valueList.unshift(valueRow);
  }

  copyData(i: number) {
    const valueRow = this.valueList[i];
    this.valueList.splice(i + 1, 0, { ...valueRow });
  }

  deleteValueRow(i: number) {
    this.globalDialogService.confirm({
      label: 'Are you sure to delete this?'
    }, (response: string) => {
      console.log('Response', response);
      if (response === 'yes') {
        this.valueList.splice(i, 1);
      }
    });
  }
  doSearch($event) {
    this.searchStr = $event;
    console.log('Search strin', this.searchStr);
  }

  canDisplayRow(row: AttributeDefaultValue) {
    const searchStr = this.searchStr.toLowerCase();
    return !this.searchStr || row.CODE.toLowerCase().includes(searchStr) || row.shortValue.toLowerCase().includes(searchStr);
  }
}
