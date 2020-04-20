import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { SchemaGroupWithAssignSchemas } from 'src/app/_models/schema/schema';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { BusinessRuleList, BusinessRuleType } from 'src/app/_modules/admin/_components/module/business-rules/business-rules.modal';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


export const filter = (opt, value: string) => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.fieldDescri.toLowerCase().indexOf(filterValue) === 0);
};


@Component({
  selector: 'pros-missingrule',
  templateUrl: './missingrule.component.html',
  styleUrls: ['./missingrule.component.scss']
})
export class MissingruleComponent implements OnInit {

  arrList: any;
  description: string;
  fillDetailsSelectFields: any;
  fillDetailsFinalDropdownList: any;
  moduleListData: any = [];
  inputCtrlData = new FormControl();
  searchFilterData: any;
  headersData: any = [];
  gridsData: any = [];
  hierarchyData: any = [];
  gridFieldsData: any = [];
  hierarchyFieldsData: any = [];
  panelOpenState = false;
  enablingFinishButton = false;
  finalList: any = []
  moduleId: any;
  groupId: any;
  requestParams: BusinessRuleList = new BusinessRuleList();

  @Input() brLength: number;
  @Input() brType: string;
  @Input() brData: BusinessRuleList;
  @Input() paramsData;
  @Output() loadParentPage = new EventEmitter();

  @ViewChild('moduleSearchInp') moduleSearchInp: ElementRef;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  groupDetailss = [];
  groupDetails: SchemaGroupWithAssignSchemas;

  constructor(private schemaService: SchemaService, private _formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar) {

    this.groupDetails = new SchemaGroupWithAssignSchemas();
    this.fillDetailsSelectFields = of([]);
    this.fillDetailsFinalDropdownList = of([]);
  }

  fillDataForm: FormGroup;
  // fillDataForm: FormGroup = this._formBuilder.group({
  //   selectFields: '',
  // })

  private filterGroup(val: string) {
    if (typeof val === 'string') {
      return this.finalList
        .map(group => ({ letter: group.key, names: filter(group.value, val), length: group.length }))
        .filter(group => group.names.length > 0);
    }

    return this.finalList;
  }


  openPanel(): void {
    this.fillDataForm.controls.selectFields.setValue('');
  }

