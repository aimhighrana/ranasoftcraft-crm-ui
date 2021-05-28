import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BrruleSideSheetComponent } from './brrule-side-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SetupDuplicateRuleComponent } from './duplicate-rule-config/setup-duplicate-rule/setup-duplicate-rule.component';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { LookupFields, MetadataModeleResponse, TransformationFormData } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo, TransformationModel, TransformationRuleType, UDRBlocksModel, UdrModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';
import { SharedModule } from '@modules/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';


describe('BrruleSideSheetComponent', () => {
  let component: BrruleSideSheetComponent;
  let fixture: ComponentFixture<BrruleSideSheetComponent>;
  let schemaDetailsServicespy: SchemaDetailsService;
  let schemaServiceSpy: SchemaService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrruleSideSheetComponent, FormInputComponent, SetupDuplicateRuleComponent],
      imports: [
        HttpClientTestingModule, AppMaterialModuleForSpec, RouterTestingModule, SharedModule
      ],
      providers: [SchemaDetailsService,
        { provide: ActivatedRoute,
          useValue: {params: of({moduleId: '1005', schemaId: 'schema1', brId: 'new'})}
        }]
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
    router = fixture.debugElement.injector.get(Router);
    // router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init common data form', () => {

    spyOn(component, 'applyValidatorsByRuleType');

    component.buildCommonDataForm();
    expect(component.form).toBeDefined();

    component.form.controls.rule_type.setValue('BR_CUSTOM_SCRIPT');
    component.form.controls.transformationRuleType.setValue('REGEX');

    expect(component.applyValidatorsByRuleType).toHaveBeenCalledTimes(2);

  });

  it('getFieldsByModuleId(), get the fields on basis of module', fakeAsync(() => {
    component.buildCommonDataForm();
    tick(100);
    const metadataModeleResponse = { headers: [{ fieldId: 'MATL', fieldDescri: 'material location' }] } as MetadataModeleResponse;
    spyOn(schemaDetailsServicespy, 'getMetadataFields').and.returnValue(of(metadataModeleResponse));
    component.moduleId = '1005';
    component.coreSchemaBrInfo = {} as CoreSchemaBrInfo;
    component.getFieldsByModuleId();
    expect(component.selectedFields.length).toEqual(0);

    component.brId = '1701';
    component.coreSchemaBrInfo = {fields: 'region'} as CoreSchemaBrInfo;
    component.fieldsList = [{fieldId: 'region', fieldDescri: 'region'}];
    spyOn(component,'initGridAndHierarchyToAutocompleteDropdown');
    component.getFieldsByModuleId();
    expect(component.fieldsList.length).toEqual(2);
    expect(schemaDetailsServicespy.getMetadataFields).toHaveBeenCalledTimes(2);
    flush()
  }));

  it('should initGridAndHierarchyToAutocompleteDropdown', () => {
    const metadataModeleResponse = {
      grids: { ADDINFO: { fieldDescri: 'Additional data for GS1', fieldId: 'ADDINFO' } },
      gridFields: { ADDINFO: { ADD_HEIGHT: { fieldDescri: 'Height', fieldId: 'ADD_HEIGHT' } } },
      hierarchy: [{ fieldId: 'PLANT', heirarchyId: '1', heirarchyText: 'Plant Data', }],
      hierarchyFields: { 1: { ABC_INDIC: { fieldDescri: 'ABC Indicator', fieldId: 'ABC_INDIC' } } }
    } as MetadataModeleResponse;

    component.initGridAndHierarchyToAutocompleteDropdown(metadataModeleResponse);
    // expect(component.dataSource.data.length).toEqual(2);
    expect(component.allGridAndHirarchyData.length).toEqual(2);
  });


  it('should get conditions', () => {
    expect(component.getConditions()[0]).toEqual('And');
    expect(component.getConditions().length).toEqual(2);
  });

  it('formatLabel(), return value in string', async(() => {
    const value = 'Test';
    expect(component.formatLabel(value)).toEqual('Test');
  }));

  it('getCategories(), should call getAllCategoryInfo', () => {
    spyOn(schemaDetailsServicespy, 'getAllCategoryInfo').and.returnValues(of(null), of([{categoryId: '1', categoryDesc: 'desc'}]));
    component.getCategories();
    component.getCategories();
    expect(schemaDetailsServicespy.getAllCategoryInfo).toHaveBeenCalledTimes(2);
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
    let formData: any = {
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

    let brObject = component.createBrObject(formData, formData.udrTreeData);
    expect(brObject).not.toBeUndefined();
    expect(brObject).not.toBeNull();
    expect(brObject.brType).toEqual('test');

    formData = {
      sno: 1,
      refid: 1,
      message: 'test',
      script: 'test',
      brInfo: 'test',
      status: 1,
      brExpose: 1,
      brType: 'test',
      rule_type: 'test',
      rule_name: 'test',
      error_message: 'test',
      standard_function: 'test',
      regex: 'test',
      fields: [],
      udrTreeData: { udrHierarchies: [], blocks: [] },
      weightage: 10,
      brIdStr: 'test',
      percentage: 1,
      plantCode: '1',
      tableName:'test',
      transformation: 1,
      categoryId: 'test',
      isCopied: true
    };
    brObject = component.createBrObject(formData, formData.udrTreeData);
    expect(brObject).not.toBeUndefined();
    expect(brObject).not.toBeNull();
    expect(brObject.brType).toEqual('test');
    expect(brObject.isCopied).toBeTruthy();
  }));

  it(`initUDRForm(), should create UDR form object`, async(() => {
    component.initUDRForm();
    expect(component.udrNodeForm).not.toBeUndefined();
    expect(component.udrNodeForm).not.toBeNull();
  }));

  it(`getBusinessRuleInfo(), should call getBusinessRuleInfo service`, async(() => {
    spyOn(component, 'getFieldsByModuleId');
    spyOn(component, 'editUdr');
    spyOn(component, 'setValueToElement');
    const customScriptBr = new CoreSchemaBrInfo();
    customScriptBr.brType = 'BR_CUSTOM_SCRIPT';
    spyOn(schemaServiceSpy, 'getBusinessRuleInfo').withArgs('testId').and.returnValues(of(null), of(new CoreSchemaBrInfo()), of(customScriptBr));
    component.getBusinessRuleInfo('testId');
    component.getBusinessRuleInfo('testId');
    component.getBusinessRuleInfo('testId');

    expect(schemaServiceSpy.getBusinessRuleInfo).toHaveBeenCalledTimes(3);
    expect(component.getFieldsByModuleId).toHaveBeenCalledTimes(2);
    expect(component.editUdr).toHaveBeenCalledTimes(1);
  }));

  it(`To get FormControl from fromGroup `, async(() => {
    component.buildCommonDataForm()
   const field=component.formField('rule_name');
   expect(field).toBeDefined();
  }));

  it(`To UPDATE Transformation rule type when lib radio is clicked `, async(() => {
    component.buildCommonDataForm()
    component.updateTransformationRuleType({value: true})
   const field=component.formField('transformationRuleType');
   expect(field).toBeTruthy();
   component.form.controls.transformationRuleType.setValue(false);
   component.updateTransformationRuleType({value: true});
   const field2=component.formField('transformationRuleType');
   delete component.form.controls;
   expect(field2.value).toBeFalsy();

  }));

  it(`To set form value in a form `, async(() => {
    component.buildCommonDataForm()
    component.getFormValue(true,'transformationRuleType')
   const field=component.formField('transformationRuleType');
   expect(field).toBeTruthy();
  }));

  it('mapBlocksAndHierarchy(), with args businessRule, should map blocks and hierarchy in one order', async () => {
    const businessRule: CoreSchemaBrInfo = { sno: 947765775309516180, brId: '545422479309516179', brType: 'BR_CUSTOM_SCRIPT', refId: 0, fields: '', regex: '', order: 1, message: 'err', script: '', brInfo: 'udr one go multiple test', brExpose: 0, status: '1', categoryId: null, standardFunction: '', brWeightage: '45', totalWeightage: 100, transformation: 0, tableName: '', qryScript: '', dependantStatus: 'ALL', plantCode: '0', apiKey: '', schemaId: null, categoryInfo: null, duplicacyMaster: null, duplicacyField: null, isCopied: false, moduleId: '732014592', copiedFrom: null, transFormationSchema: null, udrDto: { brInfo: null, udrHierarchies: [{ id: '448834874309516678', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '372820754419' }, { id: '504096405309516678', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '707680282204' }, { id: '534252568309516678', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '367460036999' }, { id: '679620974309516677', udrId: '545422479309516179', parentId: null, leftIndex: null, rightIndex: null, blockRefId: '567151211941' }, { id: '836170888309516678', udrId: '545422479309516179', parentId: '372820754419', leftIndex: 1, rightIndex: null, blockRefId: '239387910216' }, { id: '368069354309516678', udrId: '545422479309516179', parentId: '707680282204', leftIndex: 1, rightIndex: null, blockRefId: '205296607505' }, { id: '578055595309516678', udrId: '545422479309516179', parentId: '707680282204', leftIndex: 1, rightIndex: null, blockRefId: '258780319717' }], blocks: [{ id: '372820754419', udrid: '545422479309516179', conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, conditionFieldValue: 'Google', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '707680282204', udrid: '545422479309516179', conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, conditionFieldValue: 'Ads', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '367460036999', udrid: '545422479309516179', conditionFieldId: 'uodciufm1604', conditionValueFieldId: null, conditionFieldValue: 'Electronics', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '567151211941', udrid: '545422479309516179', conditionFieldId: 'dkgpjhkj6733', conditionValueFieldId: null, conditionFieldValue: 'India', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'When', objectType: '732014592' }, { id: '239387910216', udrid: '545422479309516179', conditionFieldId: 'bwrugbda946', conditionValueFieldId: null, conditionFieldValue: 'India', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592'}, { id: '205296607505', udrid: '545422479309516179', conditionFieldId: 'uodciufm1604', conditionValueFieldId: null, conditionFieldValue: 'item one', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592' }, { id: '258780319717', udrid: '545422479309516179', conditionFieldId: 'tnuywxci15', conditionValueFieldId: null, conditionFieldValue: 'Odr_', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'STARTS_WITH', blockDesc: 'And', objectType: '732014592' }], objectType: null }, brIdStr: '545422479309516179', percentage: 0.0 };
    const {blockHierarchy, blocks} = component.mapBlocksAndHierarchy(businessRule);

    expect(blockHierarchy.length).toEqual(7);
    expect(blocks.length).toEqual(7);
    expect(blockHierarchy[0].blockRefId).toEqual(blocks[0].id);
    expect(blocks[0].blockDesc).toEqual('When');
    delete businessRule.udrDto.blocks;
    delete businessRule.udrDto.udrHierarchies;
    const result = component.mapBlocksAndHierarchy(businessRule);
    expect(result.blockHierarchy.length).toEqual(0);
    expect(result.blocks.length).toEqual(0);

  });

  it('showValidationError(), should hide validation message', fakeAsync(() => {
    component.validationError = {
        status: false,
        message: ''
    }

    const message = 'Please fill the required fields.'
    component.showValidationError(message);
    expect(component.validationError.status).toEqual(true);
    tick(3500);
    expect(component.validationError.status).toEqual(false);
  }))

  it('shouls get transformationType', () => {
    expect(component.transformationType).toBeDefined();
  })

  it('should get selectedTransformationType', async(() => {
    spyOn(component, 'applyValidatorsByRuleType');
    expect(component.selectedTransformationType).toBeFalsy();
    component.buildCommonDataForm();
    component.form.controls.transformationRuleType.setValue('REGEX');
    expect(component.selectedTransformationType).toEqual('REGEX');
  }))

  it('should get selectedTransRuleTypeRadio', async(() => {
    component.buildCommonDataForm();
    let selectedType: any = component.selectedTransRuleTypeRadio;
    expect(selectedType).toEqual(undefined);
    component.form.controls.transformationRuleType.setValue('REGEX', {emitEvent: false});
    selectedType = component.selectedTransRuleTypeRadio;
    expect(selectedType?.value).toEqual('REGEX');
    delete component.form;
    expect(component.selectedTransRuleTypeRadio).toEqual('');
  }))

  it('should init component', async(() => {
    spyOn(component, 'getCategories');
    spyOn(component, 'getFieldsByModuleId');
    spyOn(component, 'getBusinessRuleInfo');
    component.ngOnInit();
    expect(component.moduleId).toEqual('1005');

    // component.ngOnInit();
    // expect(component.getBusinessRuleInfo).toHaveBeenCalled();
  }));

  it('should get currentweightageValue', () => {
    expect(component.currentweightageValue).toBeFalsy();
  })

  it('should initiateAutocomplete', () => {
    component.fieldsList = [{fieldId: 'region', fieldDescri: 'region'}];
    component.buildCommonDataForm();
    let filteredFields;
    component.filteredModules.subscribe(fields => filteredFields = fields);
    component.form.controls.fields.setValue('status');
    component.initiateAutocomplete();
    expect(filteredFields.length).toEqual(0);
  })

  it('initiateAutocomplete(), should init autocomplete', async(() => {
    component.ngOnInit();
    component.form.controls.fields.setValue('email');
    component.allGridAndHirarchyData = [
      {
        name: 'Test',
        parent: 'Test',
        children: []
      }
    ];
    component.fieldsList = [];
    component.initiateAutocomplete();
    component.filteredModules.subscribe((res: any) => {
      expect(res.length).toEqual(0);
    });
  }));

  it('should apply validators by rule type', async(() => {
      component.buildCommonDataForm();

      component.applyValidatorsByRuleType(BusinessRuleType.BR_CUSTOM_SCRIPT);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.BR_REGEX_RULE);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.BR_MANDATORY_FIELDS);
      expect(component.form.controls.rule_name).toBeDefined();

      component.form.controls.transformationRuleType.setValue('REGEX', {emitEvent: false});
      component.applyValidatorsByRuleType(BusinessRuleType.BR_TRANSFORMATION);
      expect(component.form.controls.rule_name).toBeDefined();

      component.form.controls.transformationRuleType.setValue('LOOKUP', {emitEvent: false});
      component.applyValidatorsByRuleType(BusinessRuleType.BR_TRANSFORMATION);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.MRO_CLS_MASTER_CHECK);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.MRO_GSN_DESC_MATCH);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.MRO_MANU_PRT_NUM_LOOKUP);
      expect(component.form.controls.rule_name).toBeDefined();

      component.applyValidatorsByRuleType(BusinessRuleType.BR_DUPLICATE_RULE);
      expect(component.form.controls.rule_name).toBeDefined();

  }));

  it('should setValueToElement', async(() => {

    component.buildCommonDataForm();

      const brInfo = new CoreSchemaBrInfo();
      brInfo.brType = BusinessRuleType.BR_METADATA_RULE;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.BR_METADATA_RULE);

      brInfo.brType = BusinessRuleType.BR_CUSTOM_SCRIPT;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.BR_CUSTOM_SCRIPT);

      brInfo.brType = BusinessRuleType.BR_TRANSFORMATION;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.BR_TRANSFORMATION);

      brInfo.brType = BusinessRuleType.BR_REGEX_RULE;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.BR_REGEX_RULE);

      brInfo.brType = BusinessRuleType.BR_MANDATORY_FIELDS;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.BR_MANDATORY_FIELDS);

      brInfo.brType = BusinessRuleType.BR_DUPLICATE_RULE;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.BR_DUPLICATE_RULE);

      brInfo.brType = BusinessRuleType.MRO_CLS_MASTER_CHECK;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.MRO_CLS_MASTER_CHECK);

      brInfo.brType = BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI);

      brInfo.brType = BusinessRuleType.MRO_GSN_DESC_MATCH;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.MRO_GSN_DESC_MATCH);

      brInfo.brType = BusinessRuleType.MRO_MANU_PRT_NUM_LOOKUP;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(BusinessRuleType.MRO_MANU_PRT_NUM_LOOKUP);

      brInfo.brType = null;
      const previousBrType = component.form.controls.rule_type.value;
      component.setValueToElement(brInfo);
      expect(component.form.controls.rule_type.value).toEqual(previousBrType);



  }));

  it('should patchTransformationFormData', () => {

    let transformationSchema = [{sourceFld: 'mtl_grp', targetFld: 'mtl_grp'}] as TransformationModel[];
    component.patchTransformationFormData(TransformationRuleType.REGEX, null);
    expect(component.transformationData).toBeUndefined();

    component.patchTransformationFormData(TransformationRuleType.REGEX, transformationSchema);
    expect(component.transformationData.sourceFld).toEqual('mtl_grp');

    component.patchTransformationFormData(TransformationRuleType.LOOKUP, []);
    expect(component.transformationLookUpData.length).toEqual(0);

    component.patchTransformationFormData(TransformationRuleType.LOOKUP, transformationSchema);
    expect(component.transformationLookUpData.length).toEqual(1);

    transformationSchema = [{udrBlockModel: {conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, objectType: '732014592'}}] as TransformationModel[];
    component.patchTransformationFormData(TransformationRuleType.LOOKUP, transformationSchema);
    expect(component.transformationLookUpData.length).toEqual(1);

  });

  it('should getTrRuleType', () => {
    expect(component.getTrRuleType([])).toBeFalsy();
    const transformationSchema = [{transformationRuleType: TransformationRuleType.LOOKUP}] as TransformationModel[];

    expect(component.getTrRuleType(transformationSchema)).toEqual(TransformationRuleType.LOOKUP);

    transformationSchema[0].transformationRuleType = TransformationRuleType.REGEX;
    expect(component.getTrRuleType(transformationSchema)).toEqual(TransformationRuleType.REGEX);

  })

  it('should mapBlocksAndHierarchy', () => {
    const brInfo = new CoreSchemaBrInfo();
    expect(component.mapBlocksAndHierarchy(brInfo).blocks.length).toEqual(0);
    brInfo.udrDto = {blocks: [{blockDesc: 'When', blockType: BlockType.COND}] as UDRBlocksModel[], udrHierarchies: []} as UdrModel;
    const result = component.mapBlocksAndHierarchy(brInfo);
    expect(result.blocks.length).toEqual(1);
    delete brInfo.udrDto.blocks;
    delete brInfo.udrDto.udrHierarchies;
    expect(result.blocks.length).toEqual(1);
  })

  it('should editUdr', () => {
    const brInfo = new CoreSchemaBrInfo();
    brInfo.brIdStr = '1701';
    brInfo.udrDto = {blocks: [{id: '1', udrid: '545422479309516179', conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, conditionFieldValue: 'Google', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592'}] as UDRBlocksModel[],
    udrHierarchies: [{blockRefId: '1'}]} as UdrModel;

    component.initUDRForm();
    component.editUdr(brInfo);
    expect(component.udrNodeForm.get('frmArray').value.length).toEqual(1);

  });

  it('should add/remove Parent/child Block', () => {
    component.initUDRForm();
    component.addParentBlock();
    expect(component.udrNodeForm.get('frmArray').value.length).toEqual(2);

    component.addChildBlock(0);
    expect(component.getChildAsControl(0).controls.length).toEqual(1);

    component.removeChildNode(0, 0);
    expect(component.getChildAsControl(0).controls.length).toEqual(0);

    component.removeParentNode(0);
    expect(component.udrNodeArray().controls.length).toEqual(1);
  })

  it('should filter fields list', () => {
    component.fieldsList = [{fieldId: 'region', fieldDescri: 'region'}];
    expect(component.filter('re').length).toEqual(1);
  });

  it('should selectField', () => {
    component.buildCommonDataForm();

    const event = {option: {value: 'region', viewValue: 'region'}};
    component.selectField(event);
    expect(component.selectedFields.length).toEqual(1);
  });

  it('should close', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { [`${component.activeOutlet}`]: null } }], {queryParamsHandling: 'preserve'})
  });

  it('sould createBrObject', () => {
    expect(component.createBrObject({brId: '1'}).brId).toEqual('1');
    expect(component.createBrObject({refId: 1, refid: 1}).refId).toEqual(1);
    expect(component.createBrObject({standardFunction: 'Test'}).standardFunction).toEqual('Test');
    expect(component.createBrObject({brWeightage: 'Test'}).brWeightage).toEqual('Test');
    expect(component.createBrObject({qryScript: 'Test'}).qryScript).toEqual('Test');
    expect(component.createBrObject({dependantStatus: 'Test'}).dependantStatus).toEqual('Test');
    expect(component.createBrObject({udrHierarchies: ['']}).udrDto.udrHierarchies.length).toEqual(1);
    expect(component.createBrObject({}).brId).toEqual('');
    expect(component.createBrObject({}, null).udrDto.udrHierarchies.length).toEqual(0);
    expect(component.createBrObject({}, null).udrDto.blocks.length).toEqual(0);
    expect(component.createBrObject({blocks: [], object: ['']}, null).udrDto.blocks.length).toEqual(1);
  });

  it('should mapTransformationData', () => {

    expect(component.mapTransformationData({formData: {}}, BusinessRuleType.BR_DUPLICATE_RULE)).toBeFalsy();
    expect(component.mapTransformationData({formData: {}}, BusinessRuleType.BR_TRANSFORMATION).length).toEqual(1);
    expect(component.mapTransformationData({formData: {}, lookupData: {fieldId: 'fld'}}, BusinessRuleType.BR_TRANSFORMATION).length).toEqual(1);

  });

  it('sould createUDRBlockFromLookup', () => {
    const lookupData = {fieldLookupConfig: { moduleId: '1005', lookupColumnResult: 'region', lookupColumn: 'region'}} as LookupFields;
    const result = component.createUDRBlockFromLookup(lookupData);
    expect(result.objectType).toEqual('1005');
  });

  it('should setRegex', () => {

    component.buildCommonDataForm();
    component.setRegex({value: 'EMAIL'});
    expect(component.form.controls.regex.value).toEqual('^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}');
  });

  it('should setComparisonValue', () => {
    component.initUDRForm();
    component.setComparisonValue('Equal', 0);
    expect(component.udrNodeArray().value[0].conditionFieldValue).toEqual('Equal');

    component.addChildBlock(0);
    component.setComparisonValueForChild('Not Equal', 0, 0);
    expect(component.getChildAsControl(0).value[0].conditionFieldValue).toEqual('Not Equal');
  });

  it('should setRangeValue', () => {
    component.initUDRForm();
    component.setRangeValue(10, 'start', 0);
    expect(component.udrNodeArray().value[0].conditionFieldStartValue).toEqual(10);

    component.setRangeValue(20, 'end', 0);
    expect(component.udrNodeArray().value[0].conditionFieldEndValue).toEqual(20);


    component.addChildBlock(0);
    component.setRangeValueForChild(10, 'start', 0,0);
    expect(component.getChildAsControl(0).value[0].conditionFieldStartValue).toEqual(10);

    component.setRangeValueForChild(20, 'end', 0,0);
    expect(component.getChildAsControl(0).value[0].conditionFieldEndValue).toEqual(20);

  });

  it('isDuplicateType', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_DUPLICATE_RULE);
    expect(component.isDuplicateType).toBeTrue();
  }));

  it('should setTransformationFormData', () => {

    component.buildCommonDataForm();
    let transformationData = { selectedTargetFields: [] } as TransformationFormData ;
    component.setTransformationFormData(transformationData);
    expect(component.form.value.sourceFld).toBeFalsy();

    transformationData = {sourceFld: 'region', excludeScript: 'exclude', includeScript: 'include',selectedTargetFields: []} as TransformationFormData ;
    component.setTransformationFormData(transformationData);
    expect(component.form.value.sourceFld).toEqual('region');
  });

  it('should setLookupData', () => {
    const lookupData =  [{fieldId: 'fld'}] as LookupFields[];
    component.setLookupData(lookupData);
    expect(component.lookupData).toEqual(lookupData);
  });

  it('businessRuleTypesFiltered should get businessRuleTypes Filtered', async () => {
    component.businessRuleTypes = [{
      ruleDesc: 'test',
      ruleId: 'test',
      ruleType: BusinessRuleType.BR_CUSTOM_SCRIPT
    }];
    component.searchRuleTypeStr = '';
    expect(component.businessRuleTypesFiltered.length).toEqual(1);
    component.searchRuleTypeStr = 'test';
    expect(component.businessRuleTypesFiltered.length).toEqual(1);
    component.searchRuleTypeStr = 'test1';
    expect(component.businessRuleTypesFiltered.length).toEqual(0);
  });

  it('should displayFn', () => {
    expect(component.displayFn(null)).toBeFalsy();
    expect(component.displayFn({fieldDescri: 'region'})).toEqual('region');
  });

  it('should setDuplicateFormRef', () => {
    const form = new FormGroup({});
    component.setDuplicateFormRef(form);
    expect(component.duplicateFormRef).toEqual(form);
  });

  it('should saveDuplicateRule', () => {
    component.buildCommonDataForm();

    spyOn(schemaServiceSpy, 'saveUpdateDuplicateRule').and.returnValue(of('success'));

    component.duplicateFormRef = new FormGroup({
      addFields: new FormArray([])
    });

    component.saveDuplicateRule();

    const formArray = component.duplicateFormRef.get('addFields') as FormArray;
    formArray.push(new FormGroup({exclusion: new FormControl('', Validators.required)}));

    component.saveDuplicateRule();

    formArray.at(0).get('exclusion').setValue(1);
    component.saveDuplicateRule();

    expect(schemaServiceSpy.saveUpdateDuplicateRule).toHaveBeenCalledTimes(1);

  });

  it('should save br', () => {

    component.buildCommonDataForm();
    spyOn(schemaServiceSpy, 'createBusinessRule').and.returnValue(of(new CoreSchemaBrInfo()));
    component.save();

    component.form.patchValue({rule_type: BusinessRuleType.BR_MANDATORY_FIELDS,fields:'region', rule_name: 'new br', error_message: 'required', weightage: 25},
    {emitEvent: false});
    component.save();

    component.brId = '1701';
    component.coreSchemaBrInfo = {categoryId: '1'} as CoreSchemaBrInfo;
    component.save();


    component.form.controls.transformationRuleType.setValue('LOOKUP', {emitEvent: false});
    component.currentSelectedRule = BusinessRuleType.BR_TRANSFORMATION;
    component.save();


    expect(schemaServiceSpy.createBusinessRule).toHaveBeenCalledTimes(2);

  });

  it('should blockCtrl()', () => {

    const udr = {id: '1', udrid: '545422479309516179', conditionFieldId: 'bpkretpy520', conditionValueFieldId: null, conditionFieldValue: 'Google', conditionFieldStartValue: '', conditionFieldEndValue: '', blockType: BlockType.AND, conditionOperator: 'EQUAL', blockDesc: 'And', objectType: '732014592'} as UDRBlocksModel;
    const result = component.blockCtrl(udr);
    component.blockCtrl(udr);
    expect(result.get('conditionFieldValue').value).toEqual('Google');

  })

});