import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo, UDRBlocksModel, UdrModel, UDRHierarchyModel, RULE_TYPES, PRE_DEFINED_REGEX, TransformationRuleType, TransformationModel, DuplicateRuleModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
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
import { CONDITIONS } from 'src/app/_constants';
import { TransformationRuleComponent } from '@modules/shared/_components/transformation-rule/transformation-rule.component';
import { ValidationError } from '@models/schema/schema';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { RuleDependentOn } from '@models/collaborator';
import { Metadata } from '@modules/report/edit/container/metadatafield-control/metadatafield-control.component';

@Component({
  selector: 'pros-brrule-side-sheet',
  templateUrl: './brrule-side-sheet.component.html',
  styleUrls: ['./brrule-side-sheet.component.scss']
})
export class BrruleSideSheetComponent implements OnInit {


  /**
   * Array to store all Grid And Hirarchy records
   */
  allGridAndHirarchyData = [];

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
   * hold duplicate rule form reference
   */
  duplicateFormRef: FormGroup;

  /**
   * Store current active outlet
   */
  activeOutlet = 'sb';

  /**
   * reference to the input
   */
  @ViewChild('fieldsInput') fieldsInput: ElementRef;

  /* To access properties of Child for validation purpose
   */
  @ViewChild(TransformationRuleComponent) transformationRuleComponent: TransformationRuleComponent;

  /**
   * To hold information about validation errors.
   */
  validationError: ValidationError = {
    status: false,
    message: ''
  }

  /**
   * Tree child
   */
  @ViewChild('tree') tree = null;

  /**
   * tree control
   */
  treeControl = null;

  /**
   * treeFlattener
   */
  treeFlattener = null;

  /**
   * data source
   */
  dataSource = null;

  /**
   * has child
   */
  hasChild = null;

  /**
   * Hold the metadata fields response ....
   */
  metataData: MetadataModeleResponse = null;

  /**
   * transformation rule type list
   */
  transRuleTypeList = [{ value: this.transformationType.REGEX, key: this.transformationType.REGEX }, { value: this.transformationType.LOOKUP, key: this.transformationType.LOOKUP }];

  /**
   * function to format slider thumbs label.
   * @param percent percent
   */
  rangeSliderLabelFormat(percent) {
    return `${percent}%`;
  }

