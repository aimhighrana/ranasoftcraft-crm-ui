import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'pros-setup-duplicate-rule',
  templateUrl: './setup-duplicate-rule.component.html',
  styleUrls: ['./setup-duplicate-rule.component.scss']
})
export class SetupDuplicateRuleComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * input property for moduleId
   */
  @Input()
  moduleId: string;

  /**
   * input property for schemaId
   */
  @Input()
  schemaId: string;

  /**
   * input property for business rule
   */
  @Input()
  coreSchemaBrInfo: CoreSchemaBrInfo;

  /**
   * input property for fields list
   */
  @Input()
  fieldsList = [];

  duplicateRuleForm: FormGroup;

  @Input()
  submitted = false;

  @Output()
  formChange: EventEmitter<FormGroup> = new EventEmitter();


  filteredFieldList = [];

  /**
   * Available merge rule types
   */
  MERGE_RULE_TYPES = [
    { label: 'Newest Record', value: 'NEWEST' },
    { label: 'Oldest Record', value: 'OLDEST' },
    { label: 'Maximum value in the field', value: 'MAX' },
    { label: 'Minimum value in the field', value: 'MIN' }
  ];

  /**
   * available merge rule fields
   */
  MERGE_RULE_FIELDS = [
    { label: 'User created', value: 'USERCREATED' },
    { label: 'User modified', value: 'USERMODIFIED' },
    { label: 'Modified On', value: 'APPDATE' },
    { label: 'Date Created', value: 'STAGE' }
  ];

  duplicateFieldsObs: Observable<any> = of(this.fieldsList);

  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: SharedServiceService,
    private router: Router,
    private glocalDialogService: GlobaldialogService) {

    this.initDuplicateRuleForm();

  }


  /**
   * angular hook to detect input value chnages
   * @param changes changes object to detect value changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.coreSchemaBrInfo && changes.coreSchemaBrInfo.currentValue !== changes.coreSchemaBrInfo.previousValue) {
      this.patchDuplicateForm(this.coreSchemaBrInfo);
    }

    if (changes && changes.fieldsList && changes.fieldsList.currentValue !== changes.fieldsList.previousValue) {
      this.duplicateFieldsObs = this.duplicateRuleForm.get('fieldSearch').valueChanges.pipe(
        startWith(''),
        map(value => this.filter(value))
      );
    }

  }


  /**
   * Angular hook
   */
  ngOnInit() {

    // emit duplicate form ref to parent component for validation and value
    this.formChange.emit(this.duplicateRuleForm);

    this.subscriptions.push(this.sharedService.getExclusionData()
      .subscribe(data => {
        if (data && !data.editActive) {
          this.updateFieldExclusion(data);
        }
      })
    )

  }

  /**
   * Initialize duplicate rule form
   */
  initDuplicateRuleForm() {

    this.duplicateRuleForm = this.formBuilder.group({
      fieldSearch: [''],
      addFields: this.formBuilder.array([]),
      selCriteria: this.formBuilder.array([]),
      mergeRules: this.formBuilder.array([]),
      removeList: this.formBuilder.array([])
    });

  }

  /**
   * Patch existing duplicate data
   * @param br pass the business rule data
   */
  patchDuplicateForm(br: CoreSchemaBrInfo) {

    const duplicacyField = br.duplicacyField || [];
    const duplicacyMaster = br.duplicacyMaster || [];

    console.log('duplicacy fields ', duplicacyField);
    console.log('duplicacy Master ', duplicacyMaster);

    duplicacyField.forEach(field => this.addFieldRecord(field.fieldId, field));
    duplicacyMaster.forEach(master => this.addMasterRecord(master.ruleType, master));

    this.formChange.emit(this.duplicateRuleForm);
  }


  /**
   * function to filter the list
   * @param val fitering text
   */
  filter(val: string): any[] {
    return this.fieldsList.filter(option => {
      return option.fieldDescri.toString().toLowerCase().indexOf(val.toLowerCase()) > -1;
    })
  }

  /**
   * create a field row for duplicate rules
   */
  createFieldRecord(fId, row?) {
    return this.formBuilder.group({
      fId: [row ? row.fId || row.fieldId : fId, Validators.required],
      criteria: [row && row.criteria ? row.criteria : '', Validators.required],
      exclusion: [row ? row.exclusion : '0'],
      inverse: [row ? row.inverse : '0'],
      weightage: [row ? row.weightage : '0'],
      ival: [row && row.ival ? row.ival : ''],
      sval: [row && row.sval ? row.sval : '']
    });
  }


  /*     createSelectionRow(fldId?){
        return this.formBuilder.group({
          fldId: [fldId ? fldId : '', Validators.required],
          selection: ['Pick_From_The_Record'],
          txtVal: ['']
        });
      } */

  createMasterRecord(ruleType, row?) {
    return this.formBuilder.group({
      ruleType: [row ? row.ruleType : ruleType],
      fieldId: [row ? row.fieldId : '', Validators.required],
      RuleId: [row ? row.RuleId : ruleType + (this.masterRecords.value.length + 1)],
      sno: [row ? row.sno : '']
    });
  }

  /**
   * add a field row for duplicate rules
   * @param fieldId to be set as value
   */
  addMasterRecord(ruleType, row?) {

    if (!ruleType && !row.ruleType) {
      return;
    }

    this.masterRecords.push(
      this.createMasterRecord(ruleType, row)
    );
  }

  /* addSelectionRow(fldId){
        if(!this.duplicateRuleForm.get('selCriteria').value.some(v => v.fldId === fldId)){
          (this.duplicateRuleForm.get('selCriteria') as FormArray)
            .push(
              this.createSelectionRow(fldId)
            ) ;
        }
      } */

  addFieldRecord(fieldId, row?) {

    if (!fieldId && !row.fieldId && !row.fId) {
      return;
    }

    if (!this.fieldRecords.value.some(v => v.fId === fieldId)) {
      this.fieldRecords.push(
        this.createFieldRecord(fieldId, row)
      );
    } else {
      this.snackBar.open('Field already added', 'okay', { duration: 4000 });
    }
  }

  /**
   * remove an array row from duplicate rule form
   * @param formArrayName name of the form array
   * @param index row index to be removed
   */
  removeFormArrayRow(formArrayName, index) {

    this.glocalDialogService.confirm({label:'Are you sure you want to delete this ?'}, (resp) => {
      this.removeFomArrRowAfterConfirm(resp, formArrayName, index);
    })

  }

  removeFomArrRowAfterConfirm(resp, formArrayName, index) {
    if (resp && resp === 'yes') {
      (this.duplicateRuleForm.get(formArrayName) as FormArray)
        .removeAt(index)
    }
  }


  searchField(searchText) {
    this.filteredFieldList = this.filter(searchText);
  }

  getFieldDesc = (fieldId) => {
    const field = this.fieldsList.find(f => f.fieldId === fieldId);
    return field ? field.fieldDescri : fieldId;
  }

  get fieldRecords() {
    return this.duplicateRuleForm.get('addFields') as FormArray;
  }

  get masterRecords() {
    return this.duplicateRuleForm.get('mergeRules') as FormArray;
  }

  /**
   * set control value for duplicate rule form arrays
   * @param arrayName name of the form array
   * @param controlName name of the control
   * @param value value to set
   * @param index index of the form group inside the form array
   */
  setControlValue(arrayName, controlName, value, index) {
    (this.duplicateRuleForm.get(arrayName) as FormArray)
      .at(index).get(controlName).setValue(value);
  }

  dropField(event) {

    if (event.previousIndex === event.currentIndex) {
      return;
    }

    // moveItemInArray((this.duplicateRuleForm.get('fields') as FormArray).controls, event.previousIndex, event.currentIndex);
    const formArray = this.fieldRecords;
    const dir = event.currentIndex > event.previousIndex ? 1 : -1;

    const from = event.previousIndex;
    const to = event.currentIndex;

    const temp = formArray.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }

    formArray.setControl(to, temp);
  }

  getMergeRuleFieldDesc(fieldId) {
    const type = this.MERGE_RULE_FIELDS.find(t => t.value === fieldId);
    return type ? type.label : 'select';
  }

  getMergeRuleTypeDesc(ruleType) {
    const type = this.MERGE_RULE_TYPES.find(t => t.value === ruleType);
    return type ? type.label : ruleType;
  }

  /**
   * open exclusion sidesheet for edition
   * @param item selected field details
   */
  exclusionConf(item: FormGroup) {
    const data = { fId: item.value.fId, exclusion: item.value.exclusion, ival: item.value.ival, sval: item.value.sval, editActive: true };
    this.sharedService.setExclusionData(data)
    this.router.navigate(['', { outlets: { sb3: 'sb3/schema/setup-br-exclusion' } }]);
  }

  /**
   * update field exclusion
   * @param data new exclusion data
   */
  updateFieldExclusion(data) {

    const fieldIndex = this.fieldRecords.value.findIndex(field => field.fId === data.fId);
    if (fieldIndex !== -1) {
      const fieldGroup = this.fieldRecords.at(fieldIndex);
      fieldGroup.patchValue({
        exclusion: data.exclusion,
        ival: data.ival,
        sval: data.sval
      });

      this.sharedService.setExclusionData(null);

    }
  }

  filterNumFields(value) {
    const textFilteredList = this.filter(value) || [];
    return textFilteredList.filter(field => field.picklist === '0' && (field.dataType === 'NUMC' || field.dataType === 'DESC'));
  }

  setFieldValue(ruleType, fieldId, index) {
    const rulesValue = this.masterRecords.value;
    if (!rulesValue.some((rule, position) => (position !== index) && (rule.fieldId === fieldId) && (rule.ruleType === ruleType))) {
      this.setControlValue('mergeRules', 'fieldId', fieldId, index);
    } else {
      this.snackBar.open('Field already added !', 'okay', { duration: 3000 });
    }
  }

  getDuppCriteriaDesc(criteria) {
    if (!criteria) {
      return 'Select';
    }
    return (criteria === 'Exact_Match') ? 'Exact match'
      : criteria === 'Fuzzy' ? 'Fuzzy' : '';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
