import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedModule } from '@modules/shared/shared.module';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SetupDuplicateRuleComponent } from './setup-duplicate-rule.component';

describe('SetupDuplicateRuleComponent', () => {
  let component: SetupDuplicateRuleComponent;
  let fixture: ComponentFixture<SetupDuplicateRuleComponent>;
  let sharedService: SharedServiceService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDuplicateRuleComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDuplicateRuleComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    sharedService = fixture.debugElement.injector.get(SharedServiceService);
    router = fixture.debugElement.injector.get(Router);

    component.fieldsList = [
      { fieldId: '1', fieldDescri: 'first name' }
    ];

  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */

  it('should filter fields list', () => {

    component.searchField('first');
    expect(component.filteredFieldList.length).toEqual(1);

    component.searchField('last');
    expect(component.filteredFieldList.length).toEqual(0);

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

    component.addFieldRecord('', {});
    expect(component.fieldRecords.length).toEqual(1);

    component.setControlValue('addFields', 'criteria', 'Fuzzy', 0);
    expect(component.fieldRecords.value[0].criteria).toEqual('Fuzzy');

    component.removeFomArrRowAfterConfirm('no','addFields', 0);
    expect(component.fieldRecords.length).toEqual(1);

    component.removeFomArrRowAfterConfirm('yes','addFields', 0);
    expect(component.fieldRecords.length).toEqual(0);

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

    component.patchDuplicateForm(br);

    expect(component.fieldRecords.value.length).toEqual(1);
    expect(component.masterRecords.value.length).toEqual(1);


    expect(component.fieldRecords.value[0].sval).toEqual('vendor:supplier');
    expect(component.masterRecords.value[0].ruleType).toEqual('OLDEST');

    component.initDuplicateRuleForm();
    br.duplicacyField = null;
    br.duplicacyMaster = null;
    component.patchDuplicateForm(br);

    expect(component.fieldRecords.value.length).toEqual(0);
    expect(component.masterRecords.value.length).toEqual(0);


  });


  it('should set master criteria field', () => {

    component.initDuplicateRuleForm();
    component.addMasterRecord('OLDEST');
    component.setFieldValue('OLDEST','USERCREATED', 0);

    expect(component.masterRecords.value[0].fieldId).toEqual('USERCREATED');

    component.addMasterRecord('', {});
    expect(component.masterRecords.controls.length).toEqual(1);


  });

  it('should patch duplicate form on change', () => {

    spyOn(component, 'patchDuplicateForm');

    /* const duplicacyField = [{
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

    const coreSchemaBrInfo = new CoreSchemaBrInfo();
    coreSchemaBrInfo.duplicacyField = duplicacyField;
    coreSchemaBrInfo.duplicacyMaster = duplicacyMaster;

    component.coreSchemaBrInfo = coreSchemaBrInfo; */

    let changes: SimpleChanges = {coreSchemaBrInfo:{currentValue: new CoreSchemaBrInfo(), previousValue: null, firstChange:null, isFirstChange:null}};
    component.ngOnChanges(changes);
    expect(component.patchDuplicateForm).toHaveBeenCalled();

    changes = {fieldsList:{currentValue: [], previousValue: null, firstChange:null, isFirstChange:null}};
    component.ngOnChanges(changes);
    expect(component.duplicateFieldsObs).toBeDefined();

  });

  it('should init component', () => {

    spyOn(component.formChange, 'emit');
    spyOn(component, 'updateFieldExclusion');

    component.ngOnInit();
    expect(component.formChange.emit).toHaveBeenCalled();

    sharedService.setExclusionData({fId:'1',ival:'w1,w2', sval:'customer:client'});
    sharedService.setExclusionData({fId:'1',ival:'w1,w2', sval:'customer:client', editActive: true});
    expect(component.updateFieldExclusion).toHaveBeenCalledTimes(1);
  });

  it('should open exclusion sidesheet', () => {
    spyOn(router, 'navigate');

    component.initDuplicateRuleForm();
    component.addFieldRecord('fid');


    component.exclusionConf(component.fieldRecords.at(0) as FormGroup);
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { outer: 'outer/schema/setup-br-exclusion' } }]);
  })

});
