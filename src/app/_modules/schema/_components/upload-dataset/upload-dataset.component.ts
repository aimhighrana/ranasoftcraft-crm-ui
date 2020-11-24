import { Component, OnInit, ViewChild, Inject, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ObjectTypeResponse, ObjectType, DataSource, UploadError, AddFilterOutput, SubscriberFields } from '@models/schema/schema';
import { MetadataModeleResponse, MetadataModel } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';
import { NewBusinessRulesComponent } from '../new-business-rules/new-business-rules.component';
import { GlobaldialogService } from '@services/globaldialog.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { distinctUntilChanged } from 'rxjs/operators';
import { NewSchemaCollaboratorsComponent } from '../new-schema-collaborators/new-schema-collaborators.component';
import { values, pick } from 'lodash';
import { Utilities } from '@modules/base/common/utilities';
import { BusinessrulelibraryDialogComponent } from '../businessrulelibrary-dialog/businessrulelibrary-dialog.component';
import { PermissionOn, UserMdoModel } from '@models/collaborator';
import { ScheduleDialogComponent } from '@modules/shared/_components/schedule-dialog/schedule-dialog.component';
import { SchemaScheduler } from '@models/schema/schemaScheduler';
import { GLOBALCONSTANTS } from '../../../../_constants';

type UploadedDataType = any[][];

@Component({
  selector: 'pros-upload-dataset',
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.scss']
})
export class UploadDatasetComponent implements OnInit, AfterViewInit {
  @ViewChild(MatStepper) stepper!: MatStepper;
  dataTableCtrl: FormGroup;
  selectedMdoFldCtrl: FormControl;
  displayedColumns = ['excel', 'excelfrstrowdata', 'mapping', 'field'];
  dataSource: DataSource[] = [];
  filteredModules: Observable<ObjectTypeResponse[]>;
  moduleInpFrmCtrl: FormControl;
  excelHeader: string[];
  metadataFields: MetadataModeleResponse;
  metaDataFieldList: MetadataModel[] = [];
  headerFieldsList: MetadataModel[] = [];
  uploadedData: UploadedDataType;
  excelMdoFieldMappedData: DataSource[] = [];
  triggerValue = false;
  uploadedFile: File;
  uploadDisabled = true;
  uploadError: UploadError = {
    status: false,
    message: ''
  };
  plantCode: string;
  fieldsBySubscriber: SubscriberFields[] = [];
  loaded = false;
  uploadLoader = false;
  objectTypes: Array<ObjectType> = [];
  editableFieldIds: string[] = [];
  currentSchedule: SchemaScheduler = null;
  /**
   * Fetch count for subscribers
   */
  fetchCount = 0;

  /**
   * progress bar value setting variable
   */
  progressBar = 0;
  /**
   * array of headers
   */
  headerText = [
    'Upload data',
    'Select module',
    'Name your dataset',
    'Select business rule',
    'Add subscribers',
    'Run the schema'
  ];

  /**
   * to identify existing BR
   * and differentiate from newly created ones
   */
  existingBRIds: string[] = [];

  /**
   * index of active header
   */
  headerTextIndex = 1;

  /**
   * Modules list to pre-populate
   */
  modulesList = [];

  /**
   * copy of modules list
   */
  modulesListCopy = [];

  /**
   * List of all selected business rules
   */
  selectedBusinessRules = [];

  /**
   * List of all selected business rules
   */
  businessRulesList = [];

  /**
   * This is used to store user details
   */
  userDetails: Userdetails;

  /**
   * form to send to server
   */
  requestForm: FormGroup;

  /**
   * form to make changes to header
   */
  headerForm: FormGroup;

  currentRuleId: string;

  /**
   * subscribers list
   */
  subscribersList = [];

  /**
   * subscribers list
   */
  allSubscribers = [];

  /**
   * object to store the core_schema object
   */
  coreSchemaObject = {
    discription: '',
    tenantId: '',
    schemaLimit: 1,
    owner: '',
    status: '',
    category: '',
  }

  reInilize = false;

  /**
   * Serial no of file uploaded
   */
  fileSno: string;

  /**
   * common structure to create fields object for
   * request structure
   */
  fieldsObject = {
    fieldDescri: '',
    fieldId: '',
    dataType: 'CHAR',
    maxChar: '200',
    mandatory: '0',
    parentField: null,
    tableName: null,
    isCheckList: 'false',
    isComBased: '0'
  }

  dialogSubscriber = new Subscription();
  inputModel = new FormControl();
  subscriberFilterFields = [];
  activeChipValue = {};
  @ViewChild('clickToEdit') clickToEdit: ElementRef;
  @HostListener('document:click', ['$event'])
  public onClick(event) {
    const fieldId = event.target.id;
    if (!fieldId || this.editableFieldIds.indexOf(fieldId) === -1) {
      this.editableFieldIds = [];
    }
  }