  /**
   * transformer = return tree object.
   * @param node node
   * @param level level
   */
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
      id: node.id,
      parent: node.parent,
      allData: node.allData
    };
  }

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
    private formBuilder: FormBuilder,
  ) { }

  /**
   * getter for transformation types
   */
  get transformationType() {
    return TransformationRuleType;
  }

  /**
   * Getter for selected transformation type
   */
  get selectedTransformationType() {
    if (this.form && this.form.controls) {
      return this.form.controls.transformationRuleType.value;
    }
    return '';
  }

  /**
   * Getter for selected transformation type for radio button
   */
  get selectedTransRuleTypeRadio() {
    if (this.form && this.form.controls) {
      return this.transRuleTypeList.find(ruleType => this.form.controls.transformationRuleType.value === ruleType.value);
    }
    return '';
  }
  /**
   * Angular hook
   */
  ngOnInit(): void {
    this.getCategories();
    this.filteredModules = of(this.fieldsList);
    this.operators = this.possibleOperators();

    this.treeControl = new FlatTreeControl<{ name: string, level: number, expandable: boolean, id: string, parent: string }>(
      node => node.level, node => node.expandable);

    this.treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.hasChild  =(_: number, node: { name: string, level: number, expandable: boolean, id: string, parent: string }) => node.expandable;

    this.activatedRouter.params.subscribe(res => {
      this.routeData = res;
      this.moduleId = res.moduleId;
      this.schemaId = res.schemaId;
      this.activeOutlet = res.outlet || 'sb';
      this.brId = res.brId ? (res.brId !== 'new' ? res.brId : '') : '';
      this.buildCommonDataForm().then(() => {
        this.initUDRForm();
        if (this.brId) {
          this.getBusinessRuleInfo(this.brId);
        } else {
          this.getFieldsByModuleId();
          this.form.controls.rule_type.setValue(BusinessRuleType.BR_MANDATORY_FIELDS);
        }
      });
    });
  }

  /**
   * Initialize UDR form
   */
  initUDRForm() {
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
  }

  /**
   * get the current weightage value
   */
  get currentweightageValue() {
    return this.schemaService.currentweightageValue;
  }

  /**
   * get businessrule data from api to patch in sidesheet
   */
  getBusinessRuleInfo(brId) {
    this.schemaService.getBusinessRuleInfo(brId).subscribe((businessRuleInfo: CoreSchemaBrInfo) => {
      this.coreSchemaBrInfo = businessRuleInfo;
      if (this.coreSchemaBrInfo) {
        // Patch received data
        this.setValueToElement(this.coreSchemaBrInfo);
        this.getFieldsByModuleId();
        if (this.coreSchemaBrInfo.brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
          this.editUdr(businessRuleInfo);
        }
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
          if (keyword) {
            const filterData = [];
            this.allGridAndHirarchyData.forEach(item => {
              if (item.name.toString().toLowerCase().indexOf(keyword) !== -1 || (!!item.parent && item.parent.toString().toLowerCase().indexOf(keyword) !== -1)
                || item.children.filter(child => { return child.name.toString().toLowerCase().indexOf(keyword) !== -1 }).length >= 1) {
                const parentChildData = item;
                if (item.children.filter(child => { return child.name.toString().toLowerCase().indexOf(keyword) !== -1 }).length >= 1) {
                  parentChildData.children = item.children.filter(child => { return child.name.toString().toLowerCase().indexOf(keyword) !== -1 });
                }
                filterData.push(parentChildData);
              }
            });
            this.dataSource.data = filterData;
            if (this.tree !== null && this.tree.treeControl !== null) {
              this.tree.treeControl.expandAll();
            }
            return this.fieldsList.filter(item => {
              return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
            }).length >= 1 || this.dataSource.data.length === 0 ? this.fieldsList.filter(item => {
              return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
            }) : [{ fieldDescri: 'No header data found', fieldId: null }];
          } else {
            this.dataSource.data = this.allGridAndHirarchyData;
            if (this.tree !== null && this.tree.treeControl !== null) {
              this.tree.treeControl.collapseAll();
            }
            return this.fieldsList;
          }
        }),
      )
  }
  /**
   * return grid fields by grid key
   * @param metadataModeleResponse metaData Object
   * @param gridKey grid Key to identify
   * @param parentDesc parent desc name
   */
  getGridFieldsByGridKey(metadataModeleResponse: MetadataModeleResponse, gridKey: string, parentDesc: string) {
    const dataToPush = [];
    for (const key in metadataModeleResponse.gridFields[gridKey]) {
      if (metadataModeleResponse.gridFields[gridKey].hasOwnProperty(key)) {
        const field = metadataModeleResponse.gridFields[gridKey];
        dataToPush.push({ name: field[key].fieldDescri, id: field[key].fieldId, parent: parentDesc, children: [] });
      }
    }
    return dataToPush;
  }

  /**
   * return Hierarchy field by key
   * @param metadataModeleResponse metaData Object
   * @param hierarchyKey hirechy key
   * @param parentDesc parent dsc name
   * @param heirarchyId heirarchy id
   */
  getHierarchyFieldsByHierarchyKey(metadataModeleResponse: MetadataModeleResponse, hierarchyKey: string, parentDesc: string, heirarchyId: string) {
    const dataToPush = [];
    for (const key in metadataModeleResponse.hierarchyFields[heirarchyId]) {
      if (metadataModeleResponse.hierarchyFields[heirarchyId].hasOwnProperty(key)) {
        const field = metadataModeleResponse.hierarchyFields[heirarchyId];
        dataToPush.push({ name: field[key].fieldDescri, id: field[key].fieldId, parent: parentDesc, children: [] });
      }
    }
    return dataToPush;
  }

  /**
   * Initialize tree view
   * @param metadataModeleResponse metadate Object
   */
  initGridAndHierarchyToAutocompleteDropdown(metadataModeleResponse: MetadataModeleResponse) {
    const data = [];
    for (const key in metadataModeleResponse.grids) {
      if (metadataModeleResponse.grids.hasOwnProperty(key)) {
        const objToPush = {
          name: metadataModeleResponse.grids[key].fieldDescri,
          id: metadataModeleResponse.grids[key].fieldId,
          parent: null,
          children: this.getGridFieldsByGridKey(metadataModeleResponse, metadataModeleResponse.grids[key].fieldId, metadataModeleResponse.grids[key].fieldDescri)
        }
        data.push(objToPush)
      }
    }

    for (const key in metadataModeleResponse.hierarchy) {
      if (metadataModeleResponse.hierarchy.hasOwnProperty(key)) {
        const objToPush = {
          name: metadataModeleResponse.hierarchy[key].heirarchyText,
          id: metadataModeleResponse.hierarchy[key].fieldId,
          parent: null,
          children: this.getHierarchyFieldsByHierarchyKey(metadataModeleResponse, metadataModeleResponse.hierarchy[key].fieldId, metadataModeleResponse.hierarchy[key].heirarchyText,
            metadataModeleResponse.hierarchy[key].heirarchyId)
        }
        data.push(objToPush)
      }
    }
    if (this.dataSource !== null) {
      this.dataSource.data = data;
    }
    this.allGridAndHirarchyData = data;
  }

  /**
   * Initialize the form object and
   * subscribe to any required control value changes
   */
  buildCommonDataForm() {
    return new Promise((resolve, reject) => {
      const controls = {
        rule_type: new FormControl('', [Validators.required]),
        rule_name: new FormControl('', [Validators.required]),
        error_message: new FormControl('', [Validators.required]),
        standard_function: new FormControl(''),
        regex: new FormControl(''),
        fields: new FormControl(''),
        apiKey: new FormControl(''),
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

      resolve(null);
    });
  }

  /**
   * function to return formField
   */
  formField(field: string) {
    return this.form.get(field);
  }

  /**
   * function to UPDATE Transformation rule type when lib radio is clicked
   */
  updateTransformationRuleType($event) {
    if (this.form?.controls) {
      this.form.controls.transformationRuleType.setValue($event.value);
    }
  }

  /**
   * Apply conditional form validation based on rule type
   * keep the required field updated based on a selected rule type
   * loop through the required keys and add validators to all required fields
   * also nullify validators for all not required fields at the same time
   * @param selectedRule selected rule type
   */
  applyValidatorsByRuleType(selectedRule: string) {
    this.submitted = false;
    this.currentSelectedRule = selectedRule;
    const controlKeys: any[] = Object.keys(this.currentControls);
    let requiredKeys: string[] = [];
    if (selectedRule === BusinessRuleType.BR_CUSTOM_SCRIPT) {
      requiredKeys = ['rule_name', 'error_message'];
    }
    if (selectedRule === BusinessRuleType.BR_REGEX_RULE) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields', 'regex', 'standard_function'];
    }
    if (selectedRule === BusinessRuleType.BR_MANDATORY_FIELDS || selectedRule === BusinessRuleType.BR_METADATA_RULE || selectedRule === BusinessRuleType.MRO_CLS_MASTER_CHECK || selectedRule === BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields'];
    }
    if (selectedRule === BusinessRuleType.BR_TRANSFORMATION) {
      requiredKeys = ['rule_name', 'categoryId', 'transformationRuleType', 'error_message'];
      if (this.selectedTransformationType === this.transformationType.REGEX) {
        requiredKeys = ['rule_name', 'categoryId', 'transformationRuleType', 'error_message', 'sourceFld'];
      }
      else if (this.selectedTransformationType === this.transformationType.LOOKUP) {
        requiredKeys = ['rule_type', 'rule_name', 'categoryId', 'transformationRuleType', 'error_message'];
      }
    }
    if (selectedRule === BusinessRuleType.BR_DUPLICATE_RULE) {
      requiredKeys = ['rule_name'];
    }

    if (selectedRule === BusinessRuleType.MRO_GSN_DESC_MATCH || selectedRule === BusinessRuleType.MRO_MANU_PRT_NUM_LOOKUP) {
      requiredKeys = ['rule_name', 'error_message', 'categoryId', 'apiKey', 'fields'];
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
        // this.form.get(key).setValidators([Validators.required]);
        this.form.controls[key].setValidators([Validators.required]);
        this.form.controls[key].updateValueAndValidity();
      }
    });

    // this.form.updateValueAndValidity();
  }

  /**
   * method to patch initial data when editing a business rule
   * There's a patchlist array that decides what value to patch
   * based on the business rule type received
   * @param br Pass the business rule data to be patched
   */
  setValueToElement(br: CoreSchemaBrInfo) {
    const dataToPatch = {
      rule_type: br.brType,
      rule_name: br.brInfo,
      error_message: br.message,
      standard_function: br.standardFunction,
      regex: br.regex,
      fields: br.fields,
      apiKey: br.apiKey,
      sourceFld: '',
      targetFld: '',
      excludeScript: '',
      includeScript: '',
      udrTreeData: '',
      weightage: br.brWeightage,
      categoryId: br.categoryId,
      transformationRuleType: ''
    };

    let patchList = [];

    if (br.brType === BusinessRuleType.BR_METADATA_RULE || br.brType === BusinessRuleType.BR_MANDATORY_FIELDS || br.brType === BusinessRuleType.MRO_CLS_MASTER_CHECK || br.brType === BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId'];
    }
    if (br.brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
      patchList = ['rule_type', 'rule_name', 'weightage', 'error_message'];
    }
    if (br.brType === BusinessRuleType.BR_TRANSFORMATION) {
      dataToPatch.transformationRuleType = this.getTrRuleType(br.transFormationSchema);
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'transformationRuleType'];
      this.patchTransformationFormData(dataToPatch.transformationRuleType, br.transFormationSchema);
    }
    if (br.brType === BusinessRuleType.BR_REGEX_RULE) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'standard_function', 'regex'];
    }

    if (br.brType === BusinessRuleType.BR_DUPLICATE_RULE) {
      patchList = ['rule_type', 'rule_name'];
    }

    if (br.brType === BusinessRuleType.MRO_GSN_DESC_MATCH || br.brType === BusinessRuleType.MRO_MANU_PRT_NUM_LOOKUP) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'apiKey'];
    }

    if (patchList && patchList.length > 0) {
      patchList.map((key) => {
        if (dataToPatch[key]) {
          if (key === 'categoryId') {
            this.form.controls[key].setValue(`${dataToPatch[key]}`);
          } else {
            this.form.controls[key].setValue(dataToPatch[key]);
          }
        }
      });
    }

    this.form.get('rule_type').disable({ onlySelf: true, emitEvent: true });
    this.form.get('transformationRuleType').disable({ onlySelf: true, emitEvent: true });
  }

  /**
   * Patch transformation form data
   * @param transformationSchema transformation rule details to be passed
   */
  patchTransformationFormData(currentType: string, transformationSchema: TransformationModel[]) {
    if (currentType === this.transformationType.REGEX) {
      if (transformationSchema && transformationSchema.length > 0) {
        const data: TransformationModel = transformationSchema[0];
        const { excludeScript, includeScript, sourceFld, targetFld, udrBlockModel } = data;
        this.transformationData = {
          excludeScript,
          includeScript,
          sourceFld,
          targetFld,
          parameter: udrBlockModel
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
              lookupColumn: schema.udrBlockModel ? schema.udrBlockModel.conditionFieldId : '',
              lookupColumnResult: schema.udrBlockModel ? schema.udrBlockModel.conditionValueFieldId : '',
              moduleId: schema.udrBlockModel ? schema.udrBlockModel.objectType : ''
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
   * Map the order of blocks and hierarchy and make sure the "When block" is on top
   * @param br Pass the business rule data
   */
  mapBlocksAndHierarchy(br: CoreSchemaBrInfo) {
    const mapped = {
      blocks: [],
      blockHierarchy: []
    };
    const unMapped = {
      blocks: [],
      blockHierarchy: []
    };

    const blocks: UDRBlocksModel[] = br.udrDto ? (br.udrDto.blocks ? br.udrDto.blocks : []) : [];
    const hierarchy: UDRHierarchyModel[] = br.udrDto ? (br.udrDto.udrHierarchies ? br.udrDto.udrHierarchies : []) : [];

    blocks.map((blk) => {
      if (blk.blockDesc.toLowerCase() === 'when') {
        mapped.blocks.push(blk);
        mapped.blockHierarchy.push(hierarchy.find((hie) => hie.blockRefId === blk.id));
      } else {
        unMapped.blocks.push(blk);
        unMapped.blockHierarchy.push(hierarchy.find((hie) => hie.blockRefId === blk.id));
      }
    });

    mapped.blocks.push(...unMapped.blocks);
    mapped.blockHierarchy.push(...unMapped.blockHierarchy);

    return mapped;
  }

  /**
   * Initilize form while edit ..
   * @param br initilize form while edit ..
   */
  editUdr(br: CoreSchemaBrInfo) {

    const { blockHierarchy, blocks } = this.mapBlocksAndHierarchy(br);

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
            udrid: br.brIdStr,
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
    console.log(udr);

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
    if (!this.moduleId) { return };
    this.schemaDetailsService.getMetadataFields(this.moduleId)
      .subscribe((metadataModeleResponse: MetadataModeleResponse) => {
        this.metataData = metadataModeleResponse;
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
        this.filteredModules = of(this.fieldsList);
        this.initGridAndHierarchyToAutocompleteDropdown(metadataModeleResponse);
        this.initiateAutocomplete();
        if (this.brId && this.coreSchemaBrInfo) {
          try {
            const fldIds = this.coreSchemaBrInfo.fields ? this.coreSchemaBrInfo.fields.split(',') : [];
            this.selectedFields = [];
            fldIds.forEach(fld => {
              const fldCtrl = this.fieldsList.find(fil => fil.fieldId === fld);
              if (fldCtrl) {
                this.selectedFields.push({ fieldDescri: fldCtrl.fieldDescri, fieldId: fld });
              } else {
                const fieldsselected = this.allGridAndHirarchyData.find(parent => { return parent.children.find(child => { return child.id === fld }) });
                if (fieldsselected && fieldsselected.children.length >= 1) {
                  const field = fieldsselected.children.find(child => child.id === fld);
                  if (field) {
                    this.selectedFields.push({ fieldDescri: field.parent + '/' + field.name, fieldId: field.id });
                  }
                }
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
  selectField(event) {
    if (!!event.option.value) {
      const alreadyExists = this.selectedFields.find(item => item.fieldId === event.option.value);
      if (alreadyExists) {
        this.snackBar.open('This field is already selected', 'error', { duration: 5000 });
      } else {
        this.selectedFields.push({
          fieldDescri: event.option.viewValue,
          fieldId: event.option.value
        });
      }
      this.form.get('fields').patchValue('');
      const txtfield = document.getElementById('fieldsInput') as HTMLInputElement;
      if (txtfield) {
        txtfield.value = '';
      }
      if (this.fieldsInput) {
        this.fieldsInput.nativeElement.blur();
      }
    }
  }
  /**
   * While clicking on Tree node
   * @param selectedNode selected node
   */
  clickTreeNode(selectedNode) {
    const selectedNodes = {
      fieldDescri: selectedNode.parent + '/' + selectedNode.name,
      fieldId: selectedNode.id
    }
    const alreadyExists = this.selectedFields.find(item => item.fieldId === selectedNodes.fieldId);
    if (alreadyExists) {
      this.snackBar.open('This field is already selected', 'error', { duration: 5000 });
    } else {
      this.selectedFields.push(selectedNodes);
    }
    this.form.get('fields').patchValue('');
    const txtfield = document.getElementById('fieldsInput') as HTMLInputElement;
    if (txtfield) {
      txtfield.value = '';
    }
    if (this.fieldsInput) {
      this.fieldsInput.nativeElement.blur();
    }
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
    this.router.navigate([{ outlets: { [`${this.activeOutlet}`]: null } }], {queryParamsHandling: 'preserve'});
  }
  /**
   * function to set form values from mat auto complete
   */
  selectSingle(form: FormGroup, controlName: string, $event) {
    form.controls[controlName].setValue($event.option.value);
    if (controlName === 'standard_function') {
      const code = this.preDefinedRegex.find(x => x.FUNC_TYPE === $event.option.value)?.FUNC_CODE;
      form.controls.regex.setValue(code);
    }
    if (controlName === 'rule_type') {
      const categoryValidators = this.isDuplicateType ? [] : [Validators.required];
      this.form.controls['categoryId'].setValidators(categoryValidators);
    }
  }

  /**
   * function to display category name in mat auto complete
   */
  displayCategoryFn(value?: string) {
    return value ? this.categoryList.find(category => `${category.categoryId}` === `${value}`)?.categoryDesc : '';
  }

  /**
   * function to display rule desc in mat auto complete
   */
   displayRuleFn(value?: string) {
    return value ? this.businessRuleTypes.find(rule => rule.ruleType === value)?.ruleDesc : '';
  }

  /**
   * function to display Regex name in mat auto complete
   */
   displayRegexFn(value?: string) {
    return value ? this.preDefinedRegex.find(rule => rule.FUNC_TYPE === value)?.FUNC_NAME : '';
  }

  /**
   * function to save the form data
   */
  save() {
    this.submitted = true;
    this.form.controls.fields.setValue(this.selectedFields.map(item => item.fieldId).join(','));
    (Object).values(this.form.controls).forEach(control => {
      if (control.invalid)
        control.markAsTouched();
    });
    if (this.transformationRuleComponent)
      (Object).values(this.transformationRuleComponent.form.controls).forEach(control => {
        this.transformationRuleComponent.submitted = true;
        if (control.invalid)
          control.markAsTouched();
      });
    this.submitted = true;
    if (!this.form.valid) {
      this.showValidationError('Please fill the required fields.');
      return;
    }

    let brType: string = this.form.value ? this.form.value.rule_type : '';
    brType = brType ? brType : this.coreSchemaBrInfo.brType;

    if (this.currentSelectedRule === BusinessRuleType.BR_TRANSFORMATION &&
      this.selectedTransformationType === this.transformationType.LOOKUP &&
      this.lookupData.length === 0) {
      this.showValidationError('Please configure at least one field.');
      return;
    }

    if (brType === 'BR_CUSTOM_SCRIPT') {

      // for user defined rule
      const udrDto: UdrModel = new UdrModel();
      udrDto.brInfo = {
        brId: this.brId, brIdStr: this.brId,
        brType, brInfo: this.form.value.rule_name,
        message: this.form.value.error_message,
        schemaId: this.schemaId,
        moduleId: this.moduleId,
        brWeightage: this.form.value.weightage,
        isCopied: false,
        copiedFrom: '',
        dependantStatus: this.coreSchemaBrInfo.dependantStatus || RuleDependentOn.ALL,
        order: this.coreSchemaBrInfo.order || 0,
        status: this.coreSchemaBrInfo.status || '1'
      } as CoreSchemaBrInfo;

      const blocks: UDRBlocksModel[] = [];
      const frm = this.udrNodeArray();
      for (let i = 0; i < frm.length; i++) {
        blocks.push(frm.at(i).value as UDRBlocksModel)
      }
      if (!(blocks.length >=2 && blocks.every(x => x.blockType && x.conditionOperator && x.conditionFieldId))) {
        this.showValidationError('Please configure at least one condition.');
        return;
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
        this.snackBar.open(`Successfully saved !`, 'Close', { duration: 3000 });
        this.sharedService.setAfterBrSave(res);
        this.close();
      }, error => {
        this.snackBar.open(`Something went wrong `, 'Close', { duration: 3000 });
      });

    } else if (brType === BusinessRuleType.BR_DUPLICATE_RULE) {
      // save duplicate rule
      this.saveDuplicateRule();
      // this.sharedService.emitSaveBrEvent(brInfo);

    } else if (brType === BusinessRuleType.BR_TRANSFORMATION) {
      const response = {
        formData: this.form.getRawValue(),
        tempId: '',
        lookupData: this.lookupData,
        transformationData: this.transformationData
      };
      const finalFormData = {
        ...this.form.getRawValue(),
        brId: this.brId ? this.brId : '',
        brType,
        transFormationSchema: this.mapTransformationData(response, brType),
      }
      const brObject = this.createBrObject(finalFormData);

      brObject.dependantStatus = this.coreSchemaBrInfo.dependantStatus || RuleDependentOn.ALL;
      brObject.order = this.coreSchemaBrInfo.order || 0;
      brObject.status = this.coreSchemaBrInfo.status || '1';

      this.schemaService.createBusinessRule(brObject).subscribe(res => {
        this.sharedService.setAfterBrSave(res);
        this.close();
      }, err => console.error(`Error : ${err.message}`));

    } else {
      const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();
      request.brId = this.brId ? this.brId : '';
      request.brType = brType;
      request.message = this.form.value.error_message;
      request.brInfo = this.form.value.rule_name;
      request.fields = this.form.value.fields;
      request.apiKey = this.form.value.apiKey;
      request.regex = this.form.value.regex;
      request.standardFunction = this.form.value.standard_function;
      request.schemaId = this.schemaId;
      request.moduleId = this.moduleId;
      request.brWeightage = this.form.value.weightage;
      request.categoryId = this.coreSchemaBrInfo.categoryId ? this.coreSchemaBrInfo.categoryId : this.form.value.categoryId;
      request.isCopied = false;
      request.copiedFrom = '';
      request.dependantStatus = this.coreSchemaBrInfo.dependantStatus || RuleDependentOn.ALL;
      request.order = this.coreSchemaBrInfo.order || 0;
      request.status = this.coreSchemaBrInfo.status || '1';
      this.schemaService.createBusinessRule(request).subscribe(res => {
        this.sharedService.setAfterBrSave(res);
        this.close();
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
      apiKey: object.apiKey,
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
      schemaId: this.schemaId,
      brIdStr: object.brIdStr ? object.brIdStr : '',
      udrDto: {
        udrHierarchies: object.udrHierarchies ? object.udrHierarchies : udrTreeData ? udrTreeData.udrHierarchies : [],
        blocks: object.blocks ? object.object : udrTreeData ? udrTreeData.blocks : []
      },
      transFormationSchema: object.transFormationSchema,
      isCopied: object.isCopied ? object.isCopied : false,
      moduleId: this.moduleId
    } as CoreSchemaBrInfo;
  }

  /**
   * method to map transformation rule data from form
   * object to transformationschema format
   * @param response pass the response with formData and lookup object
   */
  mapTransformationData(response, ruleType) {
    const { sourceFld, targetFld, includeScript, excludeScript, transformationRuleType } = response.formData;
    const transformationList: TransformationModel[] = [];
    if (ruleType === BusinessRuleType.BR_TRANSFORMATION) {
      if (response.lookupData && response.lookupData.length > 0) {
        response.lookupData.map((param: LookupFields) => {
          const udr = this.createUDRBlockFromLookup(param);
          transformationList.push({
            brId: '',
            sourceFld: param.fieldId,
            targetFld: param.lookupTargetField,
            includeScript,
            excludeScript,
            transformationRuleType,
            lookUpObjectType: udr.objectType,
            lookUptable: '',
            udrBlockModel: udr
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
          udrBlockModel: null
        });
      }
      return transformationList;
    }
    return null;
  }

  /**
   * create UDR block data from lookup field
   * @param lookupData lookup data to be passed here
   */
  createUDRBlockFromLookup(lookupData: LookupFields): UDRBlocksModel {
    return {
      id: Math.floor(Math.random() * 100000000000).toString(),
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
    genericOp.desc = CONDITIONS.common.desc;
    genericOp.childs = CONDITIONS.common.operators;

    // for numeric number field
    const onlyNum: ConditionalOperator = new ConditionalOperator();
    onlyNum.desc = CONDITIONS.numeric.desc;
    onlyNum.childs = CONDITIONS.numeric.operators;

    // for special operators
    const specialOpe: ConditionalOperator = new ConditionalOperator();
    specialOpe.desc = CONDITIONS.special.desc;
    specialOpe.childs = CONDITIONS.special.operators;

    return [genericOp, onlyNum, specialOpe];
  }

  /**
   * method to set the comparison value
   * @param value pass the value to set
   * @param index pass the index
   */
  setComparisonValue(value: string, index: number) {
    const array = this.udrNodeArray().at(index);
    array.get('conditionFieldValue').setValue(value);
  }

  /**
   * method to set the comparison value for child
   * @param value pass the value
   * @param chldNode pass the child node
   * @param parentNode pass the parent node
   */
  setComparisonValueForChild(value, chldNode: number, parentNode: number) {
    const childArray = this.getChildAsControl(parentNode).at(chldNode);
    childArray.get('conditionFieldValue').setValue(value);
  }

  /**
   * Method to set range for child values for custom rule
   * @param value range value
   * @param rangeText range text
   * @param childObject pass the child object
   * @param parentIndex pas sthe parent's index
   */
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
    this.schemaDetailsService.getAllCategoryInfo().subscribe((response: CategoryInfo[]) => {
      if (response && response.length > 0) {
        this.categoryList = response;
      }
    })
  }

  /**
   * getter to check if a rule is transformation rule
   */
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
      sourceFld,
      excludeScript,
      includeScript,
      selectedTargetFields
    } = transformationData;
    this.form.controls.targetFld.setValue(selectedTargetFields.map(item => item.fieldId).join(','));
    if (sourceFld) { this.form.controls.sourceFld.setValue(sourceFld); };
    if (excludeScript) { this.form.controls.excludeScript.setValue(excludeScript); };
    if (includeScript) { this.form.controls.includeScript.setValue(includeScript); };
  }

  /**
   * Set lookup dtaa output to business rule form
   * @param lookupData pass lookup data
   */
  setLookupData(lookupData: LookupFields[]) {
    this.lookupData = lookupData;
  }

  /**
   * modified the value to show
   * @param value pass the value object
   */
  displayFn(value) {
    return value ? value.fieldDescri : '';
  }

  /**
   * Setting form reference for duplicate rule
   * @param formRef pass th form reference
   */
  setDuplicateFormRef(formRef: FormGroup) {
    // console.log(formRef);
    this.duplicateFormRef = formRef;
  }

  /**
   * Save the created suplicate rule
   */
  saveDuplicateRule() {
    const brInfo = {
      brId: this.brId,
      brIdStr: this.brId,
      brType: BusinessRuleType.BR_DUPLICATE_RULE,
      brInfo: this.form.value.rule_name,
      message: this.form.value.error_message,
      schemaId: this.schemaId,
      categoryId: this.coreSchemaBrInfo.categoryId,
      dependantStatus: this.coreSchemaBrInfo.dependantStatus || RuleDependentOn.ALL,
      order: this.coreSchemaBrInfo.order || 0,
      status: this.coreSchemaBrInfo.status || '1'
    } as CoreSchemaBrInfo;

    if (!this.duplicateFormRef.valid) {
      this.showValidationError('Please fill the required fields.');
      return;
    }

    if (!this.duplicateFormRef.get('addFields').value.length) {
      this.showValidationError('Please configure at least one field.');
      return;
    }


    const model = new DuplicateRuleModel();
    model.coreBrInfo = { ...brInfo, brType: BusinessRuleType.BR_DUPLICATE_RULE };

    model.addFields = this.duplicateFormRef.value.addFields;
    model.mergeRules = this.duplicateFormRef.value.mergeRules;
    model.selCriteria = this.duplicateFormRef.value.selCriteria;
    model.removeList = this.duplicateFormRef.value.removeList;

    const params = { objectId: this.moduleId, autoMerge: '', groupId: '' };

    console.log(model);

    this.schemaService.saveUpdateDuplicateRule(model, params).subscribe(res => {
      this.snackBar.open(`Successfully saved !`, 'Close', { duration: 5000 });
      console.log(res);
      this.sharedService.setAfterBrSave(res);
      this.close();
    }, error => {
      this.snackBar.open(`Something went wrong `, 'Close', { duration: 5000 });
    });

  }

  /**
   * Function to hide validation error
   * @param message: error message to display..
   */
  showValidationError(message: string) {
    this.validationError.status = true;
    this.validationError.message = message;
    setTimeout(() => {
      this.validationError.status = false;
    }, 3000)
  }

  /**
   * Update udr node fieldids .....
   * @param field selected field ctrl
   * @param controlIndex parent ctrl index
   * @param childElementCtrl child ctrl index ...
   */
   udrFieldSelectionChange(field: Metadata[] , controlIndex: number, childElementCtrl?: number) {
    if(childElementCtrl !== undefined) {
      this.getChildAsControl(controlIndex).at(childElementCtrl).get('conditionFieldId').setValue(field[0] ? field[0].fieldId : '');
    } else {
      this.udrNodeArray().at(controlIndex).get('conditionFieldId').setValue(field[0] ? field[0].fieldId : '');
    }
    console.log(this.udrNodeArray());
  }
}