import { Component, OnInit } from '@angular/core';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo, UDRBlocksModel, UdrModel, UDRHierarchyModel, RULE_TYPES, PRE_DEFINED_REGEX, TransformationRuleType, TransformationModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { CategoryInfo, FieldConfiguration, LookupFields, MetadataModeleResponse, TransformationFormData } from '@models/schema/schemadetailstable';
import { of, Observable } from 'rxjs';
import { startWith, map, distinctUntilChanged } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Regex } from '@modules/admin/_components/module/business-rules/regex-rule/regex-rule.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '@services/home/schema.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';

@Component({
  selector: 'pros-brrule-side-sheet',
  templateUrl: './brrule-side-sheet.component.html',
  styleUrls: ['./brrule-side-sheet.component.scss']
})
export class BrruleSideSheetComponent implements OnInit {

  form: FormGroup;
  businessRuleTypes: BusinessRules[] = RULE_TYPES;
  preDefinedRegex: Regex[] = PRE_DEFINED_REGEX;

/**
 * source fields for transformation rule
 */
  sourceFieldsObject: FieldConfiguration = {
    list: [],
    labelKey: '',
    valueKey: ''
  }

/**
 * target fields for transformation rule
 */
  targetFieldsObject: FieldConfiguration = {
    list: [],
    labelKey: '',
    valueKey: ''
  }

  /**
   * Lookup data from transformation rule component
   */
  lookupData: LookupFields[] = [];

  /**
   * Existing transformation schema used to
   * patch transformation rule for Lookup
   */
  transformationLookUpData: LookupFields[] = [];

  /**
   * Transformation Data model
   */
  transformationData: TransformationFormData;

  /**
   * current rule
   */
  currentSelectedRule: string;

  /**
   * List of categories
   */
  categoryList: CategoryInfo[] = []

  /**
   * List of fields
   */
  fieldsList = [];

  /**
   * observable for autocomplete
   */
  filteredModules: Observable<{} | string | void> = of([]);

  /**
   * array to save the selected fields
   */
  selectedFields = [];

  /**
   * list of event to consider as selection
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];


  udrForm: FormGroup;


  operators = [];
  submitted = false;
  initialConditions = ['And', 'Or'];
  /**
   * Current schema id which is from activated router ..
   */
  schemaId: string;

  /**
   * Current module  id which is from activated router ..
   */
  moduleId: string;

  /**
   * Current business rule id  id which is from activated router ..
   */
  brId: string;

  /**
   * While edit hold br information ..
   */
  coreSchemaBrInfo: CoreSchemaBrInfo = new CoreSchemaBrInfo();

  udrNodeForm: FormGroup;

  /**
   * hold the form controls in this variable
   */
  currentControls: any = {};

  /**
   * hold data from the route event for further use
   */
  routeData: any;

