import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ObjectTypeResponse, ObjectType } from '@models/schema/schema';
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
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { NewSchemaCollaboratorsComponent } from '../new-schema-collaborators/new-schema-collaborators.component';
import { SchemaCollaborator} from '@models/collaborator';
import { Utilities } from '@modules/base/common/utilities';

export interface DataSource {
  excelFld: string;
  excelFrstRow: string;
  mdoFldId: string;
  mdoFldDesc: string;
  columnIndex: number;
}
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
  dataSource = [];
  filteredModules: Observable<ObjectTypeResponse[]>;
  moduleInpFrmCtrl: FormControl;
  excelHeader: string[];
  metadataFields: MetadataModeleResponse;
  metaDataFieldList: MetadataModel[] = [];
  headerFieldsList: MetadataModel[] = [];
  uploadedData: UploadedDataType;
  excelMdoFieldMappedData: DataSource[] = [];

  uploadedFile: File;
  uploadDisabled = true;
  plantCode: string;

  loaded = false;

  objectTypes: Array<ObjectType> = [];
  /**
   * progress bar value setting variable
   */
  progressBar = 20;
  /**
   * array of headers
   */
  headerText = [
    'Upload dataset: choose a file',
    'Select module',
    'Name your dataset',
    'Select business rule',
    'Add subscribers',
    'Run the schema'
  ];

  /**
   * index of active header
   */
  headerTextIndex = 0;

  /**
   * Modules list to pre-populate
   */
  modulesList = [];

  /**
   * copy of modules list
   */
  modulesListCopy = [];

  /**
   * List of all business rules
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
   * subscribers list
   */
  subscribersList = [];

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

  /**
   * Flag to disable back button
   */
  disableBack = false;

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
    this.moduleInpFrmCtrl = new FormControl();
    this.selectedMdoFldCtrl = new FormControl();
  }

  /**
   * Angular hook
   */
  ngOnInit(): void {
    this.createForm();
    this.schemaService.getAllObjectType().subscribe((modules: []) => {
      this.modulesList.push(...modules);
      this.modulesListCopy.push(...modules)
    });

    // get logged in user details
    this.userService.getUserDetails().subscribe((userdetails: Userdetails) => {
      this.userDetails = userdetails;
      this.requestForm.controls.userId.setValue(this.userDetails.userName)
      this.requestForm.controls.plantCode.setValue(this.userDetails.plantCode)
    });

    if (this.data.objectid && this.data.objectdesc) {
      this.requestForm.get('objectId').setValue(this.data.objectid);
      this.requestForm.get('objectDesc').setValue(this.data.objectdesc);
      this.requestForm.get('objectfullDesc').setValue(this.data.objectdesc);
    }
  }

  setObjectDescription(moduleName) {
    this.requestForm.controls.objectDesc.setValue(moduleName);
    this.requestForm.controls.objectfullDesc.setValue(moduleName);
  }

  /**
   * Function to build form
   */
  createForm() {
    this.requestForm = new FormGroup({
      file: new FormControl(),
      fileSerialNo: new FormControl(''),
      objectId: new FormControl(),
      objectDesc: new FormControl(''),
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
      subscribers: new FormControl([]),
      runTime: new FormControl(true)
    });
  }

  /**
   * Angular hook
   */
  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe((change) => {
      this.headerTextIndex = change.selectedIndex;
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
      const target: DataTransfer = (evt.target) as unknown as DataTransfer;
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      // check file type
      let type = '';
      try {
        type = target.files[0].name.split('.')[1];
      } catch (ex) {
        console.error(ex)
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
          // move to next step

          const file = target.files[0]
          this.uploadedFile = file;

          const dataS: DataSource[] = [];
          for (let i = 0; i < this.uploadedData[0].length; i++) {
            const datS: DataSource = { excelFld: this.uploadedData[0][i], excelFrstRow: this.uploadedData[1][i], mdoFldId: '', mdoFldDesc: '', columnIndex: i };
            dataS.push(datS);
          }
          this.dataSource = dataS;
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
   * function to create fields from excel
   * file and create structure to send
   * to server
   */
  createfieldObjectForRequest(excelHeader) {
    excelHeader.forEach((field) => {
      this.requestForm.controls.fields.value.push({
        fieldDescri: field,
        fieldId: this.utilties.getRandomString(8),
        dataType: 'CHAR',
        maxChar: '200',
        mandatory: '0',
        parentField: null,
        tableName: null,
        isCheckList: 'false',
        isComBased: '0'
      })
    });
  }

  /**
   * function to set the header text dynamically
   */
  get toolbarHeaderText() {
    return this.headerText[this.headerTextIndex];
  }

  /**
   * Close dialog after saved or click close
   */
  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * stepping function
   * @param where value to move to next or previous
   */
  step(where: string) {

    if (where === 'next') {
      if (this.progressBar === 100) {
        return;
      }
      const currentStepIndex = this.stepper.selectedIndex

      if (currentStepIndex === 2) {
        // there should be atleast one mapping
        const anyMapping = this.requestForm.controls.mappedData.value.length;
        const isNewSchema = this.requestForm.controls.objectId.value;

        if (anyMapping === 0 && isNewSchema) {
          this.snackBar.open('Please select atleast one mapping', 'Okay', {duration: 5000});
          return;
        }
      }

      if (currentStepIndex === 3) {
        // there should be atleast one Business rule
        const anyBR = this.requestForm.controls.coreSchemaBr.value;
        if (anyBR.length === 0) {
          this.snackBar.open('Please create atleast one business rule', 'Okay', {duration: 5000});
          return;
        }
      }
      this.moveProgressBar('next');
    } else {
      this.moveProgressBar('back')
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
   * Common function to update progressbar
   * @param movementType movement type ie next or previous
   */
  moveProgressBar(movementType) {
    this.progressBar = movementType === 'next' ? this.progressBar + 20 : this.progressBar - 20
  }

  /**
   * Function to open global dialog
   * @param componentName name of the component that needs to be opened
   */
  openGlobalDialog(componentName) {
    if (componentName === 'createBR') {
      this.globaldialogService.openDialog(NewBusinessRulesComponent, {
        moduleId: this.requestForm.value.objectId,
        fields: this.requestForm.controls.fields.value
      });

      this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
        .pipe(
          distinctUntilChanged()
        )
        .subscribe((response: any) => {
          let brObject: CoreSchemaBrInfo;
          if (response.rule_type === 'BR_CUSTOM_SCRIPT') {
            brObject = this.createBrObject(response, response.udrTreeData)
          } else {
            brObject = this.createBrObject(response)
          }
          this.requestForm.controls.coreSchemaBr.value.push(brObject);
          brObject.status = '1';
          this.businessRulesList.push(brObject);
          this.dialogSubscriber.unsubscribe()
        })
    }
  }

  toggleBrStatus(event, Br) {
    this.requestForm.controls.coreSchemaBr.value.map((br) => {
      if (br.fields === Br.fields) {
        br.status = event.checked ? '1' : '0';
      }
    });
  }

  /**
   * function to create br
   * @param object newly created Br
   */
  createBrObject(object, udrTreeData = { udrHierarchies: [], blocks: [] }) {
    return {
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
    moveItemInArray(this.businessRulesList, event.previousIndex, event.currentIndex);
    this.businessRulesList[event.currentIndex].order = event.currentIndex + 1;
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
      this.getModulesMetaHeaders()
    } else {
      this.requestForm.controls.objectDesc.setValue('');
      this.requestForm.controls.objectfullDesc.setValue('');
      this.requestForm.controls.objectId.setValue('');
      this.createfieldObjectForRequest(this.excelHeader)
    }
    this.step('next');
  }

  /**
   * get all metadata headers
   */
  getModulesMetaHeaders() {
    this.schemaDetailsService.getMetadataFields(this.requestForm.controls.objectId.value)
      .subscribe((res: MetadataModeleResponse) => {
        if (res.headers) {

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
    this.requestForm.controls.core_schema.value.discription = event;
  }

  brDataToFormObject(event: MatSlideToggleChange, businessRule: CoreSchemaBrInfo) {
    if (event.checked) {
      this.requestForm.controls.coreSchemaBr.value.push(businessRule)
    } else {
      const index = this.requestForm.controls.coreSchemaBr.value.find(item => item.brIdStr === businessRule.brIdStr);
      if (index) {
        this.requestForm.controls.coreSchemaBr.value.splice(index, 1)
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
    this.schemaService.uploadUpdateFileData(this.requestForm.get('file').value, this.requestForm.get('fileSerialNo').value)
      .subscribe(res => {
        this.requestForm.get('fileSerialNo').setValue(res);
        const objectId = this.requestForm.get('objectId').value;
        console.log(objectId)
        if (this.requestForm.get('objectId').value) {
          this.getModulesMetaHeaders()
          this.stepper.next();
          this.stepper.next();
          this.disableBack = true;
          this.moveProgressBar('next');
        } else {
          this.disableBack = false;

          this.stepper.next();
        }
      }, () => {
        this.snackBar.open('File could not be uploaded', 'Okay', {duration: 5000})
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
   * Function to open dialog box and set the recieved
   * subscibers to form
   */
  addSubscribers() {
    this.globaldialogService.openDialog(NewSchemaCollaboratorsComponent, {});
    this.dialogSubscriber = this.globaldialogService.dialogCloseEmitter
      .pipe(distinctUntilChanged())
      .subscribe((response: SchemaCollaborator) => {
        if (response) {
          response.sno = Math.floor(Math.random() * 100000000000).toString();
          response.plantCode = this.userDetails.plantCode;
          response.dataAllocation = [];
          response.filterFieldIds = [];
          this.subscribersList.push(response);
        }
        this.dialogSubscriber.unsubscribe();
      });
  }

  /**
   * function to save the form at the end
   * and make a API request
   */
  save() {
    const formObject = this.requestForm.value;
    const objectId = formObject.objectId
    const variantId = '0'
    const fileSerialNo = formObject.fileSerialNo;
    this.requestForm.controls.subscribers.setValue([]);

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
      this.requestForm.controls.mappedData.setValue(mappedArray)
    }


    if (this.subscribersList.length === 0) {
      this.callSaveSchemaAPI(
        objectId,
        variantId,
        fileSerialNo
      )
    } else {
      this.subscribersList.forEach((subscriber, index) => {
        let obj;
        const subscriberObject = subscriber;

        subscriberObject.filterFieldIds.forEach((fieldId) => {
          const getSubsciberDataOnBasisOfFieldId = subscriber.dataAllocation.filter((sub) => sub.FIELDNAME === fieldId);
          obj = {
            type: 'DROPDOWN',
            fieldId,
            values: getSubsciberDataOnBasisOfFieldId ? getSubsciberDataOnBasisOfFieldId.map((item) => item.CODE) : ''
          }
          subscriberObject.filterCriteria = obj;
        });
        this.requestForm.controls.subscribers.setValue(this.subscribersList);
        if (index === this.subscribersList.length - 1) {
          this.callSaveSchemaAPI(
            objectId,
            variantId,
            fileSerialNo
          )
        }
      });
    }
  }

  callSaveSchemaAPI(objectId: string, variantId: string, fileSerialNo: string) {
    const formObject = this.requestForm.value;
    const runNow = formObject.runTime;
    delete formObject.objectId;
    delete formObject.file;
    delete formObject.fileSerialNo;
    delete formObject.runNow;
    delete formObject.runTime;
    this.requestForm.controls.subscribers.value.forEach((subscriber) => {
      delete subscriber.dataAllocation;
      delete subscriber.filterFieldIds
    })
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
  deleteBR(index) {
    this.businessRulesList.splice(index, 1);
    this.requestForm.controls.coreSchemaBr.value.splice(index, 1);
  }

  /**
   * Function to remove subscriber
   * @param index index of object to be removed
   */
  deleteSubscriber(index) {
    this.subscribersList.splice(index, 1);
    this.requestForm.controls.subscribers.value.splice(index, 1);
  }

  updateRole(event, subscriber) {
    const subscriberId = subscriber.sno;
    const subscriberInList = this.subscribersList.find(subscriberItem => subscriberItem.sno === subscriberId);
    subscriberInList.role = event.value;
    subscriberInList.role = event.value;
    subscriberInList.isAdmin = event.value === 'isAdmin' ? true : false;
    subscriberInList.isReviewer = event.value === 'isReviewer' ? true : false;
    subscriberInList.isViewer = event.value === 'isViewer' ? true : false;
    subscriberInList.isEditer = event.value === 'isEditer' ? true : false;
  }

  makeFilterControl(event, subscriber, subscriberIndex) {
    const allocationExists = this.subscribersList[subscriberIndex].filterFieldIds.find(item => item === event.fldCtrl.fieldId)
    if (!allocationExists) {
      this.subscribersList[subscriberIndex].filterFieldIds.push(event.fldCtrl.fieldId)
    }

    event.selectedValeus.forEach((selectedValue) => {
      const mappingExists = this.subscribersList[subscriberIndex].dataAllocation.find(item => item.CODE === selectedValue.CODE);
      if (!mappingExists) {
        this.subscribersList[subscriberIndex].dataAllocation.push(selectedValue);
      }
    })
  }

  /**
   * function to remove allocation
   * @param allocationIndex data allocation index
   * @param subscriberIndex subscriber index
   */
  removeAllocation(subscriber, fieldId) {
    const fieldIdValueIndex = subscriber.filterFieldIds.findIndex(item => item === fieldId);
    const allocationData = subscriber.dataAllocation.filter(item => item.FIELDNAME === fieldId);
    allocationData.forEach((allocation) => {
      delete subscriber.dataAllocation[allocation]
    })
    subscriber.filterFieldIds.splice(fieldIdValueIndex, 1);
  }

  /**
   * Function to get the combined chipsets
   * @param subscriber selected subscriber
   * @param fieldId the selected field/groupid
   */
  getChipSets(subscriber, fieldId) {
    const children = subscriber.dataAllocation.filter(item => item.FIELDNAME === fieldId);
    if (children.length && children.length > 1) {
      return `${fieldId}:${children.length}`;
    } else {
      if (children.length && children.length === 0) {
        return `${fieldId}:${children[0].TEXT}`;
      }
    }
    return null;
  }

  /**
   * getter function to show the back button conditionally
   */
  get setBackBtnVisibility() {
    if (this.headerTextIndex === 2 && this.disableBack) {
      return false
    }
    return this.headerTextIndex > 1
  }
}