  ngOnInit(): void {

    console.log('paramsData', this.paramsData, this.brData);

    // this.activatedRoute.params.subscribe(params => {
    //   this.moduleId = params.moduleId;
    //   this.groupId = params.groupId
    // })

    this.fillDataForm = this._formBuilder.group({
      selectFields: '',
    })

    this.fillDetailsData();
    this.editDataUpdate();

    this.moduleListData = this.fillDataForm.get('selectFields').valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterGroup(value))
      );
  }

  editDataUpdate() {
    if (this.brData) {
      this.description = this.brData ? this.brData.brInfo : null;
      this.enableFinishBtn();
    }
  }


  fillDetailsData() {
    this.schemaService.getFillDataDropdownData(this.paramsData.moduleId).subscribe(res => {
      const response: any = res;
      this.headersData = this.splitObjKeyValuePair(response.headers, false);
      this.gridsData = response.grids;
      this.hierarchyData = response.hierarchy;
      this.gridFieldsData = this.getDesciption(response.gridFields, 'grid');
      // this.gridFieldsData = this.splitObjKeyValuePair(res['gridFields'], true, 'grid');
      this.hierarchyFieldsData = this.getDesciption(response.hierarchyFields, 'hierarchy');
      if (this.brData && res) {
        this.loopFieldsData(response);
      }
    })
  }


  loopFieldsData(res) {
    const splitList = this.brData.fields.split(',')
    splitList.map((sp) => {
      for (const key in res) {
        if (key) {
          Object.values(res[key]).forEach((value) => {
            const val: any = value;
            if (sp === val.fieldId) {
              this.groupDetailss.push({ id: val.fieldId, descr: val.fieldDescri })
            }
          })
        }
      }
      this.enableFinishBtn();
    })
  }


  getDesciption(data, action) {

    const self = this;
    let obj;

    if (data) {

      Object.entries(data).forEach(([ky, val], i) => { // loop through keys array

        obj = { key: ky, val: Object.values(val) }

        if (action === 'grid') {

          Object.entries(self.gridsData).forEach(([k, v]) => {
            const vv: any = v;
            if (obj.key === k) {
              this.finalList.push({ key: vv.fieldDescri, value: obj.val, length: obj.val.length });
            }
          })
        }
        if (action === 'hierarchy') {

          self.hierarchyData.forEach((hdata) => {

            if (hdata.heirarchyId === obj.key) {
              this.finalList.push({ key: hdata.heirarchyText, value: obj.val, length: obj.val.length });
            }
          })
        }
      });
    }
  }


  splitObjKeyValuePair(list, bool) {
    let values: any;

    Object.entries(list).forEach(([kkey, val]) => {

      if (bool) {
        values = Object.values(val)

      }
      else {
        values = [val];
      }
      this.finalList.push({ key: kkey, value: values, length: values.length });
      this.fillDetailsFinalDropdownList = of(this.finalList);
    });

  }


  onSelect(data) {
    const loopData: any = [];
    const selData = data;

    this.groupDetailss.map((gd) => {
      if (gd.id === selData.fieldId) {
        loopData.push(true);
      }
      else {
        loopData.push(false)
      }
    })



    if (loopData.includes(true)) {
      return;
    }

    this.groupDetailss.push({ id: selData.fieldId, descr: selData.fieldDescri });
    this.enableFinishBtn()
  }

  remove(objectId: string): void {
    const objectIds: any = this.groupDetailss ? this.groupDetailss : [];
    const index = objectIds.indexOf(objectId);
    if (index >= 0) {
      objectIds.splice(index, 1);
      this.groupDetailss = objectIds;
    }
  }

  callParentPage() {
    this.loadParentPage.emit();
  }

  storeData(res) {
    let list;
    list = JSON.parse(sessionStorage.getItem('brsList')) || [];
    list.push(res);
    sessionStorage.setItem('brsList', JSON.stringify(list));
  }

  enableFinishBtn() {
    this.enablingFinishButton = false;
    if (this.description && this.groupDetailss.length > 0) {
      this.enablingFinishButton = true;
    }
  }

  convertObjtoString() {
    const list = [];
    this.groupDetailss.map((ls) => {
      list.push(ls.id);
    })
    return list.toString();
  }

  returnBrtype() {
    if (this.brType === 'missingRule') {
      return BusinessRuleType.missingRuleBrType;
    }
    else if (this.brType === 'metaDataRule') {
      return BusinessRuleType.meteDataRuleType;
    }
  }

  saveBrInfo() {
    this.requestParams.sno = null;
    this.requestParams.brId = null;
    this.requestParams.brType = this.returnBrtype();
    this.requestParams.refId = null;
    this.requestParams.fields = this.convertObjtoString();
    this.requestParams.regex = '';
    this.requestParams.order = this.brLength;
    this.requestParams.message = this.description;
    this.requestParams.script = '';
    this.requestParams.brInfo = this.description;
    this.requestParams.brExpose = 0;
    this.requestParams.status = '1';
    this.requestParams.categoryId = null;
    this.requestParams.standardFunction = '';
    this.requestParams.brWeightage = null;
    this.requestParams.totalWeightage = 100;
    this.requestParams.transformation = 0;
    this.requestParams.tableName = '';
    this.requestParams.qryScript = '';
    this.requestParams.dependantStatus = null;
    this.requestParams.plantCode = '0';
    this.requestParams.percentage = 100;
    this.requestParams.schemaId = null;

    this.schemaService.createBusinessRule(this.requestParams).subscribe(res => {
      console.log('Response = ', res)
      if (res) {
        this.storeData(res);
        this.callParentPage();
      }
    }, error => {
      this.snackBar.open(`Error : ${error.message}`, 'Close', { duration: 2000 });
    })
  }

}