  /**
   * Class contructor
   * @param dialogRef refernce to matdialog
   * @param data data recieved from parent
   * @param schemaDetailsService service class
   */
  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private snackBar: MatSnackBar,
    private activatedRouter: ActivatedRoute,
    private schemaService: SchemaService,
    private router: Router,
    private sharedService: SharedServiceService,
    private formBuilder: FormBuilder
  ) { }


  get transformationType() {
    return TransformationRuleType;
  }

  get selectedTransformationType() {
    if (this.form && this.form.controls) {
      return this.form.controls.transformationRuleType.value;
    }
    return '';
  }

  ngOnInit(): void {
    this.buildCommonDataForm();
    this.getCategories();
    this.filteredModules = of(this.fieldsList);
    this.operators = this.possibleOperators();

    this.udrNodeForm = this.formBuilder.group({
      frmArray: this.formBuilder.array([this.formBuilder.group({
        blockDesc: new FormControl('When'),
        blockType: new FormControl(BlockType.AND),
        conditionFieldEndValue: new FormControl(''),
        conditionFieldId: new FormControl(''),
        conditionFieldStartValue: new FormControl(''),
        conditionFieldValue: new FormControl(''),
        conditionOperator: new FormControl(''),
        conditionValueFieldId: new FormControl(''),
        id: new FormControl(Math.floor(Math.random() * 1000000000000).toString()),
        objectType: new FormControl(this.moduleId),
        udrid: new FormControl(this.brId),
        childs: this.formBuilder.array([])
      })
      ])
    });

    this.udrNodeForm.valueChanges.subscribe(res => {
      console.log(res);
    });

    this.initiateAutocomplete();

    this.activatedRouter.params.subscribe(res => {
      this.routeData = res;
      this.moduleId = res.moduleId;
      this.schemaId = res.schemaId;
      this.brId = res.brId ? (res.brId !== 'new' ? res.brId : '') : '';
      if (this.brId) {
        this.getBusinessRuleInfo(this.brId);
      }
      if (this.moduleId) {
        this.getFieldsByModuleId();
      }
    });
  }

  /**
   * get businessrule data from api to patch in sidesheet
   */
  getBusinessRuleInfo(brId) {
    this.schemaService.getBusinessRuleInfo(brId).subscribe(resp => {
      this.coreSchemaBrInfo = resp;

      // Patch received data
      this.setValueToElement(this.coreSchemaBrInfo);
      if (this.routeData.brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
        this.editUdr(resp);
      }
    }, error => console.error(`Error : ${error.message}`));
  }

  /**
   * Initialize autocomplete for field names
   */
  initiateAutocomplete() {
    this.filteredModules = this.form.controls.fields.valueChanges
      .pipe(
        startWith(''),
        map(keyword => {
          return keyword ?
            this.fieldsList.filter(item => {
              return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
            }) : this.fieldsList
        }),
      )
  }

  /**
   * Initialize the form object and
   * subscribe to any required control value changes
   */
  buildCommonDataForm() {
    const controls = {
      rule_type: new FormControl('', [Validators.required]),
      rule_name: new FormControl('', [Validators.required]),
      error_message: new FormControl('', [Validators.required]),
      standard_function: new FormControl(''),
      regex: new FormControl(''),
      fields: new FormControl(''),
      sourceFld: new FormControl(''),
      targetFld: new FormControl(''),
      excludeScript: new FormControl(''),
      includeScript: new FormControl(''),
      udrTreeData: new FormControl(),
      weightage: new FormControl(0, [Validators.required]),
      categoryId: new FormControl(''),
      transformationRuleType: new FormControl('')
    };

    this.currentControls = controls;
    this.form = new FormGroup(controls);

    // Apply conditional validation based on rule type
    this.form.controls.rule_type.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((selectedRule) => {
        this.applyValidatorsByRuleType(selectedRule);
      });
    this.form.controls.transformationRuleType.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((type) => {
        this.applyValidatorsByRuleType(this.form.controls.rule_type.value);
      });
  }

  /**
   * Apply conditional form validation based on rule type
   * keep the required field updated based on a selected rule type
   * loop through the required keys and add validators to all required fields
   * also nullify validators for all not required fields at the same time
   * @param selectedRule selected rule type
   */
  applyValidatorsByRuleType(selectedRule: string) {
    this.currentSelectedRule = selectedRule;
    const controlKeys: any[] = Object.keys(this.currentControls);
    let requiredKeys: string[] = [];
    if (selectedRule === BusinessRuleType.BR_CUSTOM_SCRIPT) {
      requiredKeys = ['categoryId'];
    }
    if (selectedRule === BusinessRuleType.BR_REGEX_RULE) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields', 'regex', 'standard_function'];
    }
    if (selectedRule === BusinessRuleType.BR_MANDATORY_FIELDS || selectedRule === BusinessRuleType.BR_METADATA_RULE) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields'];
    }
    if (selectedRule === BusinessRuleType.BR_TRANSFORMATION) {
      requiredKeys = ['rule_name', 'transformationRuleType', 'error_message'];
      if (this.selectedTransformationType === this.transformationType.REGEX) {
        requiredKeys = ['rule_name', 'transformationRuleType', 'error_message', 'sourceFld', 'targetFld', 'excludeScript', 'includeScript'];
      }
    }
    if (selectedRule === BusinessRuleType.BR_DUPLICATE_RULE) {
      requiredKeys = ['rule_name'];
    }

    controlKeys.map((key) => {
      const index = requiredKeys.findIndex(reqKey => reqKey === key);
      if (index === -1) {
        this.form.get(key).setValidators(null);
        this.form.get(key).clearValidators();
        if (key !== 'rule_type' && key !== 'weightage') {
          this.form.get(key).setValue('');
        }
      } else {
        this.form.get(key).setValidators([Validators.required]);
      }
    });

    this.form.updateValueAndValidity();
  }

  /**
   * Set br inf to form while editing ..
   */
  setValueToElement(br: CoreSchemaBrInfo) {
    const dataToPatch = {
      rule_type: br.brType,
      rule_name: br.brInfo,
      error_message: br.message,
      standard_function: br.standardFunction,
      regex: br.regex,
      fields: br.fields,
      sourceFld: '',
      targetFld: '',
      excludeScript: '',
      includeScript: '',
      udrTreeData: '',
      weightage: br.brWeightage,
      categoryId: br.categoryId,
      transformationRuleType: '',
    };

    let patchList = [];

    if (br.brType === BusinessRuleType.BR_METADATA_RULE) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'fields'];
    }
    if (br.brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
      patchList = ['rule_type', 'weightage'];
    }
    if (br.brType === BusinessRuleType.BR_TRANSFORMATION) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage'];
      this.patchTransformationFormData(br.transFormationSchema);
    }
    if (br.brType === BusinessRuleType.BR_REGEX_RULE) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'fields', 'standard_function', 'regex'];
    }
    if (br.brType === BusinessRuleType.BR_MANDATORY_FIELDS) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'fields'];
    }

    if (br.brType === BusinessRuleType.BR_DUPLICATE_RULE) {
      patchList = ['rule_type', 'rule_name'];
    }

    if (patchList && patchList.length > 0) {
      patchList.map((key) => {
        this.form.get(key).setValue(dataToPatch[key]);
      });
    }

    this.form.get('rule_type').disable({ onlySelf: true, emitEvent: true });
    this.form.get('weightage').disable({ onlySelf: true, emitEvent: true });

    // this.form.get('rule_type').setValue(br.brType);
    // this.form.get('rule_type').disable({ onlySelf: true, emitEvent: true });
    // this.form.get('rule_name').setValue(br.brInfo);
    // this.form.get('error_message').setValue(br.message);

    // this.form.get('standard_function').setValue(br.standardFunction);
    // this.form.get('regex').setValue(br.regex);
  }

  /**
   * Patch transformation form data
   * @param transformationSchema transformation rule details to be passed
   */
  patchTransformationFormData(transformationSchema: TransformationModel[]) {
    const currentType = this.getTrRuleType(transformationSchema);
    setTimeout(() => {
      this.form.controls.transformationRuleType.setValue(currentType);
    }, 300);
    if (currentType === this.transformationType.REGEX) {
      if (transformationSchema && transformationSchema.length > 0) {
        const data: TransformationModel = transformationSchema[0];
        const { excludeScript, includeScript, sourceFld, targetFld, parameter } = data;
        this.transformationData = {
          excludeScript,
          includeScript,
          sourceFld,
          targetFld,
          parameter
          // selectedTargetFields: []
        }
      }
    }
    if (currentType === this.transformationType.LOOKUP) {
      if (transformationSchema.length > 0) {
        const lookupFields: LookupFields[] = [];
        transformationSchema.map((schema) => {
          lookupFields.push({
            enableUserField: false,
            fieldDescri: '',
            fieldId: schema.sourceFld,
            fieldLookupConfig: {
              lookupColumn: schema.parameter.conditionFieldId,
              lookupColumnResult: schema.parameter.conditionValueFieldId,
              moduleId: schema.parameter.objectType
            },
            lookupTargetField: schema.targetFld,
            lookupTargetText: ''
          })
        });

        this.transformationLookUpData = lookupFields;
      }
    }
  }

  /**
   * get transformation sub type
   * @param transformationSchema pass the transformation schema Object
   */
  getTrRuleType(transformationSchema: TransformationModel[]) {
    if (transformationSchema && transformationSchema.length > 0) {
      const schema = transformationSchema[0];
      if (schema.transformationRuleType === this.transformationType.LOOKUP) {
        return this.transformationType.LOOKUP;
      }
      if (schema.transformationRuleType === this.transformationType.REGEX) {
        return this.transformationType.REGEX;
      }
    }
    return '';
  }

  /**
   * Initilize form while edit ..
   * @param br initilize form while edit ..
   */
  editUdr(br: CoreSchemaBrInfo) {
    const blocks: UDRBlocksModel[] = br.udrDto ? (br.udrDto.blocks ? br.udrDto.blocks : []) : [];
    const blockHierarchy: UDRHierarchyModel[] = br.udrDto ? (br.udrDto.udrHierarchies ? br.udrDto.udrHierarchies : []) : [];
    blockHierarchy.forEach((hie, idx) => {
      const blck = blocks.filter(fil => fil.id === hie.blockRefId)[0];
      if (blck) {
        if (idx === 0) {
          this.udrNodeForm.get('frmArray').setValue([{
            blockDesc: blck.blockDesc,
            blockType: blck.blockType,
            conditionFieldEndValue: blck.conditionFieldEndValue,
            conditionFieldId: blck.conditionFieldId,
            conditionFieldStartValue: blck.conditionFieldStartValue,
            conditionFieldValue: blck.conditionFieldValue,
            conditionOperator: blck.conditionOperator,
            conditionValueFieldId: blck.conditionValueFieldId,
            id: blck.id,
            objectType: blck.blockType,
            udrid: blck.udrid,
            childs: []
          }]);
        } else {
          if (!hie.parentId) {
            this.addParentBlock(blck);
          } else {
            const parentBlock = blocks.filter(fil => fil.id === hie.parentId)[0];
            const pIndex = blocks.indexOf(parentBlock);
            this.addChildBlock(pIndex, blck);
          }
        }
      }
    })
  }

  /**
   * Add parent UDR object
   * @param udr pass the udr block object
   */
  addParentBlock(udr?: UDRBlocksModel) {
    const parentArray = (this.udrNodeForm.get('frmArray') as FormArray);
    parentArray.push(this.blockCtrl(udr));
  }

  /**
   * Initialize block formgroup
   * @param udr pass the udr block object
   */
  blockCtrl(udr?: UDRBlocksModel): FormGroup {
    return this.formBuilder.group({
      blockDesc: new FormControl(udr ? udr.blockDesc : 'And'),
      blockType: new FormControl(udr ? udr.blockType : BlockType.COND),
      conditionFieldEndValue: new FormControl(udr ? udr.conditionFieldEndValue : ''),
      conditionFieldId: new FormControl(udr ? udr.conditionFieldId : ''),
      conditionFieldStartValue: new FormControl(udr ? udr.conditionFieldStartValue : ''),
      conditionFieldValue: new FormControl(udr ? udr.conditionFieldValue : ''),
      conditionOperator: new FormControl(udr ? udr.conditionOperator : ''),
      conditionValueFieldId: new FormControl(udr ? udr.conditionValueFieldId : ''),
      id: new FormControl(udr ? udr.id : Math.floor(Math.random() * 1000000000000).toString()),
      objectType: new FormControl(this.moduleId),
      udrid: new FormControl(this.brId),
      childs: this.formBuilder.array([])
    });
  }

  /**
   * Add childs block..
   * @param parentBlockIndx parent index item where add childs ..
   */
  addChildBlock(parentBlockIndx: number, udr?: UDRBlocksModel) {
    const chldArray = this.getChildAsControl(parentBlockIndx);
    chldArray.push(this.blockCtrl(udr));
  }

  /**
   * Get parent node array .
   */
  udrNodeArray(): FormArray {
    return this.udrNodeForm.get('frmArray') as FormArray
  }

  /**
   * Get childs form array ..
   * @param index get childs node by parent id
   */
  getChildAsControl(index: number): FormArray {
    return this.udrNodeArray().at(index).get('childs') as FormArray
  }

  /**
   * Remove parent node..
   * @param index removeable index
   */
  removeParentNode(index: number) {
    const frmArray = this.udrNodeArray();
    frmArray.removeAt(index);
  }

  /**
   * Remove child node element
   * @param parentNodeId parent node id ..
   * @param childNodeId child node id ..
   */
  removeChildNode(parentNodeId: number, childNodeId: number) {
    const chldArray = this.getChildAsControl(parentNodeId);
    chldArray.removeAt(childNodeId);
  }

  /**
   * function to get the fields on basis of module
   */
  getFieldsByModuleId() {
    this.schemaDetailsService.getMetadataFields(this.moduleId)
      .subscribe((metadataModeleResponse: MetadataModeleResponse) => {
        const keys = Object.keys(metadataModeleResponse.headers);
        keys.forEach((key) => {
          this.fieldsList.push(metadataModeleResponse.headers[key])
        });

        this.sourceFieldsObject = {
          labelKey: 'fieldDescri',
          valueKey: 'fieldId',
          list: this.fieldsList
        }
        this.targetFieldsObject = {
          labelKey: 'fieldDescri',
          valueKey: 'fieldId',
          list: this.fieldsList
        }
        this.fieldsList = this.fieldsList.slice();

        this.filteredModules = of(this.fieldsList);
        // this.filteredFieldList = this.fieldsList;
        // this.duplicateFieldsObs = of(this.fieldsList);

        if (this.brId) {
          try {
            const fldIds = this.coreSchemaBrInfo.fields ? this.coreSchemaBrInfo.fields.split(',') : [];
            this.selectedFields = [];
            fldIds.forEach(fld => {
              const fldCtrl = this.fieldsList.filter(fil => fil.fieldId === fld)[0];
              if (fldCtrl) {
                this.selectedFields.push({ fieldDescri: fldCtrl.fieldDescri, fieldId: fld });
              }
            });
          } catch (ex) { console.error(ex) }
        }

      });
  }

  /**
   * function to filter the list
   * @param val fitering text
   */
  filter(val: string): any[] {
    return this.fieldsList.filter(option => {
      return option.fieldDescri.toLowerCase().indexOf(val.toLowerCase()) === 0;
    })
  }

  /**
   * function to save the array of ids of selected fields
   * @param event selected item eent
   */
  selectedField(event) {
    const alreadyExists = this.selectedFields.find(item => item.fieldId === event.option.value);
    if (alreadyExists) {
      this.snackBar.open('This field is already selected', 'error', { duration: 5000 });
    } else {
      this.selectedFields.push({
        fieldText: event.option.viewValue,
        fieldId: event.option.value
      });
    }

    this.form.controls.fields.setValue('');
  }

  /**
   * function to remove the value
   * @param field the field to be removed
   */
  remove(field, i) {
    this.selectedFields.splice(i, 1);
  }

  /**
   * getter to show field on the basis of rule type
   */
  get isRegexType() {
    return this.form.controls.rule_type.value === BusinessRuleType.BR_REGEX_RULE
  }

  /**
   * function to set the value in the form
   * @param value entered value
   * @param field the selected field of form
   */
  getFormValue(value, field) {
    this.form.controls[field].setValue(value);
  }

  /**
   * function to close the dialog
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /**
   * function to save the form data
   */
  save() {
    this.form.controls.fields.setValue(this.selectedFields.map(item => item.fieldId).join(','));
    this.submitted = true;
    if (!this.form.valid) {
      this.snackBar.open('Please enter the required fields', 'okay', { duration: 5000 });
      return;
    }

    let brType: string = this.form.value ? this.form.value.rule_type : '';
    brType = brType ? brType : this.coreSchemaBrInfo.brType;

    if (brType === 'BR_CUSTOM_SCRIPT') {

      // for user defined rule
      console.log(this.udrNodeForm.value);
      const udrDto: UdrModel = new UdrModel();
      udrDto.brInfo = {
        brId: this.brId, brIdStr: this.brId,
        brType, brInfo: this.form.value.rule_name, message: this.form.value.error_message,
        schemaId: this.schemaId, categoryId: this.coreSchemaBrInfo.categoryId
      } as CoreSchemaBrInfo;

      const blocks: UDRBlocksModel[] = [];
      const frm = this.udrNodeArray();
      for (let i = 0; i < frm.length; i++) {
        blocks.push(frm.at(i).value as UDRBlocksModel)
      }
      const blockHierarchy: UDRHierarchyModel[] = [];
      blocks.forEach(block => {
        const hie: UDRHierarchyModel = new UDRHierarchyModel();
        hie.blockRefId = block.id;
        hie.leftIndex = 0;
        blockHierarchy.push(hie);

        block.childs.forEach(bb => {
          bb.blockType = BlockType.COND;
          blocks.push(bb);
          const chldHie: UDRHierarchyModel = new UDRHierarchyModel();
          chldHie.blockRefId = bb.id;
          chldHie.leftIndex = 1;
          chldHie.parentId = block.id;
          blockHierarchy.push(chldHie);
        });

      });
      udrDto.blocks = blocks;
      udrDto.objectType = this.moduleId;
      udrDto.udrHierarchies = blockHierarchy;

      this.schemaService.saveUpdateUDR(udrDto).subscribe(res => {
        this.snackBar.open(`Successfully saved !`, 'Close', { duration: 5000 });
        console.log(res);
        this.sharedService.setAfterBrSave(res);
        this.router.navigate([{ outlets: { sb: null } }]);
      }, error => {
        this.snackBar.open(`Something went wrong `, 'Close', { duration: 5000 });
      });

    } else if (brType === BusinessRuleType.BR_DUPLICATE_RULE) {
      // save duplicate rule
      const brInfo = {
        brId: this.brId, brIdStr: this.brId,
        brType, brInfo: this.form.value.rule_name, message: this.form.value.error_message,
        schemaId: this.schemaId, categoryId: this.coreSchemaBrInfo.categoryId
      } as CoreSchemaBrInfo;

      this.sharedService.emitSaveBrEvent(brInfo);

    } else if (brType === BusinessRuleType.BR_TRANSFORMATION) {
      const response = { formData: this.form.value, tempId: '', lookupData: this.lookupData };
      const finalFormData = {
        ...this.form.value,
        brId: this.brId ? this.brId : '',
        brType,
        transFormationSchema: this.mapTransformationData(response),
      }
      const brObject = this.createBrObject(finalFormData);
      this.schemaService.createBusinessRule(brObject).subscribe(res => {
        this.sharedService.setAfterBrSave(res);
        this.router.navigate([{ outlets: { sb: null } }]);
      }, err => console.error(`Error : ${err.message}`));

    } else {
      const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();
      request.brId = this.brId ? this.brId : '';
      request.brType = brType;
      request.message = this.form.value.error_message;
      request.brInfo = this.form.value.rule_name;
      request.fields = this.form.value.fields;
      request.regex = this.form.value.regex;
      request.standardFunction = this.form.value.standard_function;
      request.schemaId = this.schemaId;
      request.categoryId = this.coreSchemaBrInfo.categoryId ? this.coreSchemaBrInfo.categoryId : null;

      this.schemaService.createBusinessRule(request).subscribe(res => {
        this.sharedService.setAfterBrSave(res);
        this.router.navigate([{ outlets: { sb: null } }]);
      }, err => console.error(`Error : ${err.message}`));

    }
  }

  /**
   * function to create br
   * @param object newly created Br
   */
  createBrObject(object, udrTreeData = { udrHierarchies: [], blocks: [] }): CoreSchemaBrInfo {

    return {
      sno: object.sno ? object.sno : 0,
      brId: object.brId ? object.brId : '',
      brType: object.brType ? object.brType : object.rule_type,
      refId: object.refId ? object.refid : 0,
      fields: object.fields,
      regex: object.regex,
      order: 1,
      message: object.message ? object.message : object.error_message,
      script: object.script ? object.script : '',
      brInfo: object.brInfo ? object.brInfo : object.rule_name,
      brExpose: object.brExpose ? object.brExpose : 0,
      status: object.status ? object.status : '1',
      categoryId: object.categoryId,
      standardFunction: object.standardFunction ? object.standardFunction : object.standard_function,
      brWeightage: object.brWeightage ? object.brWeightage : object.weightage,
      totalWeightage: 100,
      transformation: object.transformation ? object.transformation : 0,
      tableName: object.tableName ? object.tableName : '',
      qryScript: object.qryScript ? object.qryScript : '',
      dependantStatus: object.dependantStatus ? object.dependantStatus : 'ALL',
      plantCode: object.plantCode ? object.plantCode : '0',
      percentage: object.percentage ? object.percentage : 0,
      schemaId: object.schemaId ? object.schemaId : '',
      brIdStr: object.brIdStr ? object.brIdStr : '',
      udrDto: {
        udrHierarchies: object.udrHierarchies ? object.udrHierarchies : udrTreeData ? udrTreeData.udrHierarchies : [],
        blocks: object.blocks ? object.object : udrTreeData ? udrTreeData.blocks : []
      },
      transFormationSchema: object.transFormationSchema,
      isCopied: object.isCopied? object.isCopied: false
    } as CoreSchemaBrInfo;
  }

  /**
   * method to map transformation rule data from form
   * object to transformationschema format
   * @param response pass the response with formData and lookup object
   */
  mapTransformationData(response) {
    const { sourceFld, targetFld, includeScript, excludeScript, transformationRuleType } = response.formData;
    const transformationList: TransformationModel[] = [];

    if (response.lookupData && response.lookupData.length > 0) {
      response.lookupData.map((param: LookupFields) => {
        transformationList.push({
          brId: '',
          sourceFld: param.fieldId,
          targetFld: param.lookupTargetField,
          includeScript,
          excludeScript,
          transformationRuleType,
          lookUpObjectType: '',
          lookUptable: '',
          parameter: this.createUDRBlockFromLookup(param)
        })
      })
    } else {
      transformationList.push({
        brId: '',
        sourceFld,
        targetFld,
        includeScript,
        excludeScript,
        transformationRuleType,
        lookUpObjectType: '',
        lookUptable: '',
        parameter: null
      });
    }

    return transformationList;
  }

  /**
   * create UDR block data from lookup field
   * @param lookupData lookup data to be passed here
   */
  createUDRBlockFromLookup(lookupData: LookupFields): UDRBlocksModel {
    return {
      id: '',
      udrid: '',
      conditionFieldId: lookupData.fieldLookupConfig.lookupColumn,
      conditionValueFieldId: lookupData.fieldLookupConfig.lookupColumnResult,
      conditionFieldValue: '',
      conditionFieldStartValue: '',
      conditionFieldEndValue: '',
      blockType: BlockType.COND,
      conditionOperator: 'EQUAL',
      blockDesc: '',
      objectType: lookupData.fieldLookupConfig.moduleId,
      childs: []
    }
  }

  /**
   * Method to set the regex value in form control
   * @param event pass the event
   */
  setRegex(event) {
    const selectedRegex = this.preDefinedRegex.find(item => item.FUNC_TYPE === event.value);
    this.form.controls.regex.setValue(selectedRegex.FUNC_CODE);
  }

  /**
   * Check if rule type is User defined rule
   */
  get isUDR() {
    return this.form.controls.rule_type.value === 'BR_CUSTOM_SCRIPT'
  }

  /**
   * Return all possible operators
   */
  possibleOperators(): ConditionalOperator[] {
    // get generic operators
    const genericOp: ConditionalOperator = new ConditionalOperator();
    genericOp.desc = 'Common Operator';
    genericOp.childs = [];
    genericOp.childs.push('EQUAL');
    genericOp.childs.push('STARTS_WITH');
    genericOp.childs.push('ENDS_WITH');
    genericOp.childs.push('CONTAINS');
    genericOp.childs.push('EMPTY');
    genericOp.childs.push('NOT_EMPTY');

    // for numeric number field
    const onlyNum: ConditionalOperator = new ConditionalOperator();
    onlyNum.desc = 'Numeric Operators';
    onlyNum.childs = [];
    onlyNum.childs.push('RANGE');
    onlyNum.childs.push('LESS_THAN');
    onlyNum.childs.push('LESS_THAN_EQUAL');
    onlyNum.childs.push('GREATER_THAN');
    onlyNum.childs.push('GREATER_THAN_EQUAL');

    // for special operators
    const specialOpe: ConditionalOperator = new ConditionalOperator();
    specialOpe.desc = 'Special Operators';
    specialOpe.childs = [];
    specialOpe.childs.push('REGEX');
    specialOpe.childs.push('FIELD2FIELD');
    specialOpe.childs.push('LOCATION');
    return [genericOp, onlyNum, specialOpe];
  }

  setComparisonValue(value: string, index: number) {
    const array = this.udrNodeArray().at(index);
    array.get('conditionFieldValue').setValue(value);
  }

  setComparisonValueForChild(value, chldNode: number, parentNode: number) {
    const childArray = this.getChildAsControl(parentNode).at(chldNode);
    childArray.get('conditionFieldValue').setValue(value);
  }

  setRangeValueForChild(value, rangeText, childObject, parentIndex) {
    const childArray = this.getChildAsControl(parentIndex).at(childObject);
    if (rangeText === 'start') {
      childArray.get('conditionFieldStartValue').setValue(value);
    }
    if (rangeText === 'end') {
      childArray.get('conditionFieldEndValue').setValue(value);
    }
  }

  /**
   * get available condition string
   */
  getConditions() {
    return ['And', 'Or']
  }

  /**
   * method to set range values
   * @param value pass the value
   * @param rangeText pass the range text
   * @param parentBlockIndex Pass the parent block index
   */
  setRangeValue(value, rangeText, parentBlockIndex) {
    const control = this.udrNodeArray().at(parentBlockIndex);
    if (rangeText === 'start') {
      control.get('conditionFieldStartValue').setValue(value);
    }
    if (rangeText === 'end') {
      control.get('conditionFieldEndValue').setValue(value);
    }
  }

  /**
   * getter to show field on the basis of rule type
   */
  get isDuplicateType() {
    return this.form.controls.rule_type.value === BusinessRuleType.BR_DUPLICATE_RULE;
  }

  /**
   * Get all categories from the api
   */
  getCategories() {
    this.categoryList = [];
    this.schemaDetailsService.getAllCategoryInfo().subscribe((response) => {
      this.categoryList.push(...response)
    })
  }

  get isTransformationRule(): boolean {
    return this.form.controls.rule_type.value === BusinessRuleType.BR_TRANSFORMATION;
  }

  /**
   * format label for autoselect
   * @param value pass the selected value
   */
  formatLabel(value) {
    return `${value}`;
  }

  /**
   * Set transformation data output from Transformation rule to business rule form
   * @param transformationData pass transformation data
   */
  setTransformationFormData(transformationData: TransformationFormData) {
    const {
      targetFld,
      sourceFld,
      excludeScript,
      includeScript,
      selectedTargetFields
    } = transformationData;
    this.form.controls.targetFld.setValue(selectedTargetFields.map(item => item.fieldId).join(','));
    this.form.controls.sourceFld.setValue(sourceFld);
    this.form.controls.excludeScript.setValue(excludeScript);
    this.form.controls.includeScript.setValue(includeScript);
  }

  /**
   * Set lookup dtaa output to business rule form
   * @param lookupData pass lookup data
   */
  setLookupData(lookupData: LookupFields[]) {
    this.lookupData = lookupData;
  }

}