  /**
   * Constructor of class
   * @param _formBuilder form builder object
   * @param schemaService schema service object
   * @param schemaDetailsService  service details service object
   * @param snackBar snackbar object
   * @param userService user service
   * @param dialogRef dailog ref object
   * @param moduleInfo the current selected module
   */
  constructor(
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    public dialogRef: MatDialogRef<UploadDatasetComponent>,
    private globaldialogService: GlobaldialogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilties: Utilities
  ) {
    this.setProgressValue();
    this.moduleInpFrmCtrl = new FormControl();
    this.selectedMdoFldCtrl = new FormControl();
  }

  setProgressValue(index: number = 0) {
    if (index > 0) {
      this.progressBar = index * (100 / this.headerText.length);
    } else {
      this.progressBar = 100 / this.headerText.length;
    }

  }

  getObjectTypes() {
    this.schemaService.getAllObjectType().subscribe((modules: []) => {
      if (modules && modules.length > 0) {
        this.modulesList.push(...modules);
        this.modulesListCopy.push(...modules);
      }
    });
  }

  /**
   * Angular hook
   */
  ngOnInit(): void {
    this.createForm();
    this.getObjectTypes();

    // get logged in user details
    this.userService.getUserDetails().subscribe((userdetails: Userdetails) => {
      this.userDetails = userdetails;
      this.requestForm.controls.userId.setValue(this.userDetails.userName);
      this.requestForm.controls.plantCode.setValue(this.userDetails.plantCode);
    });

    if (this.data.objectid && this.data.objectdesc) {
      this.requestForm.get('objectId').setValue(this.data.objectid);
      this.requestForm.get('objectDesc').setValue(this.data.objectdesc);
      this.requestForm.get('objectfullDesc').setValue(this.data.objectdesc);
    }
    this.requestForm.get('dataScope').setValue('Entire Dataset');
    this.requestForm.get('threshold').setValue(100);

    this.getBusinessRulesList();
    this.getCollaborators('', this.fetchCount);
  }

  setObjectDescription(moduleName) {
    this.requestForm.controls.objectDesc.setValue(moduleName);
    this.requestForm.controls.objectfullDesc.setValue(moduleName);
    this.requestForm.controls.objectDesc.markAsDirty();
  }

  /**
   * Function to build form
   */
  createForm() {
    this.requestForm = new FormGroup({
      file: new FormControl(),
      fileSerialNo: new FormControl(''),
      objectId: new FormControl(),
      objectDesc: new FormControl('', [Validators.required, Validators.minLength(1)]),
      objectfullDesc: new FormControl(''),
      lang: new FormControl('en'),
      parentObject: new FormControl({}),
      importFrom: new FormControl(''),
      salesFourceModule: new FormControl(''),
      createType: new FormControl(''),
      permissionAcive: new FormControl(''),
      plantCode: new FormControl(''),
      userId: new FormControl(''),
      fields: new FormControl([]),
      core_schema: new FormControl({
        discription: '',
        tenantId: '',
        schemaLimit: '1',
        owner: 'Role',
        status: '1',
        category: '2'
      }),
      coreSchemaBr: new FormControl([]),
      mappedData: new FormControl([]),
      subcribers: new FormControl([]),
      runTime: new FormControl(true),
      dataScope: new FormControl(),
      threshold: new FormControl(100)
    });
  }

