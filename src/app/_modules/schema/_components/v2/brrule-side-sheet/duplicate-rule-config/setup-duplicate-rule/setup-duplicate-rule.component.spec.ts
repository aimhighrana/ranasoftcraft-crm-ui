import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SetupDuplicateRuleComponent } from './setup-duplicate-rule.component';

describe('SetupDuplicateRuleComponent', () => {
  let component: SetupDuplicateRuleComponent;
  let fixture: ComponentFixture<SetupDuplicateRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDuplicateRuleComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDuplicateRuleComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    component.fieldsList = [
      { fieldId: '1', fieldDescri: 'first name' }
    ];

  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */

  it('should filter fields list', () => {

    spyOn(component, 'filter');
    component.searchField('first');
    expect(component.filter).toHaveBeenCalledWith('first');

  });


  it('should get field description', () => {

    expect(component.getFieldDesc('1')).toEqual('first name');

  });

  it('should get field description', () => {

    expect(component.getFieldDesc('1')).toEqual('first name');

  });

  it('should get merge rule field description', () => {

    expect(component.getMergeRuleFieldDesc('USERCREATED')).toEqual('User created');
    expect(component.getMergeRuleFieldDesc('other')).toEqual('select');

  });

  it('should get merge rule type description', () => {

    expect(component.getMergeRuleTypeDesc('NEWEST')).toEqual('Newest Record');
    expect(component.getMergeRuleTypeDesc('other')).toEqual('other');

  });

  it('should filter numeric fields list', () => {

    spyOn(component, 'filter');
    const filteredFields = component.filterNumFields('first');
    expect(component.filter).toHaveBeenCalledWith('first');
    expect(filteredFields.length).toEqual(0);

  });

  it('init duplicate rule form', () => {

    component.initDuplicateRuleForm();
    expect(component.duplicateRuleForm).toBeDefined();
    expect(component.duplicateFieldsObs).toBeDefined();

  });

  it('should add, edit and remove a fields row', () => {

    component.initDuplicateRuleForm();
    component.addFieldRecord('fid');
    expect(component.fieldRecords.length).toEqual(1);

    component.setControlValue('addFields', 'criteria', 'Fuzzy', 0);
    expect(component.fieldRecords.value[0].criteria).toEqual('Fuzzy');

    /* component.removeFormArrayRow('addFields', 0);
    expect(component.fieldRecords.length).toEqual(0); */

  });

  it('should add, edit and remove a master record row', () => {

    component.initDuplicateRuleForm();
    component.addMasterRecord('OLDEST');
    expect(component.masterRecords.length).toEqual(1);

    component.setControlValue('mergeRules', 'fieldId', 'fid', 0);
    expect(component.masterRecords.value[0].fieldId).toEqual('fid');

    /* component.removeFormArrayRow('mergeRules', 0);
    expect(component.masterRecords.length).toEqual(0); */

  });

  it('should add, edit and remove a master record row', () => {

    component.initDuplicateRuleForm();
    component.addMasterRecord('OLDEST');
    expect(component.masterRecords.length).toEqual(1);

    component.setControlValue('mergeRules', 'fieldId', 'fid', 0);
    expect(component.masterRecords.value[0].fieldId).toEqual('fid');

    /* component.removeFormArrayRow('mergeRules', 0);
    expect(component.masterRecords.length).toEqual(0); */

  });

  it('should update field row exclusion', () => {

    component.initDuplicateRuleForm();
    component.addFieldRecord('fid');

    const exclusionData = { fId: 'fid', exclusion: 1, ival: 'customer', sval: 'supplier:vendor' };
    component.updateFieldExclusion(exclusionData);

    expect(component.fieldRecords.value[0].exclusion).toEqual(1);
    expect(component.fieldRecords.value[0].ival).toEqual('customer');
    expect(component.fieldRecords.value[0].sval).toEqual('supplier:vendor');


  });

  it('should not update field row exclusion', () => {

    component.initDuplicateRuleForm();
    component.addFieldRecord('fid');

    const exclusionData = { fId: 'fid2', exclusion: 1, ival: 'customer', sval: 'supplier:vendor' };
    component.updateFieldExclusion(exclusionData);

    expect(component.fieldRecords.value[0].exclusion).toEqual('0');
    expect(component.fieldRecords.value[0].ival).toEqual('');
    expect(component.fieldRecords.value[0].sval).toEqual('');


  });

  it('should prepare duplicate rule for edition', () => {

    component.initDuplicateRuleForm();

    const duplicacyField = [{
      fieldId: 'fid',
      criteria: 'Exact_Match',
      exclusion: '0',
      inverse: '0',
      weightage: '0',
      ival: 'customer',
      sval: 'vendor:supplier'
    }];

    const duplicacyMaster = [{
      ruleType: 'OLDEST',
      fieldId: 'USERMODIFIED',
      RuleId: 'OLDEST1',
      sno: ''
    }];

    const br = new CoreSchemaBrInfo();
    br.duplicacyField = duplicacyField;
    br.duplicacyMaster = duplicacyMaster;

    component.editDuplicateRule(br);

    expect(component.fieldRecords.value.length).toEqual(1);
    expect(component.masterRecords.value.length).toEqual(1);


    expect(component.fieldRecords.value[0].sval).toEqual('vendor:supplier');
    expect(component.masterRecords.value[0].ruleType).toEqual('OLDEST');

    component.initDuplicateRuleForm();
    br.duplicacyField = [];
    br.duplicacyMaster = [];
    component.editDuplicateRule(br);

    expect(component.fieldRecords.value.length).toEqual(0);
    expect(component.masterRecords.value.length).toEqual(0);


  });


  it('should set master criteria field', () => {

    component.initDuplicateRuleForm();
    component.addMasterRecord('OLDEST');
    component.setFieldValue('OLDEST','USERCREATED', 0);

    expect(component.masterRecords.value[0].fieldId).toEqual('USERCREATED');

  });

});
