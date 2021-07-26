import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType, CoreSchemaBrInfo, UDRBlocksModel, UdrModel, UDRHierarchyModel, RULE_TYPES, PRE_DEFINED_REGEX, TransformationRuleType, TransformationModel, DuplicateRuleModel, TransformationMappingResponse, TransformationMappingTabResponse, TransformationRuleMapped, ApiRulesInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
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
import { GlobaldialogService } from '@services/globaldialog.service';
import { TransientService } from 'mdo-ui-library';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounce } from 'lodash';

class ConditionalOperator {
  desc: string;
  childs: string[];
}

@Component({
  selector: 'pros-brrule-side-sheet',
  templateUrl: './brrule-side-sheet.component.html',
  styleUrls: ['./brrule-side-sheet.component.scss']
})
export class BrruleSideSheetComponent implements OnInit {

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
    private globalService: GlobaldialogService,
    private transientService: TransientService
  ) { }

  /**
   * getter for transformation types...
   */
  get transformationType() {
    return TransformationRuleType;
  }

  get selectedRuleDesc() {
    const value = this.form?.get('rule_type').value;
    return this.brId ? this.businessRuleTypes.find(x => x.ruleType === value)?.ruleDesc : '';
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
  get businessRuleTypesFiltered() {
    const searchStr = this.searchRuleTypeStr?.toLowerCase();
    return this.businessRuleTypes.filter(x => x.ruleDesc?.toLowerCase().includes(searchStr) || x.ruleType?.toLowerCase().includes(searchStr));
  }
  get preDefinedRegexFiltered() {
    const searchStr = this.searchRegexFunctionStr?.toLowerCase();
    return this.preDefinedRegex.filter(x => x.FUNC_NAME?.toLowerCase().includes(searchStr) || x.FUNC_TYPE?.toLowerCase().includes(searchStr));
  }

  /**
   * filter source field dropdown
   */
  get sourceFieldsFiltered() {
    const searchStr = this.form.value.sourceFieldSearchStr?.toLowerCase();
    return this.sourceFieldsObject.list.filter(x => x[this.sourceFieldsObject.labelKey]?.toLowerCase().includes(searchStr) || x[this.sourceFieldsObject.valueKey]?.toLowerCase().includes(searchStr));
  }

  get isFormLoading() {
    return Boolean(this.moduleId && !this.metataData);
  }

  /**
   * get the current weightage value
   */
  get currentweightageValue() {
    return this.schemaService.currentweightageValue;
  }

  /**
   * getter to show field on the basis of rule type
   */
  get isRegexType() {
    return this.form.controls.rule_type.value === BusinessRuleType.BR_REGEX_RULE
  }

  /**
   * check if rule type is Manufacturer Part Number Identification
   */
  get isMPNI() {
    return this.form.controls.rule_type.value === BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI
  }

  /**
   * Check if rule type is User defined rule
   */
  get isUDR() {
    return this.form.controls.rule_type.value === 'BR_CUSTOM_SCRIPT'
  }

  /**
   * getter to show field on the basis of rule type
   */
  get isDuplicateType() {
    return this.form.controls.rule_type.value === BusinessRuleType.BR_DUPLICATE_RULE;
  }

  /**
   * getter to check if a rule is transformation rule
   */
  get isTransformationRule(): boolean {
    return (this.form.controls.rule_type.value === BusinessRuleType.BR_TRANSFORMATION || this.isOnlyForTrans);
  }

  /**
   * Enable the trans for all these rules....
   */
   get isTransEnabled() {
    const enableFor = ['BR_METADATA_RULE','BR_MANDATORY_FIELDS','BR_REGEX_RULE','BR_CUSTOM_SCRIPT'];
    if(this.form && this.form.value.rule_type && enableFor.indexOf(this.form.value.rule_type) !==-1) {
      return true;
    } else if(this.coreSchemaBrInfo && enableFor.indexOf(this.coreSchemaBrInfo.brType) !==-1) {
      return true;
    }

    return false;
  }


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
   * obervable for autocomplete in target field multiselect dropdown
   */
  targetFilteredModules: Observable<{} | string | void> = of([]);

  /**
   * array to save the selected fields
   */
  selectedFields = [];

  /**
   * array to save the selected target fields
   */
  selectedTargetFields = [];

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

  /**
   * reference to target field search input
   */
  @ViewChild('targetFieldsInput') targetFieldsInput: ElementRef;

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
   * Hold search string for business rule type ....
   */
  searchRuleTypeStr = '';
  /**
   * Hold search string for regex functions ....
   */
  searchRegexFunctionStr = '';
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
   * Formcontrol for the enable transformation inside the rule
   */
   hasAppliedTransformationCtrl: FormControl;

   /**
    * Hold the active tab index
    */
   transTabIndex = 0;

   /**
    * All transformation rule inside ... the main rule
    */
   attachedTransRules: TransformationMappingResponse;

   /**
    * Check for enable only transformation ...
    */
   isOnlyForTrans = false;

   transformationRules: CoreSchemaBrInfo[] = [];

   /**
    * Hold all the api rules
    */
   apiRules: ApiRulesInfo[] = [];


  /**
   * Search the trans rule from map lib..
   */
  delayedCallWithTransLib = debounce((searchText: string) => {
    this.getTransRules(searchText);
  }, 400);


  /**
   * Search the trans rule from map lib..
   */
   delayedCallForApis = debounce((searchText: string) => {
    this.getApisRule(searchText);
  }, 400);

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
   * Angular hook
   */
  ngOnInit(): void {
    this.hasAppliedTransformationCtrl = new FormControl(false);
    this.filterRuleTypes();
    this.getCategories();
    this.filteredModules = of(this.fieldsList);
    this.targetFilteredModules = of(this.fieldsList);
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
          // set is trans edit only
          this.activatedRouter.queryParams.subscribe(q=>{
            if(this.activeOutlet === 'sb3' && q.r && q.r === 'BR_TRANSFORMATION') {
              this.isOnlyForTrans = true;
            } else {
              this.isOnlyForTrans = false;
            }
          });
        } else {
          this.getFieldsByModuleId();
          // not required missing rule bydefault...
          // this.form.controls.rule_type.setValue(BusinessRuleType.BR_MANDATORY_FIELDS);
          this.activatedRouter.queryParams.subscribe(q=>{
            if(this.activeOutlet === 'sb3' && q.r && q.r === 'BR_TRANSFORMATION') {
              this.form.controls.transformationRuleType.setValue(this.transformationType.REGEX);
              // update manually if has only for transformation rule
              setTimeout(()=>{
                this.applyValidatorsByRuleType(BusinessRuleType.BR_TRANSFORMATION);
              },200);
              this.isOnlyForTrans = true;
            } else {
              this.isOnlyForTrans = false;
            }
          });
        }
      });
    });

    /**
     * After add the transformation from side sheet should add on the rules...
     */
     this.sharedService.getAfterBrSave().subscribe((res: CoreSchemaBrInfo[])=>{
      if(res) {
        if(Array.isArray(res) && res.map(m=> m.brType === BusinessRuleType.BR_TRANSFORMATION).length === res.length) {
          this.addTransRules(res);
        } else if(!Array.isArray(res)) {
          this.addTransRules(res);
        }

      }
    });

    /**
     * Call api to get the transformation ....
     */
    this.hasAppliedTransformationCtrl.valueChanges.subscribe(r=>{
      if(r && !this.attachedTransRules) {
        this.getMappedTransformationRules();
      }
      if(r && this.transformationRules.length ===0) {
        this.getTransRules();
      }
    });

    this.sharedService.gettransSavedBehaviourSub().subscribe(s=>{
      if(s) {
        this.getTransRules();
      }
    });


    // this.form.controls.apiSno.valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(res=>{
    //   if(typeof res ==='string') {
    //     this.getApisRule(res);
    //   }
    // });

  }

  /**
   * Removes untested rule types
   */
  filterRuleTypes() {
    const testedTypes = ['BR_METADATA_RULE', 'BR_MANDATORY_FIELDS', 'BR_REGEX_RULE', 'BR_CUSTOM_SCRIPT', 'BR_DUPLICATE_CHECK','BR_TRANSFORMATION','BR_API_RULE', 'MRO_MANU_PRT_NUM_LOOKUP', 'MRO_CLS_MASTER_CHECK', 'MRO_MANU_PRT_NUM_IDENTI'];
    this.businessRuleTypes = this.businessRuleTypes.filter((x) => testedTypes.includes(x.ruleType));
  }

  /**
   * Initialize UDR form
   */
  initUDRForm() {
    this.udrNodeForm = this.formBuilder.group({
      frmArray: this.formBuilder.array([this.formBuilder.group({
        blockDesc: new FormControl('When'),
        blockType: new FormControl(BlockType.AND, [Validators.required]),
        conditionFieldEndValue: new FormControl(''),
        conditionFieldId: new FormControl('', [Validators.required]),
        conditionFieldStartValue: new FormControl(''),
        conditionFieldValue: new FormControl(''),
        conditionOperator: new FormControl('', [Validators.required]),
        conditionValueFieldId: new FormControl('', [Validators.required]),
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

        // check the transformation enable for this rule if yes then call for get all transformation rule inside this rule
        if(businessRuleInfo.isTransformationApplied) {
          this.getMappedTransformationRules();
          this.getTransRules();
        }

        // set the api rule
        if(this.coreSchemaBrInfo.brType === BusinessRuleType.BR_API_RULE) {
          this.getApisRule('', this.coreSchemaBrInfo.apiSno);
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
            console.log(keyword);

            keyword = keyword.toLowerCase();
            const filterData = [];
            this.allGridAndHirarchyData.forEach(item => {
              if (item.name.toString().toLowerCase().indexOf(keyword) !== -1 || (!!item.parent && item.parent.toString().toLowerCase().indexOf(keyword) !== -1)
                || item.children.filter(child => { return child.name.toString().toLowerCase().indexOf(keyword) !== -1 }).length >= 1) {
                const parentChildData = {...item};
                if (item.children.filter(child => { return child.name.toString().toLowerCase().indexOf(keyword) !== -1 }).length >= 1) {
                  parentChildData.children = item.children.filter(child => { return child.name.toString().toLowerCase().indexOf(keyword) !== -1 });
                }
                filterData.push(parentChildData);
              }
            });
            this.dataSource.data = filterData;
            if (this.tree && this.tree.treeControl) {
              this.tree.treeControl.expandAll();
            }
            return this.fieldsList.filter(item => {
              return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
            }).length >= 1 || this.dataSource.data.length === 0 ? this.fieldsList.filter(item => {
              return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
            }) : [{ fieldDescri: 'No header data found', fieldId: null }];
          } else {
            this.dataSource.data = this.allGridAndHirarchyData;
            if (this.tree && this.tree.treeControl) {
              this.tree.treeControl.collapseAll();
            }
            return this.fieldsList;
          }
        }),
      )

    this.targetFilteredModules = this.form.controls.target_field.valueChanges.pipe(startWith(''), map(keyword => {
      if (keyword) {
        keyword = keyword.toLowerCase();

        return this.fieldsList.filter(item => {
          return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1 }).length >= 1
          ?
          this.fieldsList.filter(item => {
            return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
          })
          :
          [{ fieldDescri: 'No header data found', fieldId: null }];
      } else {
        return this.fieldsList;
      }
    }));
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
        categoryId: new FormControl(null),
        transformationRuleType: new FormControl(''),
        source_field: new FormControl(''),
        target_field: new FormControl(''),
        accuracyScore: new FormControl(0),
        sourceFieldSearchStr: new FormControl(''),
        apiSno: new FormControl('', [Validators.required])
      };

      this.currentControls = controls;
      this.form = new FormGroup(controls);

      // Apply conditional validation based on rule type
      this.form.controls.rule_type.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((selectedRule) => {
          this.applyValidatorsByRuleType(selectedRule);
          // call get the apis rule if the selected rule type is API
          if(selectedRule === BusinessRuleType.BR_API_RULE) {
            this.getApisRule('');
          }
        });
      this.form.controls.transformationRuleType.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((type) => {
          if (this.form.value.rule_type !== BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI) {
            this.applyValidatorsByRuleType(BusinessRuleType.BR_TRANSFORMATION);
          }
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
      this.form.controls.transformationRuleType.setValue($event);
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
      requiredKeys = [/* 'categoryId', */ 'rule_name', 'error_message'];
    }
    if (selectedRule === BusinessRuleType.BR_REGEX_RULE) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields', 'regex', 'standard_function'];
    }
    if (selectedRule === BusinessRuleType.BR_MANDATORY_FIELDS || selectedRule === BusinessRuleType.BR_METADATA_RULE || selectedRule === BusinessRuleType.MRO_CLS_MASTER_CHECK) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields'];
    }
    if (selectedRule === BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'source_field', 'accuracyScore', 'apiKey'];
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

    if (selectedRule === BusinessRuleType.BR_API_RULE) {
      requiredKeys = ['categoryId', 'rule_name', 'error_message', 'fields','apiSno'];
    }

    if(this.form?.get('rule_type').value === BusinessRuleType.BR_CUSTOM_SCRIPT && requiredKeys.indexOf('categoryId') > -1) {
      requiredKeys.splice(requiredKeys.indexOf('categoryId'), 1);
    }

    controlKeys.map((key) => {
      const index = requiredKeys.findIndex(reqKey => reqKey === key);
      if (index === -1) {
        this.form.controls[key].setValidators(null);
        this.form.controls[key].clearValidators();
        this.form.controls[key].updateValueAndValidity();
        if (key !== 'rule_type' && key !== 'weightage' && key !== 'accuracyScore' && key !== 'transformationRuleType') {
          this.form.controls[key].setValue(null);
          this.form.controls[key].updateValueAndValidity();
        }
      } else {
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
      apiSno: br.apiSno,
      sourceFld: '',
      targetFld: '',
      excludeScript: '',
      includeScript: '',
      udrTreeData: '',
      weightage: br.brWeightage,
      categoryId: br.categoryId,
      transformationRuleType: '',
      source_field: br.source_field || '',
      target_field: br.target_field || '',
      accuracyScore: br.accuracyScore || 0
    };
    // set the value for transformation ...
    this.hasAppliedTransformationCtrl.setValue(br.isTransformationApplied ? br.isTransformationApplied : false);

    let patchList = [];

    if (br.brType === BusinessRuleType.BR_METADATA_RULE || br.brType === BusinessRuleType.BR_MANDATORY_FIELDS || br.brType === BusinessRuleType.MRO_CLS_MASTER_CHECK) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId'];
    }
    if (br.brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
      patchList = ['rule_type', /* 'categoryId', */  'rule_name', 'weightage', 'error_message'];
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

    if(br.brType === BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId', 'apiKey', 'accuracyScore', 'source_field'];
    }

    if (br.brType === BusinessRuleType.BR_API_RULE) {
      patchList = ['rule_type', 'rule_name', 'error_message', 'weightage', 'categoryId','apiSno'];
    }

    if (patchList && patchList.length > 0) {
      patchList.map((key) => {
        if (dataToPatch[key]) {
          this.form.controls[key].setValue(dataToPatch[key]);
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
      blockDesc: new FormControl(udr ? udr.blockDesc : 'And', [Validators.required]),
      blockType: new FormControl(udr ? udr.blockType : BlockType.COND, [Validators.required]),
      conditionFieldEndValue: new FormControl(udr ? udr.conditionFieldEndValue : ''),
      conditionFieldId: new FormControl(udr ? udr.conditionFieldId : '', [Validators.required]),
      conditionFieldStartValue: new FormControl(udr ? udr.conditionFieldStartValue : ''),
      conditionFieldValue: new FormControl(udr ? udr.conditionFieldValue : ''),
      conditionOperator: new FormControl(udr ? udr.conditionOperator : '', [Validators.required]),
      conditionValueFieldId: new FormControl(udr ? udr.conditionValueFieldId : '', [Validators.required]),
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
        this.targetFilteredModules = of(this.fieldsList);
        this.filteredModules = of(this.fieldsList);
        this.initGridAndHierarchyToAutocompleteDropdown(metadataModeleResponse);
        this.initiateAutocomplete();
        if (this.brId && this.coreSchemaBrInfo) {
          try {
            const fldIds = this.coreSchemaBrInfo.fields ? this.coreSchemaBrInfo.fields.split(',') : [];
            const targetFlds = this.coreSchemaBrInfo.target_field ? this.coreSchemaBrInfo.target_field.split(',') : [];
            this.selectedFields = [];
            this.selectedTargetFields = [];
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
            targetFlds.forEach(fld => {
              const fldCtrl = this.fieldsList.find(fil => fil.fieldId === fld);
              if (fldCtrl) {
                this.selectedTargetFields.push({ fieldDescri: fldCtrl.fieldDescri, fieldId: fld });
              }
            });

            if (this.coreSchemaBrInfo.source_field) {
              const fld = this.sourceFieldsObject.list.find(fil => fil.fieldId === this.coreSchemaBrInfo.source_field);
              if (fld) {
                this.form.controls.sourceFieldSearchStr.setValue(fld.fieldId);
              }
            }
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
   * func to select target field
   * @param event selected target field
   */
  selectTargetField(event) {
    if (!!event.option.value) {
      const alreadyExists = this.selectedTargetFields.find(item => item.fieldId === event.option.value);
      if (alreadyExists) {
        this.transientService.open(`This field is already selected`, `Close`, { duration: 2000 });
      } else {
        this.selectedTargetFields.push({
          fieldDescri: event.option.viewValue,
          fieldId: event.option.value
        });
      }
      this.form.get('target_field').patchValue('');
      const txtfield = document.getElementById('targetFieldsInput') as HTMLInputElement;
      if (txtfield) {
        txtfield.value = '';
      }
      if (this.targetFieldsInput) {
        this.targetFieldsInput.nativeElement.blur();
      }
    }
  }

  /**
   * fn to remove selected target fields
   * @param i index of the field to be removed
   */
  removeTargetField(i) {
    this.selectedTargetFields.splice(i, 1);
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
    if(this.isOnlyForTrans) {
      this.router.navigate([{ outlets: { [`${this.activeOutlet}`]: null } }]);
    } else {
      this.router.navigate([{ outlets: { [`${this.activeOutlet}`]: null } }], {queryParamsHandling: 'preserve'});
    }

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
      this.form.controls.categoryId.setValidators(categoryValidators);
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
   * function to fetch field description from field field id
   * @param value field object
   * @returns field description
   */
  displaySourceFieldFn(value?: string) {
    return value ? this.sourceFieldsObject.list.find(field => field[this.sourceFieldsObject.valueKey] === value)?.[this.sourceFieldsObject.labelKey] : '';
  }

  /**
   * function to save the form data
   */
  save() {
    this.submitted = true;
    this.form.controls.fields.setValue(this.selectedFields.map(item => item.fieldId).join(','));
    this.form.controls.target_field.setValue(this.selectedTargetFields.map(item => item.fieldId).join(','));
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

    let brType: string = this.form.value ? this.form.value.rule_type : '';
    brType = brType ? brType : this.coreSchemaBrInfo.brType;

    if(this.isOnlyForTrans) {
      brType = BusinessRuleType.BR_TRANSFORMATION;
    }

    if(brType === BusinessRuleType.BR_API_RULE) {
      const hasInDrop = this.apiRules.find(a=> a.sno === this.form.get('apiSno').value);
      if(!hasInDrop) {
        this.form.controls.apiSno.markAsDirty();
        this.form.controls.apiSno.markAsTouched();
        this.form.controls.apiSno.setValue('');
        // this.form.controls.apiSno;
        return false;
      }
    }

    if (!this.form.valid) {
      console.log(this.form.controls);

      this.form.markAllAsTouched();
      this.showValidationError('Please fill the required fields.');
      if (brType!=='BR_CUSTOM_SCRIPT') {
        return;
      }
    }

    if (this.isMPNI && !this.selectedTargetFields.length) {
      return;
    }

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
        categoryId: this.form.value.categoryId,
        isCopied: false,
        copiedFrom: '',
        dependantStatus: this.coreSchemaBrInfo.dependantStatus || RuleDependentOn.ALL,
        order: this.coreSchemaBrInfo.order || 0,
        status: this.coreSchemaBrInfo.status || '1'
      } as CoreSchemaBrInfo;

      const blocks: UDRBlocksModel[] = [];
      const frm = this.udrNodeArray();
      for (let i = 0; i < frm.length; i++) {
        const row = frm.at(i) as FormGroup;
        const value =row.value as UDRBlocksModel;
        blocks.push(value);
        if (!value.blockType) {
          row.controls.blockType.markAsTouched();
        }
        if (!value.conditionOperator) {
          row.controls.conditionOperator?.markAsTouched();
        }
        if (!value.conditionFieldId) {
          row.controls.conditionFieldId?.markAsTouched();
        }
        (row.controls.childs as any).controls.forEach((childRow) => {
          childRow.markAllAsTouched();
        });
      }

      if (!(blocks.length && blocks.every(x => x.blockType && x.blockType !== BlockType.COND && x.blockDesc && x.conditionOperator && x.conditionFieldId && x.childs.every(y => y.blockDesc && y.conditionOperator && y.conditionFieldId)))) {
        this.showValidationError('Please select the condition(s) between the rules.');
        return;
      }
      if (!this.form.valid) {
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

      // attach the transformation for this rule
      udrDto.brInfo.isTransformationApplied = this.hasAppliedTransformationCtrl?.value ? this.hasAppliedTransformationCtrl.value : false;
      const sendMappings:TransformationRuleMapped[] = [];
      if(this.attachedTransRules) {
        // add for success
        this.attachedTransRules.success.forEach(s=>{
          sendMappings.push({order: sendMappings.length, isEnabled: s.isEnabled ? s.isEnabled : false, isConfigured: s.isConfigured, status:'SUCCESS', transformationRule: s.ruleInfo?.brIdStr});
        });
        // add for error
        this.attachedTransRules.error.forEach(s=>{
          sendMappings.push({order: sendMappings.length, isEnabled: s.isEnabled ? s.isEnabled : false, isConfigured: s.isConfigured, status:'ERROR', transformationRule: s.ruleInfo?.brIdStr});
        });
      }
      udrDto.brInfo.transformationMappingDTO = sendMappings;

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

      if(this.isOnlyForTrans) {
        brObject.dontMapped = true;
      }
      this.schemaService.createBusinessRule(brObject).subscribe(res => {
        if(this.isOnlyForTrans) {
          this.sharedService.settransSavedBehaviourSub(true);
          this.applyValidatorsByRuleType(this.form.controls.rule_type.value);
        }
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
      request.apiSno = this.form.value.apiSno;
      request.regex = this.form.value.regex;
      request.standardFunction = this.form.value.standard_function;
      request.schemaId = this.schemaId;
      request.moduleId = this.moduleId;
      request.brWeightage = this.form.value.weightage;
      request.categoryId =  this.form.value.categoryId || this.coreSchemaBrInfo.categoryId;
      request.isCopied = false;
      request.copiedFrom = '';
      request.dependantStatus = this.coreSchemaBrInfo.dependantStatus || RuleDependentOn.ALL;
      request.order = this.coreSchemaBrInfo.order || 0;
      request.status = this.coreSchemaBrInfo.status || '1';
      request.source_field = this.form.value.source_field || '';
      request.target_field = this.form.value.target_field || '';
      request.accuracyScore= this.form.value.accuracyScore || 0;

      // attach the transformation for this rule
      request.isTransformationApplied = this.hasAppliedTransformationCtrl?.value ? this.hasAppliedTransformationCtrl.value : false;
      const sendMappings:TransformationRuleMapped[] = [];
      if(this.attachedTransRules) {
        // add for success
        this.attachedTransRules.success.forEach(s=>{
          sendMappings.push({order: sendMappings.length, isEnabled: s.isEnabled ? s.isEnabled : false, isConfigured: s.isConfigured, status:'SUCCESS', transformationRule: s.ruleInfo?.brIdStr});
        });
        // add for error
        this.attachedTransRules.error.forEach(s=>{
          sendMappings.push({order: sendMappings.length, isEnabled: s.isEnabled ? s.isEnabled : false, isConfigured: s.isConfigured, status:'ERROR', transformationRule: s.ruleInfo?.brIdStr});
        });
      }
      request.transformationMappingDTO = sendMappings;

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
  setComparisonValue(value: string | { start: string; end: string; }, index: number) {
    console.log('Comparision value for parent', value, index);
    const array = this.udrNodeArray().at(index);
    if (typeof value === 'object') {
      array.get('conditionFieldStartValue').setValue(value.start);
      array.get('conditionFieldEndValue').setValue(value.end);
    } else {
      array.get('conditionFieldValue').setValue(value);
    }
  }

  /**
   * method to set the comparison value for child
   * @param value pass the value
   * @param chldNode pass the child node
   * @param parentNode pass the parent node
   */
  setComparisonValueForChild(value: string | { start: string; end: string; }, chldNode: number, parentNode: number) {
    console.log('Comparision value for child', value, chldNode, parentNode);
    const childArray = this.getChildAsControl(parentNode).at(chldNode);
    if (typeof value === 'object') {
      childArray.get('conditionFieldStartValue').setValue(value.start);
      childArray.get('conditionFieldEndValue').setValue(value.end);
    } else {
      childArray.get('conditionFieldValue').setValue(value);
    }
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
   * Get all categories from the api
   */
  getCategories() {
    this.schemaDetailsService.getAllCategoryInfo().subscribe((response: CategoryInfo[]) => {
      if (response && response.length > 0) {
        this.categoryList = response;
        if(this.form) {
          this.form.controls.categoryId.setValue(this.form.value.categoryId);
        }
      }
    })
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
  udrFieldSelectionChange(field: Metadata[], controlIndex: number, childElementCtrl?: number) {
    if (childElementCtrl !== undefined) {
      this.getChildAsControl(controlIndex).at(childElementCtrl).get('conditionFieldId').setValue(field[0] ? field[0].fieldId : '');
    } else {
      this.udrNodeArray().at(controlIndex).get('conditionFieldId').setValue(field[0] ? field[0].fieldId : '');
    }
    console.log(this.udrNodeArray());
  }

  /**
   * Open the side sheet for transformation rule library...
   */
  openTransRuleLib() {
    this.router.navigate(['', { outlets: {sb:`sb/schema/business-rule/${this.moduleId}/${this.schemaId}/${this.brId}`,
    outer: `outer/schema/businessrule-library/${this.moduleId}/${this.schemaId}/outer` }}],{queryParams:{t:true,s:this.transTabIndex === 0 ? 'success' : 'error'}});
  }

  /**
   * Get the transformation rules per rule id ...
   */
  getMappedTransformationRules() {
    this.schemaService.getMappedTransformationRules(this.brId, this.schemaId, 0, 100, '').subscribe(res=>{
      this.attachedTransRules = res;
    }, error=> console.error(`Exception : ${error.message}`));
  }

  /**
   * Update the business rule status based on configuration !!!
   * @param br update able busiess rule
   * @param tab either success || error
   * @param status checkbox status ....
   */
  updateTransStatus(br: TransformationMappingTabResponse,tab: string, status: boolean) {
    if(!this.attachedTransRules) { return; }

    if(tab === 'success') {
      const idx = this.attachedTransRules.success.findIndex(f=> f.ruleInfo.brIdStr === br.ruleInfo.brIdStr);
      this.attachedTransRules.success[idx].isEnabled = status;
    } else {
      const idx = this.attachedTransRules.error.findIndex(f=> f.ruleInfo.brIdStr === br.ruleInfo.brIdStr);
      this.attachedTransRules.error[idx].isEnabled = status;
    }
  }

  /**
   * Remove the trans rule from main rule ....
   * @param br removeable business rule
   * @param tab status eaither succes || error
   */
  removeTrans(br: TransformationMappingTabResponse, tab: string) {
    this.globalService.confirm({label:'Are you sure to delete ?'}, (s)=>{
      if(s === 'yes') {
        if(tab === 'success') {
          const idx = this.attachedTransRules.success.findIndex(f=> f.ruleInfo.brIdStr === br.ruleInfo.brIdStr);
          this.attachedTransRules.success.splice(idx,1);
        } else {
          const idx = this.attachedTransRules.error.findIndex(f=> f.ruleInfo.brIdStr === br.ruleInfo.brIdStr);
          this.attachedTransRules.error.splice(idx,1);
        }
      }
    });

  }

  /**
   * Create new business rules ...
   */
  openBusinessRuleSideSheet() {
    console.log(this.activatedRouter.url);
    /* this.router.navigate([`sb3:sb3/schema/business-rule/${this.moduleId}/${this.schemaId}/new/sb3`],
    {queryParams:{r:'BR_TRANSFORMATION'}, relativeTo: this.activatedRouter}); */
    /* this.router.navigateByUrl(`../(sb3:sb3/schema/business-rule/${this.moduleId}/${this.schemaId}/new/sb3)`,
    {queryParams:{r:'BR_TRANSFORMATION'}, relativeTo: this.activatedRouter}); */
    this.router.navigate(['', { outlets: { sb3:  `sb3/schema/business-rule/${this.moduleId}/${this.schemaId}/new/sb3`}}],
    {queryParams:{r:'BR_TRANSFORMATION'}});
  }

  /**
   * Get the all trans rule from lib...
   */
  getTransRules(searchStr?: string) {
    this.schemaService.transformationRules(this.moduleId, 0, 100,searchStr ? searchStr : '').subscribe(rules=>{
      this.transformationRules = rules;
    },err=> console.error(`Execption : ${err.message}`));
  }

  /**
   * Add the business rule inside the tabs ...
   * @param rule adable rule ....
   * @param tab add rule based on this tab ... status
   */
  addTransRule(rule: CoreSchemaBrInfo, tab: string) {
    if(tab === 'success') {
      const idx = this.attachedTransRules.success.findIndex(f=> f.ruleInfo?.brIdStr === rule.brIdStr);
      if(idx === -1) {
        this.attachedTransRules.success.push({isConfigured:false,isEnabled:false,ruleInfo:rule});
      } else {
        this.transientService.open('Rule already added ','ok',{duration:2000});
      }
    } else {
      const idx = this.attachedTransRules.error.findIndex(f=> f.ruleInfo?.brIdStr === rule.brIdStr);
      if(idx === -1) {
        this.attachedTransRules.error.push({isConfigured:false,isEnabled:false,ruleInfo:rule});
      } else {
        this.transientService.open('Rule already added ','ok',{duration:2000});
      }
    }

  }

  /**
   * Reorder the rule ...
   * @param event br that going to be reordered
   * @param tab based on this will append over there...
   */
  reorderTrans(event: CdkDragDrop<CoreSchemaBrInfo>, tab: string) {
    if(tab === 'success') {
      moveItemInArray(this.attachedTransRules.success, event.previousIndex, event.currentIndex);
    } else {
      moveItemInArray(this.attachedTransRules.error, event.previousIndex, event.currentIndex);
    }

  }

  /**
   * Search the transformation rule ...
   * @param searchStr search the rule based on this params
   */
  searchTransRules(searchStr: string) {
    this.delayedCallWithTransLib(searchStr);
  }

  /**
   * Edit the exiting transformation....
   */
  editTransRule(br: TransformationMappingTabResponse, tab: string) {
    this.router.navigate(['', { outlets: { sb3: `sb3/schema/business-rule/${this.moduleId}/${this.schemaId}/${br.ruleInfo?.brIdStr}/sb3` }}],
    {queryParams:{r:'BR_TRANSFORMATION'}});
  }

  /**
   * Add the trans rules from library ...
   * @param res from side sheet
   */
  addTransRules(res: CoreSchemaBrInfo[]) {
    res = Array.isArray(res) ? res : [res];
    if(!this.attachedTransRules) { return; };

    if(this.transTabIndex === 0) {
      res.forEach(r=>{
        const isExits = this.attachedTransRules.success.some(s=> s.ruleInfo?.brIdStr === r.brIdStr);
        if(!isExits) {
          this.attachedTransRules.success.push({
            isConfigured:false,
            isEnabled: false,
            ruleInfo: r
          });
        }
      });
    } else {
      res.forEach(r=>{
        const isExits = this.attachedTransRules.error.some(s=> s.ruleInfo?.brIdStr === r.brIdStr);
        if(!isExits) {
          this.attachedTransRules.error.push({
            isConfigured:false,
            isEnabled: false,
            ruleInfo: r
          });
        }
      });
    }
  }


  /**
   * Search the rules based on searchStrig and moduleId
   * @param searchString search the rules by text ....
   */
  getApisRule(searchString: string,prefer?: string) {
    this.schemaService.getApisRule(this.moduleId, searchString, 0, 10, prefer).subscribe(res=>{
      this.apiRules = res ? res: [];
      if(prefer) {
        this.form.controls.apiSno.patchValue(this.coreSchemaBrInfo.apiSno);
      }
    }, err=> console.error(`Error : ${err.message}`));
  }

  /**
   * function to display rule desc in mat auto complete
   */
   displayApisRuleFn(value?: string) {
    return value ? this.apiRules.find(rule => rule.sno === value)?.description : '';
  }

  searchApisRules(val: string) {
    this.delayedCallForApis(val);
  }

}