  /**
   * Angular hook
   */
  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((change) => {
      this.headerTextIndex = change.selectedIndex + 1;
      this.setProgressValue(this.headerTextIndex);
    });
  }

  /**
   * function to open explorer to select file to upload
   */
  openExplorer() {
    document.getElementById('uploader').click();
  }

  /**
   * Function to get the excel file and get fields and data
   * @param evt file uploaded event
   */
  fileChange(evt: Event) {
    if (evt !== undefined) {
      this.uploadError.status = false;
      this.uploadError.message = '';
      const target: DataTransfer = (evt.target) as unknown as DataTransfer;
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      // check file type
      let type = '';
      try {
        type = target.files[0].name.split('.')[1];
      } catch (ex) {
        console.error(ex);
      }
      if (type === 'xlsx' || type === 'xls' || type === 'csv') {
        // check size of file
        const size = target.files.item(0).size;
        const sizeKb = Math.round((size / 1024));
        if (sizeKb > (10 * 1024)) {
          this.uploadedFile = null;

          this.snackBar.open(`File size too large , upload less then 10 MB`, 'Close', { duration: 5000 });
          return false;
        }
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          /* save data */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.uploadedData = (data as UploadedDataType);
          this.excelHeader = this.uploadedData[0] as string[];
          const file = target.files[0];
          this.uploadedFile = file;

          const dataS: DataSource[] = [];
          for (let i = 0; i < this.uploadedData[0].length; i++) {
            const datS: DataSource = {
              excelFld: this.uploadedData[0][i],
              excelFrstRow: this.uploadedData[1][i],
              mdoFldId: this.utilties.getRandomString(8),
              mdoFldDesc: '',
              columnIndex: i
            };
            dataS.push(datS);
          }
          // initialize excel header form here
          this.initHeaderForm(dataS).then(() => {
            this.dataSource = dataS;
            if (this.uploadedData) {
              this.schemaService.setExcelValues({ uploadedData: this.uploadedData, headerData: this.dataSource });
            }
          })
            .catch((err) => {
              console.log(err);
            });
        };

        reader.readAsBinaryString(target.files[0]);
        this.excelMdoFieldMappedData = [];
        this.requestForm.get('file').setValue(target.files[0]);
        this.uploadFileData();
      } else {
        this.uploadedFile = null;
        this.snackBar.open(`Only allow .xlsx, .xls and .csv file format`, 'Close', { duration: 5000 });
      }
    }
  }

  /**
   * Initialize header form dynamically with
   * received data from the excel file
   */
  initHeaderForm(dataSource: DataSource[]) {
    return new Promise((resolve, reject) => {
      try {
        const formBody = {};
        dataSource.map((data) => {
          formBody[data.mdoFldId] = new FormControl(data.excelFld, [Validators.required]);
        });
        this.headerForm = new FormGroup(formBody);
        this.headerForm.valueChanges.subscribe((value) => {
          this.excelHeader = values(value);
        });
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * function to create fields from excel
   * file and create structure to send
   * to server
   */
  createfieldObjectForRequest(dataSource: DataSource[], formData = this.headerForm.value) {
    return new Promise((resolve, reject) => {
      const fieldValues = [];
      try {
        if (dataSource && dataSource.length > 0) {
          dataSource.forEach((dataS) => {
            fieldValues.push({
              fieldDescri: formData[dataS.mdoFldId],
              fieldId: dataS.mdoFldId,
              dataType: 'CHAR',
              maxChar: '200',
              mandatory: '0',
              parentField: null,
              tableName: null,
              isCheckList: 'false',
              isComBased: '0'
            });
          });
        }
        resolve(fieldValues)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * function to set the header text dynamically
   */
  get toolbarHeaderText() {
    return this.headerText[this.headerTextIndex - 1];
  }

  /**
   * Close dialog after saved or click close
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * check validation for each step here
   */
  validateStep() {
    if (!this.headerForm.valid || !this.requestForm.valid) {
      return false;
    }
    if (this.stepper.selectedIndex === 3) {
      const schema = this.requestForm.get('core_schema').value;
      if (!schema || !schema.discription) {
        return false;
      }
    }
    if (this.stepper.selectedIndex === 3) {
      if (this.selectedBusinessRules && this.selectedBusinessRules.length === 0) {
        this.snackBar.open('Please add a Business Rule to continue', 'Okay', { duration: 5000 });
        return false;
      }
    }
    if (this.stepper.selectedIndex === 4) {
      if (this.subscribersList && this.subscribersList.length === 0) {
        this.snackBar.open('Please add a Subscriber to continue', 'Okay', { duration: 5000 });
        return false;
      }
    }

    return true;
  }

  /**
   * stepping function
   * @param where value to move to next or previous
   * @param validateForm whether to validate the data entered (optional)
   */
  step(where: string, validateForm?: boolean) {
    if (validateForm && !this.validateStep()) {
      return;
    }
    if (where === 'next') {
      if (this.progressBar === 100) {
        return;
      }
      const currentStepIndex = this.stepper.selectedIndex;
      if (currentStepIndex === 2) {
        // there should be atleast one mapping
        const anyMapping = this.requestForm.controls.mappedData.value.length;
        const isNewSchema = this.requestForm.controls.objectId.value;

        if (anyMapping === 0 && isNewSchema) {
          this.snackBar.open('Please select atleast one mapping', 'Okay', { duration: 5000 });
          return;
        }
      }

      if (currentStepIndex === 3) {
        // there should be atleast one Business rule
        const anyBR = this.requestForm.controls.coreSchemaBr.value;
        if (anyBR.length === 0) {
          this.snackBar.open('Please create atleast one business rule', 'Okay', { duration: 5000 });
          return;
        }
      }
    }

    if (this.headerTextIndex === 0) {
      const element = document.getElementById('uploader');
      if (element) {
        // document.getElementById('uploader').setAttribute('value', '');
      }
    }
    this.stepper[where]();
  }

  /**
   * Function to open global dialog
   * @param componentName name of the component that needs to be opened
   */
  openGlobalDialog(componentName = 'createBR') {
    if (componentName === 'createBR') {
      this.globaldialogService.openDialog(NewBusinessRulesComponent, {
        moduleId: this.requestForm.value.objectId,
        fields: this.requestForm.controls.fields.value
      });

      this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
        .pipe(
          distinctUntilChanged()
        )
        .subscribe((response) => {
          this.updateCurrentRulesList(response);
          this.dialogSubscriber.unsubscribe();
        })
    }
    if (componentName === 'existingBR') {
      this.globaldialogService.openDialog(BusinessrulelibraryDialogComponent, {
        selectedRules: this.selectedBusinessRules,
      });
      this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
        .pipe(distinctUntilChanged())
        .subscribe((response: CoreSchemaBrInfo[]) => {
          if (response && response.length > 0) {
            this.selectBusinessRule(response);
          }
          this.dialogSubscriber.unsubscribe();
        })
    }
  }

  /**
   * Function to add/updated rules to business rules list
   * @param response response from the newly created rule dialog
   * or from the existing rules selection
   */
  updateCurrentRulesList(response) {
    let brObject: CoreSchemaBrInfo;
    const tempId = (response.tempId) ? response.tempId : null;
    const formData = (response.formData) ? response.formData : null;
    if (formData) {
      if (formData.rule_type === 'BR_CUSTOM_SCRIPT') {
        brObject = this.createBrObject(formData, formData.udrTreeData);
      } else {
        brObject = this.createBrObject(formData);
      }
      if (this.requestForm.controls.coreSchemaBr.value.length > 0) {
        this.requestForm.controls.coreSchemaBr.setValue(
          this.requestForm.controls.coreSchemaBr.value.map((val) => {
            if (val.tempId === tempId) {
              return brObject;
            } else {
              return val;
            }
          }));
      } else {
        this.requestForm.controls.coreSchemaBr.value.push(brObject);
      }
      brObject.status = '1';
      if (this.selectedBusinessRules.length > 0) {
        const index = this.selectedBusinessRules.findIndex(rule => rule.tempId === tempId);
        if (index > -1) {
          this.selectedBusinessRules[index] = brObject;
        }
      } else {
        this.selectedBusinessRules.push(brObject);
      }
    }
  }


  /**
   * Function to track rule Ids, later used to identify newly created
   * or existing rules. "Configure" option is shown based on this
   * @param ruleId rule id
   */
  addRuleIdToExisting(ruleId: string) {
    return new Promise((resolve) => {
      this.existingBRIds.push(ruleId);
      resolve();
    })
  }

  /**
   * Function to check if a rule is newly added
   * @param ruleId rule id
   */
  isExistingRule(ruleId: string) {
    return this.existingBRIds.indexOf(ruleId) > -1;
  }

  /**
   * Function to open business rule dialog for further configuration
   * @param rule the selected rule which is to be configured
   */
  configureRule(rule: CoreSchemaBrInfo) {
    console.log(rule);

    this.createfieldObjectForRequest(this.dataSource).then((finalValues) => {
      this.requestForm.controls.fields.setValue(finalValues);
      const {
        tempId,
        brType,
        brInfo,
        message,
        regex,
        udrDto,
        brWeightage,
        standardFunction,
        categoryId,
        fields } = rule;
      this.globaldialogService.openDialog(NewBusinessRulesComponent, {
        moduleId: '',
        fields: this.requestForm.controls.fields.value,
        tempId,
        createRuleFormValues: {
          rule_type: brType,
          rule_name: brInfo,
          error_message: message,
          standard_function: standardFunction,
          regex,
          fields,
          udrTreeData: udrDto,
          weightage: brWeightage,
          categoryId,
        }
      });
    });

    this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
      .pipe(distinctUntilChanged())
      .subscribe((response: any) => {
        if (response && response.formData) {
          this.updateCurrentRulesList(response);
        }
        this.dialogSubscriber.unsubscribe();
      });
  }

  /**
   * Function to toggle business rule status value
   * @param event value for status, checked or unchecked
   * @param Br Business rule
   */
  toggleBrStatus(event, Br) {
    this.requestForm.controls.coreSchemaBr.value.map((br) => {
      if (br.fields === Br.fields) {
        br.status = event.checked ? '1' : '0';
      }
    });
  }

  /**
   * function to update the current schedule
   * @param schedule selected schedule
   */
  updateCurrentSchedule(schedule) {
    console.log('schedule', schedule);
  }

  /**
   * function to create br
   * @param object newly created Br
   */
  createBrObject(object, udrTreeData = { udrHierarchies: [], blocks: [] }): CoreSchemaBrInfo {
    return {
      tempId: this.utilties.getRandomString(8),
      sno: 0,
      brId: '',
      brType: object.rule_type,
      refId: 0,
      fields: object.fields,
      regex: object.regex,
      order: 1,
      message: object.error_message,
      script: '',
      brInfo: udrTreeData.blocks.length ? 'User Defined' : object.rule_name,
      brExpose: 0,
      status: '1',
      categoryId: object.categoryId,
      standardFunction: object.standard_function,
      brWeightage: object.weightage,
      totalWeightage: 100,
      transformation: 0,
      tableName: '',
      qryScript: '',
      dependantStatus: 'ALL',
      plantCode: '0',
      percentage: 0,
      schemaId: '',
      brIdStr: '',
      udrDto: {
        udrHierarchies: udrTreeData.udrHierarchies,
        blocks: udrTreeData.blocks
      }
    } as CoreSchemaBrInfo;
  }

  /**
   * Function to reoder the BR
   * @param event the dropped element
   */
  reoderBR(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedBusinessRules, event.previousIndex, event.currentIndex);
    this.selectedBusinessRules[event.currentIndex].order = event.currentIndex + 1;
  }

  /**
   * function to set module data and navigate
   * @param selectedModule selected module data
   */
  setModuleValueAndTakeStep(selectedModule?) {
    if (selectedModule) {
      this.requestForm.controls.objectDesc.setValue(selectedModule.objectdesc);
      this.requestForm.controls.objectfullDesc.setValue(selectedModule.objectdesc);
      this.requestForm.controls.objectId.setValue(selectedModule.objectid);
      this.getModulesMetaHeaders();
    } else {
      this.requestForm.controls.objectDesc.setValue('');
      this.requestForm.controls.objectfullDesc.setValue('');
      this.requestForm.controls.objectId.setValue('');
      this.createfieldObjectForRequest(this.dataSource).then((finalValues) => {
        this.requestForm.controls.fields.setValue(finalValues);
      });
    }
    this.step('next');
  }

  /**
   * get all metadata headers
   */
  getModulesMetaHeaders() {
    this.schemaDetailsService.getMetadataFields(this.requestForm.controls.objectId.value)
      .subscribe((res: MetadataModeleResponse) => {
        if (res && res.headers) {
          this.headerFieldsList.push({
            fieldId: 'objectnumber',
            fieldDescri: 'Module Object Number',
            dataType: 'CHAR',
            maxChar: '100',
            mandatory: '0',
            backEnd: 0,
            systemId: 'LOCAL',
            pickTable: null,
            picklist: '0',
            pickService: null,
            dependency: '0',
            validationService: '',
            defaultValue: '',
            eventService: '',
            outputLen: '',
            strucId: '',
            permission: '',
            intUse: '',
            intUseService: '',
            searchEngin: '',
            ajax: '',
            keys: '',
            flag: '',
            objecttype: '',
            parentField: '',
            reference: '',
            languageIndependent: '',
            gridDisplay: '',
            defaultDate: '',
            workFlowField: '',
            repField: '',
            locType: '',
            descField: '',
            refField: '',
            workflowCriteria: '',
            numberSettingCriteria: '',
            isCheckList: '',
            isCompBased: '',
            textAreaLength: '',
            textAreaWidth: '',
            plantCode: '',
            defaultDisplay: '',
            isCompleteness: '',
            criteriaDisplay: '',
            isShoppingCartRefField: false
          })
          Object.keys(res.headers).forEach(header => {
            this.metaDataFieldList.push(res.headers[header]);
            this.headerFieldsList.push(res.headers[header]);
          });
        }
      })
  }

  /**
   * function to update mapping
   * @param data the mapped data
   */
  updateMapFields(data) {
    if (data && data.fieldId !== '') {
      const mapData = { columnIndex: data.index, excelFld: data.execlFld, mdoFldId: data.fieldId, mdoFldDesc: data.fieldDesc, excelFrstRow: null };
      const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === data.index);
      if (availmap.length === 0) {
        this.excelMdoFieldMappedData.push(mapData);
      } else {
        const oldMapFld = availmap[0];
        this.excelMdoFieldMappedData.splice(this.excelMdoFieldMappedData.indexOf(oldMapFld, 1));
        oldMapFld.mdoFldId = data.fieldId;
        oldMapFld.mdoFldDesc = data.fieldDesc;
        this.excelMdoFieldMappedData.push(oldMapFld);
      }
    } else {
      const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === data.index);
      if (availmap.length !== 0) {
        this.excelMdoFieldMappedData.splice(this.excelMdoFieldMappedData.indexOf(availmap[0], 1));
      }
    }
    this.requestForm.controls.mappedData.value.length = 0;
    this.requestForm.controls.mappedData.value.push(...this.excelMdoFieldMappedData);
  }

  /**
   * The function to seach from Data structure
   * @param event entered key
   * @param whatToFilter the structure to update
   */
  search(event: string, whatToFilter: string) {
    if (whatToFilter === 'module') {
      if (!event) {
        this.modulesList.length = 0;
        this.modulesList.push(...this.modulesListCopy);
        return;
      }
      this.modulesList = this.modulesList.filter((module) => module.objectdesc.toLowerCase().startsWith(event.toLowerCase()))
    }
  }

  /**
   * function to set schema name
   * @param event name of schema
   */
  setschemaName(event) {
    const updatedSchemaValue = { ...this.requestForm.controls.core_schema.value };
    updatedSchemaValue.discription = event;
    this.requestForm.controls.core_schema.setValue(updatedSchemaValue);
  }

  isSchemaSet(value): boolean {
    if ((value && !value.discription) || !value) {
      return false;
    }
    return true;
  }

  brDataToFormObject(event: MatSlideToggleChange, businessRule: CoreSchemaBrInfo) {
    if (event.checked) {
      this.requestForm.controls.coreSchemaBr.value.push(businessRule);
    } else {
      const index = this.requestForm.controls.coreSchemaBr.value.find(item => item.brIdStr === businessRule.brIdStr);
      if (index) {
        this.requestForm.controls.coreSchemaBr.value.splice(index, 1);
      }
    }
  }

  /**
   * function to set the value of scheduling
   * @param runId the value of scheduling
   */
  setRunningSchedule(runId) {
    this.requestForm.controls.runTime.setValue(runId.value);
  }

  /**
   * function to upload file to server
   */
  uploadFileData() {
    this.uploadLoader = true;
    this.schemaService.uploadUpdateFileData(this.requestForm.get('file').value, this.requestForm.get('fileSerialNo').value)
      .subscribe(res => {
        this.uploadLoader = false;
        this.requestForm.get('fileSerialNo').setValue(res);
        const objectId = this.requestForm.get('objectId').value;
        if (objectId) {
          this.getModulesMetaHeaders();
          this.stepper.next();
        } else {
          this.setModuleValueAndTakeStep();
        }
      }, (err) => {
        this.uploadLoader = false;
        this.uploadError.status = true;
        this.uploadError.message = 'File could not be uploaded';
        this.snackBar.open('File could not be uploaded', 'Okay', { duration: 5000 })
      });
  }

  getSelectedFieldId(columnInde: number): string {
    const availmap = this.excelMdoFieldMappedData.filter(fill => fill.columnIndex === columnInde);
    if (availmap.length > 0) {
      return availmap[0].mdoFldId;
    }
    return '';
  }

  /**
   * Count number of values selected for a particular field
   */
  getFieldValueCount(data) {
    const fieldData = this.fieldsBySubscriber.find(field => field.event.fieldId === data.fieldId);
    return fieldData.event.selectedValues.length;
  }

  /**
   * Function to open dialog box and set the recieved
   * subscibers to form
   */
  addSubscribers() {
    this.globaldialogService.openDialog(NewSchemaCollaboratorsComponent, {
      selectedSubscibersList: this.subscribersList
    });
    this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
      .pipe(distinctUntilChanged())
      .subscribe((response: any[]) => {
        this.updateSubscribersList(response);
        this.dialogSubscriber.unsubscribe();
      });
  }


  /**
   * update or add subscribers in selected subscribers list
   * @param response pass the response containing the subscribers list
   */
  updateSubscribersList(response) {
    if (Array.isArray(response) && response.length > 0) {
      response.forEach((subscriber) => {
        subscriber.sno = Math.floor(Math.random() * 100000000000).toString();
        subscriber.plantCode = this.userDetails.plantCode;
        subscriber.dataAllocation = [];
        subscriber.filterFieldIds = [];
        this.subscribersList.push(subscriber);
      })
    } else if (response && typeof response === 'object') {
      const index = this.subscribersList.findIndex(sub => sub.userid === response.userid);
      if (index > -1) {
        this.snackBar.open('Subscriber already selected', 'Okay', {
          duration: 3000
        });
        return;
      }
      response.sno = Math.floor(Math.random() * 100000000000).toString();
      response.plantCode = this.userDetails.plantCode;
      response.dataAllocation = [];
      response.filterFieldIds = [];
      this.subscribersList.push(response);
    }
  }

  /**
   * function to save the form at the end
   * and make a API request
   */
  save() {
    const formObject = this.requestForm.value;
    const objectId = formObject.objectId;
    const variantId = '0';
    const fileSerialNo = formObject.fileSerialNo;
    this.requestForm.controls.subcribers.setValue([]);

    if (!this.requestForm.controls.objectId.value) {
      const mappedArray = [];
      this.requestForm.controls.fields.value.forEach((header, index) => {
        mappedArray.push({
          columnIndex: index,
          excelFld: header.fieldId,
          mdoFldId: header.fieldId,
          mdoFldDesc: header.fieldDescri,
          excelFrstRow: null
        })
      });
      this.requestForm.controls.mappedData.setValue(mappedArray);
    }

    if (this.subscribersList.length > 0) {
      this.subscribersList.forEach((subscriber) => {
        if (subscriber.filterFieldIds && subscriber.filterFieldIds.length > 0) {
          subscriber.filterFieldIds.forEach(field => {
            field.values = field.selectedValues.map(item => item.CODE);
            delete field.fldCtrl
            delete field.selectedValues
          });
          subscriber.filterCriteria = subscriber.filterFieldIds;
          delete subscriber.filterFieldIds;
        }
      });
    }

    this.requestForm.controls.subcribers.setValue(this.subscribersList);
    this.callSaveSchemaAPI(
      objectId,
      variantId,
      fileSerialNo
    )
  }

  /**
   * method to convert subscriber object to
   * correct format for the api
   * @param subscriber pass the selected subscriber
   */
  mapAndUpdateSubscriber(subscriber) {
    const formObject = {
      isAdmin: false,
      isReviewer: false,
      isViewer: false,
      isEditor: false,
      groupid: '',
      roleId: '',
      userid: subscriber.userName,
      permissionType: 'USER',
      initials: subscriber.initials,
      fullName: subscriber.fullName,
      role: ''
    }

    this.updateSubscribersList(formObject);
  }

  // remove tempId from CoreSchemaBr objects
  removeTempId(value) {
    const modified = { ...value };
    const rules = value.coreSchemaBr.map((rule) => pick(rule, Object.keys(rule).filter(key => key !== 'tempId')));
    modified.coreSchemaBr = rules;
    return modified;
  }

  callSaveSchemaAPI(objectId: string, variantId: string, fileSerialNo: string) {
    const formObject = this.removeTempId(this.requestForm.value);
    const runNow = formObject.runTime;
    delete formObject.objectId;
    delete formObject.file;
    delete formObject.fileSerialNo;
    delete formObject.runNow;
    delete formObject.runTime;
    formObject[GLOBALCONSTANTS.SCHEMA_SCHEDULER] = this.currentSchedule;
    this.schemaDetailsService.saveNewSchemaDetails(
      objectId,
      runNow,
      variantId,
      fileSerialNo,
      formObject
    ).subscribe((res) => {
      this.snackBar.open('Schema created successfully', 'Okay', {
        duration: 5000
      });
      this.dialogRef.close();
    }, (err) => {
      this.snackBar.open('Schema cannot be created', 'Okay', {
        duration: 5000
      });
    })
  }

  /**
   * function to removeBR
   * @param index index of object to be removed
   */
  deleteBR(rule: CoreSchemaBrInfo) {
    const index = this.selectedBusinessRules.findIndex((brule) => brule.brId === rule.brId);
    this.selectedBusinessRules.splice(index, 1);
    this.requestForm.controls.coreSchemaBr.setValue(this.selectedBusinessRules);
    this.existingBRIds = [...this.selectedBusinessRules.map(brule => brule.brId)];
  }

  /**
   * Function to remove subscriber
   * @param index index of object to be removed
   */
  deleteSubscriber(index) {
    this.subscribersList.splice(index, 1);
    this.requestForm.controls.subcribers.value.splice(index, 1);
  }

  updateRole(event, subscriber) {
    const subscriberId = subscriber.sno;
    const subscriberInList = this.subscribersList.find(subscriberItem => subscriberItem.sno === subscriberId);
    subscriberInList.role = event.value;
    subscriberInList.isAdmin = event.value === 'isAdmin' ? true : false;
    subscriberInList.isReviewer = event.value === 'isReviewer' ? true : false;
    subscriberInList.isViewer = event.value === 'isViewer' ? true : false;
    subscriberInList.isEditer = event.value === 'isEditer' ? true : false;
  }

  /**
   * Toggle isEnable value for schedule using slide toggle
   * @param event toggle event
   */
  toggleScheduleStatus(event){
    if(this.currentSchedule){
      this.currentSchedule.isEnable = event.checked;
    }
  }

  makeFilterControl(event: AddFilterOutput, subscriber, subscriberIndex) {
    if (event.selectedValues.length === 0) {
      return;
    }

    event.fieldId = event.fldCtrl.fieldId;
    event.fieldDescription = event.fldCtrl.fieldDescri;
    const exists = this.subscribersList[subscriberIndex].filterFieldIds.find(ele => ele.fieldId === event.fieldId);
    if (exists) {
      exists.values = event.selectedValues;
      const fieldIndex = this.subscribersList[subscriberIndex].filterFieldIds.findIndex(ele => ele.fieldId === event.fieldId);
      if (fieldIndex > -1) {
        this.subscribersList[subscriberIndex].filterFieldIds[fieldIndex] = event;
      }
      const index = this.fieldsBySubscriber.findIndex((field) => field.subscriberIndex === subscriberIndex);
      this.fieldsBySubscriber[index].event = event;
    } else {
      this.subscribersList[subscriberIndex].filterFieldIds.push(event);
      this.fieldsBySubscriber.push({ subscriberIndex, event });
    }
  }

  /**
   * function to remove allocation
   * @param allocationIndex data allocation index
   * @param subscriberIndex subscriber index
   */
  removeAllocation(chipIndex, subscriberIndex) {
    this.subscribersList[subscriberIndex].filterFieldIds.splice(chipIndex, 1);
  }

  /**
   * Function to get the combined chipsets
   * @param subscriber selected subscriber
   * @param fieldId the selected field/groupid
   */
  getChipSets(subscriber) {
    const fieldIds = subscriber.filterFieldIds
      .map((field) => {
        return {
          fieldId: field.fieldId,
          count: field.values.length
        }
      });
    return fieldIds
  }

  /**
   * function to show the current selected chip
   * @param chipData selected chip
   */
  setActiveChip(chipData) {
    this.activeChipValue = chipData;
  }

  updateFilterCriteria(event, subscriberIndex) {
    this.activeChipValue = event;
  }

  setValueToForm(field, value) {
    if (typeof value === 'string') {
      this.requestForm.controls[field].setValue(value);
    } else {
      this.requestForm.controls[field].setValue(value.value);
    }
  }

  /**
   * function to set the value in the form
   * @param value entered value
   * @param field the selected field of form
   */
  setFormValue(value: any, field: string) {
    if (this.headerForm.controls[field].value !== value) {
      this.headerForm.controls[field].setValue(value);
      const index = this.dataSource.findIndex((ds) => ds.mdoFldId === field);
      if (index > -1) {
        this.dataSource[index].excelFld = value;
      }
    }
  }

  /**
   * Get business rule list from the api
   */
  getBusinessRulesList() {
    this.schemaService.getAllBusinessRules().subscribe((rules: CoreSchemaBrInfo[]) => {
      if (rules && rules.length > 0) {
        this.businessRulesList = rules;
      }
    });
  }

  /**
   * method to select business rules
   * @param businessRules an array of businessRules or a single business rule
   */
  selectBusinessRule(businessRules: CoreSchemaBrInfo[] | CoreSchemaBrInfo) {
    if (Array.isArray(businessRules)) {
      businessRules.map((rule) => {
        this.addRuleIdToExisting(rule.brId).then(() => {
          const updatedObj = { ...rule, tempId: this.utilties.getRandomString(8) };
          this.selectedBusinessRules.push(updatedObj);
        });
      });
    } else {
      if (this.existingBRIds.indexOf(businessRules.brId) > -1) {
        this.snackBar.open('This rule is already added', 'okay', {
          duration: 2000
        });
        return;
      }
      this.addRuleIdToExisting(businessRules.brId).then(() => {
        const updatedObj = { ...businessRules, tempId: this.utilties.getRandomString(8) };
        this.selectedBusinessRules.push(updatedObj);
      });
    }

    this.requestForm.controls.coreSchemaBr.setValue(this.selectedBusinessRules);
  }

  /**
   * method to get collaboratos/subscribers from the api
   * @param queryString pass query param to fetch values from the api
   */
  getCollaborators(queryString, fetchCount: number) {
    this.schemaDetailsService.getAllUserDetails(queryString, fetchCount)
      .subscribe((response: PermissionOn) => {
        if (response && response.users) {
          const subscribers: UserMdoModel[] = response.users;
          subscribers.forEach((subscriber: UserMdoModel) => {
            subscriber.initials = (subscriber.fName[0] + subscriber.lName[0]).toUpperCase();
            subscriber.selected = false;
            subscriber.userId = subscriber.userId ? subscriber.userId : Math.floor(Math.random() * 1000000000000).toString()
          });

          this.allSubscribers = subscribers;
        }
      }, () => {
        this.snackBar.open('Error getting subscribers', 'okay', {
          duration: 1000
        })
      });
  }

  /**
   * scheck if a field is  editable
   * @param data pass the field value
   */
  isEditable(data: DataSource) {
    const exists: boolean = this.editableFieldIds.indexOf(data.mdoFldId) !== -1;
    if (this.requestForm.controls.objectId.value) {
      return exists;
    }

    return true;
  }

  /**
   * make a field editable and update the field id in an array
   * @param data pass the field value
   */
  makeEditable(data: DataSource) {
    this.editableFieldIds = [];
    setTimeout(() => {
      this.editableFieldIds.push(data.mdoFldId);
    }, 0);
  }

  /**
   * Open add schedule sidesheet for adding a schedule
   */
  openAddScheduleSideSheet() {
    this.globaldialogService.openDialog(ScheduleDialogComponent, {});
    this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
      .pipe(distinctUntilChanged())
      .subscribe((response: SchemaScheduler) => {
        this.currentSchedule = response;
      });
  }
}
