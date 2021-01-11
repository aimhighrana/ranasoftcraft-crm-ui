import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrruleSideSheetComponent } from './brrule-side-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SetupDuplicateRuleComponent } from './duplicate-rule-config/setup-duplicate-rule/setup-duplicate-rule.component';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';

describe('BrruleSideSheetComponent', () => {
  let component: BrruleSideSheetComponent;
  let fixture: ComponentFixture<BrruleSideSheetComponent>;
  let schemaDetailsServicespy: SchemaDetailsService;
  let schemaServiceSpy: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrruleSideSheetComponent, FormInputComponent, SetupDuplicateRuleComponent],
      imports: [
        HttpClientTestingModule, AppMaterialModuleForSpec, RouterTestingModule
      ],
      providers: [SchemaDetailsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrruleSideSheetComponent);
    component = fixture.componentInstance;
    component.fieldsList = [
      { fieldId: '1', fieldDescri: 'first name' }
    ];
    schemaDetailsServicespy = fixture.debugElement.injector.get(SchemaDetailsService);
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init common data form', () => {

    component.buildCommonDataForm();
    expect(component.form).toBeDefined();

  });

  it('should get conditions', () => {

    expect(component.getConditions()[0]).toEqual('And');
    expect(component.getConditions().length).toEqual(2);

  });

  it('getFieldsByModuleId(), get the fields on basis of module', fakeAsync(() => {
    component.buildCommonDataForm();
    tick(100);
    component.moduleId = '1005';
    const metadataModeleResponse = { headers: [{ fieldId: 'MATL', fieldDescri: 'material location' }] } as MetadataModeleResponse;
    spyOn(schemaDetailsServicespy, 'getMetadataFields').withArgs(component.moduleId).and.returnValue(of(metadataModeleResponse));
    component.getFieldsByModuleId();
    expect(schemaDetailsServicespy.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
  }));

  it('formatLabel(), return value in string', async(() => {
    const value = 'Test';
    expect(component.formatLabel(value)).toEqual('Test');
  }));

  it('getCategories(), should call getAllCategoryInfo', () => {
    spyOn(schemaDetailsServicespy, 'getAllCategoryInfo').and.callFake(() => of(null));
    component.getCategories();
    expect(schemaDetailsServicespy.getAllCategoryInfo).toHaveBeenCalled();
  });

  it('remove(), remove the value', (() => {
    component.selectedFields = ['NDC_TYPE'];
    component.remove('NDC_TYPE', 0);
    expect(component.selectedFields.length).toEqual(0);
  }));

  it('isRegexType, sould return true if selected rule is regex type', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_REGEX_RULE);
    expect(component.isRegexType).toBeTrue();
  }));

  it('isTransformationRule, sould return true if selected rule is transformation type', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_TRANSFORMATION);
    expect(component.isTransformationRule).toBeTrue();
  }));

  it('isUDR, sould return true if selected rule is custom script type', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_CUSTOM_SCRIPT);
    expect(component.isUDR).toBeTrue();
  }));

  it('possibleOperators(), sould return array of all possible operators', (() => {
    const operators: ConditionalOperator[] = component.possibleOperators();
    expect(operators.length).toEqual(3);
  }));

  it(`createBrObject(), should create business rule object`, async(() => {
    const formData = {
      rule_type: 'test',
      rule_name: 'test',
      error_message: 'test',
      standard_function: 'test',
      regex: 'test',
      fields: [],
      udrTreeData: { udrHierarchies: [], blocks: [] },
      weightage: 10,
      categoryId: 'test',
    };

    const brObject = component.createBrObject(formData, formData.udrTreeData);
    expect(brObject).not.toBeUndefined();
    expect(brObject).not.toBeNull();
    expect(brObject.brType).toEqual('test');
  }));

  it(`initUDRForm(), should create UDR form object`, async(() => {
    component.initUDRForm();
    expect(component.udrNodeForm).not.toBeUndefined();
    expect(component.udrNodeForm).not.toBeNull();
  }));

  it(`getBusinessRuleInfo(), should call getBusinessRuleInfo service`, async(() => {
    spyOn(schemaServiceSpy, 'getBusinessRuleInfo').withArgs('testId').and.returnValue(of(null));
    component.getBusinessRuleInfo('testId');
    expect(schemaServiceSpy.getBusinessRuleInfo).toHaveBeenCalledWith('testId');
  }));

  it('mapBlocksAndHierarchy(), with args businessRule, should map blocks and hierarchy in one order', async () => {
    const businessRule: CoreSchemaBrInfo = { sno: 947765775309516180, brId: '545422479309516179', brType: 'BR_CUSTOM_SCRIPT', refId: 0, fields: '', regex: '', order: 1, message: 'err', script: '', brInfo: 'udr one go multiple test', brExpose: 0, status: '1', categoryId: null, standardFunction: '', brWeightage: '45', totalWeightage: 100, transformation: 0, tableName: '', qryScript: '', dependantStatus: 'ALL', plantCode: '0', apiKey: '', schemaId: null, categoryInfo: null, duplicacyMaster: null, duplicacyField: null, isCopied: false, moduleId: '732014592', copiedFrom: null, transFormationSchema: null, udrDto: { brInfo: null, udrHierarchies: [{ id: '448834874309516678', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '372820754419' }, { id: '504096405309516678', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '707680282204' }, { id: '534252568309516678', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '367460036999' }, { id: '679620974309516677', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '567151211941' }, { id: '836170888309516678', udrId: '545422479309516179', parentId: '372820754419', leftIndex: 1, rightIndex: null, blockRefId: '239387910216' }, { id: '368069354309516678', udrId: '545422479309516179', parentId: '707680282204', leftIndex: 1, rightIndex: null, blockRefId: '205296607505' }, { id: '578055595309516678', udrId: '545422479309516179', parentId: '707680282204', leftIndex: 1, rightIndex: null, blockRefId: '258780319717' }], blocks: [{ id: '372820754419', udrid: '545422479309516179', conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, conditionFieldValue: 'Google', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '707680282204', udrid: '545422479309516179', conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, conditionFieldValue: 'Ads', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '367460036999', udrid: '545422479309516179', conditionFieldId: 'uodciufm1604', conditionValueFieldId: null, conditionFieldValue: 'Electronics', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '567151211941', udrid: '545422479309516179', conditionFieldId: 'dkgpjhkj6733', conditionValueFieldId: null, conditionFieldValue: 'India', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'When', objectType: '732014592' }, { id: '239387910216', udrid: '545422479309516179', conditionFieldId: 'bwrugbda946', conditionValueFieldId: null, conditionFieldValue: 'India', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592'}, { id: '205296607505', udrid: '545422479309516179', conditionFieldId: 'uodciufm1604', conditionValueFieldId: null, conditionFieldValue: 'item one', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '258780319717', udrid: '545422479309516179', conditionFieldId: 'tnuywxci15', conditionValueFieldId: null, conditionFieldValue: 'Odr_', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'STARTS_WITH', blockDesc: 'And', objectType: '732014592' }], objectType: null }, brIdStr: '545422479309516179', percentage: 0.0 };
    const {blockHierarchy, blocks} = component.mapBlocksAndHierarchy(businessRule);

    expect(blockHierarchy.length).toEqual(7);
    expect(blocks.length).toEqual(7);
    expect(blockHierarchy[0].blockRefId).toEqual(blocks[0].id);
    expect(blocks[0].blockDesc).toEqual('When');
  })
});