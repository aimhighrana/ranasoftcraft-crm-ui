import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UploadDatasetComponent } from './upload-dataset.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaService } from '@services/home/schema.service';
import { of, Subscription } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { FormInputAutoselectComponent } from '@modules/shared/_components/form-input-autoselect/form-input-autoselect.component';
import { CoreSchemaBrInfo, DropDownValue, TransformationModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { AddFilterOutput, DataSource, ObjectTypeResponse } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { SchemaScheduler } from '@models/schema/schemaScheduler';
import { SharedModule } from '@modules/shared/shared.module';
import { SchemaDashboardPermission } from '@models/collaborator';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { RuleDependentOn } from '@models/collaborator';


describe('UploadDatasetComponent', () => {
  let component: UploadDatasetComponent;
  let fixture: ComponentFixture<UploadDatasetComponent>;
  let schemaServiceSpy: SchemaService;
  let schemadetailsService: SchemaDetailsService;
  let globaldialogService: GlobaldialogService;
  let userService: UserService;
  let usersSpy;
  const transformationRule = {
    formData: {
      rule_type: 'BR_TRANSFORMATION',
      rule_name: 'test rule',
      error_message: 'no data',
      standard_function: '',
      regex: '',
      fields: '',
      sourceFld: 'pgwtbfdr1629',
      targetFld: 'lyijfvxk6656',
      excludeScript: 'rwrewreew',
      includeScript: 'grfgsregr',
      udrTreeData: {
        blocks: [
          {
            id: '288171383289',
            conditionFieldId: '',
            conditionValueFieldId: null,
            conditionFieldValue: '',
            conditionFieldStartValue: '',
            conditionFieldEndValue: '',
            blockType: 'When',
            conditionOperator: '',
            blockDesc: '',
            plantCode: '',
            children: []
          }],
        udrHierarchies: [
          {
            parentId: '',
            leftIndex: '',
            blockRefId: '288171383289'
          }]
      },
      weightage: 54,
      categoryId: '',
      transformationRuleType: 'REGEX'
    },
    lookupData: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadDatasetComponent,
        SearchInputComponent,
        FilterValuesComponent,
        FormInputComponent,
        AddFilterMenuComponent,
        FormInputAutoselectComponent],
      imports: [AppMaterialModuleForSpec, SharedModule],
      providers: [
        SchemaDetailsService,
        GlobaldialogService,
        HttpClientTestingModule,
        FormsModule,
        FormControl,
        ReactiveFormsModule,
        SchemaService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDatasetComponent);
    component = fixture.componentInstance;
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    schemadetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    globaldialogService = fixture.debugElement.injector.get(GlobaldialogService);
    userService = fixture.debugElement.injector.get(UserService);
    // fixture.detectChanges();
    usersSpy = spyOn(schemadetailsService, 'getAllUserDetails').and.callFake(() => {
      return of({
        users: [{
          userId: null,
          userName: 'abhilash',
          fName: 'Abhilash',
          lName: 'Rajoria',
          pwd: null,
          email: 'abhilash.rajoria@prospecta.com',
          roles: null,
          status: null,
          deptId: null,
          clientId: null,
          lang: null,
          application: null,
          stage: null,
          dateFormat: null,
          sso: null,
          imgUrl: null,
          ubstitueUse: null,
          UserStartDat: null,
          sUserEnddate: null,
          subsActive: null,
          keepCopy: null,
          failedLoginAttempts: 0,
          noOfLogins: 0,
          passwordActiveDate: null,
          fullName: 'Abhilash Rajoria',
          isPasswordSet: 0,
          refreshToken: null,
          adminAccess: 0,
          digiSignSNO: null,
          password: null,
          isServiceAccount: false,
          selfServiceUserModel: null,
          userMultiRoleModels: null,
          userPasswordModel: null,
          selfService_Remote_Ob: null
        }],
        roles: [],
        groups: []
      })
    })
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`getObjectTypes(), should call service getAllObjectTypes`, async(() => {
    const returnData = [];
    spyOn(schemaServiceSpy, 'getAllObjectType').and.returnValue(of(returnData));
    component.getObjectTypes();
    expect(schemaServiceSpy.getAllObjectType).toHaveBeenCalled();
  }));

  it(`getObjectTypes(), should call service getAllObjectTypes`, async(() => {
    const returnData = [
      {
        objectid: '1',
        objectdesc: 'materialgroup'
      }
    ] as ObjectTypeResponse[];
    spyOn(schemaServiceSpy, 'getAllObjectType').and.returnValue(of(returnData));
    component.getObjectTypes();
    expect(schemaServiceSpy.getAllObjectType).toHaveBeenCalled();
  }));

  it(`createForm(), should create requestForm`, async(() => {
    component.createForm();
    expect(component.requestForm.value).not.toBeNull();
    expect(component.requestForm.value).not.toBeUndefined();
  }));

  it(`initHeaderForm(), should create headerForm`, async(() => {
    const dataSource = [{
      excelFld: 'testField',
      excelFrstRow: 'test',
      mdoFldId: 'testId',
      mdoFldDesc: 'Test Field',
      columnIndex: 0
    }];
    component.initHeaderForm(dataSource).then((res) => {
      expect(component.headerForm.value).not.toBeNull();
      expect(component.headerForm.value).not.toBeUndefined();
    }).catch((err) => {
      console.log('my error ', err);

    });
  }));

  it(`createfieldObjectForRequest(), should create fieldValues`, async(() => {
    const dataSource = [{
      excelFld: 'testField',
      excelFrstRow: 'test',
      mdoFldId: 'testId',
      mdoFldDesc: 'Test Field',
      columnIndex: 0
    }];
    component.initHeaderForm(dataSource).then((res) => {
      component.createfieldObjectForRequest(dataSource, component.headerForm.value).then((fieldValues: any[]) => {
        expect(fieldValues.length).toBeGreaterThan(0);
      })
    });
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
      duplicacyRuleData: new CoreSchemaBrInfo()
    };

    expect(component.createBrObject(formData, formData.udrTreeData)).not.toBeUndefined();
    expect(component.createBrObject(formData, formData.udrTreeData)).not.toBeNull();

    const object = {
      tempId: '131234343434',
      sno: 123323,
      brIdStr: '12343435',
      brId: '123334545',
      brType: 'Missing rule type',
      refId: 1223,
      message: 'error message',
      script: 'SSDSD',
      brInfo: 'BUSINESS RULE ONE',
      brExpose: 2,
      status: '0',
      standardFunction: 'jwqdjd0jr8323',
      brWeightage: '12',
      transformation: 1,
      tableName: 'ashishTableName',
      qryScript: 'AshishMetaD',
      dependantStatus: 'TRUE',
      plantCode: '0',
      percentage: 100,
      schemaId: '2343434',
      isCopied: false,
      duplicacyRuleData: new CoreSchemaBrInfo()
    };
    expect(component.createBrObject(object, formData.udrTreeData)).not.toBeUndefined();
    expect(component.createBrObject(object, formData.udrTreeData)).not.toBeNull();
    object.isCopied = true;
    expect(component.createBrObject(object, null).isCopied).toBeTruthy();
    object.duplicacyRuleData = {} as CoreSchemaBrInfo;
    const resp = component.createBrObject(object, null);

    expect(resp.udrDto.udrHierarchies.length).toEqual(0);
    expect(resp.udrDto.blocks.length).toEqual(0);
    expect(resp.duplicacyField.length).toEqual(0);
    expect(resp.duplicacyMaster.length).toEqual(0);
  }));

  it(`getModulesMetaHeaders(), should be called when creating modules metadata`, async(() => {
    component.createForm();
    component.requestForm.controls.objectId.setValue('testId')
    spyOn(schemadetailsService, 'getMetadataFields').and.returnValue(of(null));
    component.getModulesMetaHeaders();
    expect(schemadetailsService.getMetadataFields).toHaveBeenCalled();
    expect(component.headerFieldsList.length).toEqual(0);
  }))

  it(`getModulesMetaHeaders(), shouldcreate headerFieldsList`, async(() => {
    component.createForm();
    component.requestForm.controls.objectId.setValue('testId')
    const response = {
      headers: {
        testHeader1: '',
        testHeader2: ''
      },
      grids: null,
      hierarchy: [],
      gridFields: null,
      hierarchyFields: null
    };
    spyOn(schemadetailsService, 'getMetadataFields').and.returnValue(of(response));
    component.getModulesMetaHeaders();
    expect(schemadetailsService.getMetadataFields).toHaveBeenCalled();
    expect(component.headerFieldsList.length).toEqual(3);
  }))

  it(`updateFilterCriteria(), should update current filter value`, async(() => {
    component.subscribersList.push({
      sno: 5456667,
      plantCode: 'uyuid',
      dataAllocation: [],
      filterFieldIds: []
    })
    component.updateFilterCriteria({}, 0);
    expect(component.activeChipValue).not.toBeNull();
    expect(component.activeChipValue).not.toBeUndefined();
  }));

  it(`updateRole(), update the current Role`, async(() => {
    const subscriber = {
      sno: 5456667,
      plantCode: 'uyuid',
      dataAllocation: [],
      filterFieldIds: [],
      role: null
    };
    component.subscribersList.push(subscriber);

    component.updateRole({ value: 'isAdmin' }, subscriber);
    expect(component.subscribersList[0].sno).toEqual(5456667);
  }));

  it(`setValueToForm(), should set requestform values`, async(() => {
    component.createForm();
    component.setValueToForm('schemaThreshold', '13');
    expect(component.requestForm.controls.schemaThreshold.value).toEqual('13');
  }))

  it(`isSchemaSet(), check if schema exists`, async(() => {
    component.createForm();
    component.requestForm.controls.core_schema.setValue(component.coreSchemaObject);
    expect(component.isSchemaSet(component.requestForm.controls.core_schema.value)).toBeFalse();
  }))

  it('should call service to get collaobrators', async () => {
    component.getCollaborators('a', 0);
    expect(usersSpy).toHaveBeenCalledWith('a', 0);
    expect(component.allSubscribers.length).toEqual(1);
  });

  it(`getBusinessRulesList(), get business rules service`, async(() => {
    const returnData: CoreSchemaBrInfo[] = [];
    spyOn(schemaServiceSpy, 'getBusinessRulesByModuleId').and.returnValue(of(returnData));
    component.moduleId = '1005';

    // With module id
    component.getBusinessRulesList(component.moduleId, '', '', '0');
    expect(schemaServiceSpy.getBusinessRulesByModuleId).toHaveBeenCalledWith(component.moduleId, '', '', '0');

    // without module id
    spyOn(schemaServiceSpy, 'getAllBusinessRules').and.callFake(() => of([]));
    component.getBusinessRulesList(null, '', '', '0');
    expect(schemaServiceSpy.getAllBusinessRules).toHaveBeenCalled();
  }));

  it(`isEditable(), check if the field is editable`, async(() => {
    const data: DataSource = {
      columnIndex: 0,
      excelFld: '',
      excelFrstRow: '',
      mdoFldDesc: '',
      mdoFldId: 'id1'
    };
    component.createForm();
    component.editableFieldIds = ['id1'];
    component.requestForm.controls.objectId.setValue('test');
    expect(component.isEditable(data)).toBeTrue();

    component.requestForm.controls.objectId.setValue('');
    expect(component.isEditable(data)).toEqual(true)
  }));

  it('updateSubscribersList(), should update subscriberList', async () => {
    component.userDetails = {
      plantCode: '0',
      assignedRoles: null,
      currentRoleId: null,
      dateformat: null,
      email: '',
      firstName: '',
      fullName: '',
      lastName: '',
      userName: ''
    }
    const subscriberObject = {
      dataAllocation: [],
      filterFieldIds: [],
      fullName: 'Abhilash Rajoria',
      groupid: '',
      initials: 'AR',
      isAdmin: false,
      isEditor: false,
      isReviewer: false,
      isViewer: false,
      permissionType: 'USER',
      plantCode: '0',
      role: '',
      roleId: '',
      sno: '5818811898',
      userid: 'abhilash',
    }
    component.subscribersList = [];
    component.updateSubscribersList(subscriberObject);
    expect(component.subscribersList.length).toEqual(1);
  });

  it('setProgressValue(), should update progress value based on headertext', async () => {
    component.headerText = [
      'Upload data',
      'Select module',
      'Name your dataset',
    ];
    component.setProgressValue();
    expect(component.progressBar).toEqual(100 / component.headerText.length);

    const index = 1;
    component.setProgressValue(index);
    expect(component.progressBar).toEqual(100 / component.headerText.length);
  });

  it('prepateTextToShow(), should prepare text to show over mat-chips', async () => {
    const ctrl: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }
    const result = component.prepareTextToShow(ctrl);
    expect(result).toEqual('ABC');
  })

  it('loadDropValues(), should load dropdown values of selected filters', async () => {
    const fldc: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }
    component.loadDropValues(fldc);
    expect(component.loadDopValuesFor.checkedValue.length).toEqual(2);
  });

  it('shortName(), should return initals', () => {
    let fName = 'Ashish';
    let lName = 'Goyal';
    let initials = component.shortName(fName, lName);
    expect(initials).toEqual('AG');

    fName = 'Ashish';
    lName = '';
    initials = component.shortName(fName, lName);
    expect(initials).toEqual('');
  });

  it('mapTransformationData(), should create transformation data', () => {
    const transFormationSchema: TransformationModel[] = component.mapTransformationData(transformationRule);
    expect(transFormationSchema.length).toEqual(1);
    expect(transFormationSchema[0].excludeScript).toEqual('rwrewreew');
    expect(transFormationSchema[0].includeScript).toEqual('grfgsregr');
  });

  it('should getScheduleInfo', async(() => {

    const response = { isEnable: true, schemaId: 'test schema', repeatValue: '5' } as SchemaScheduler;

    spyOn(schemaServiceSpy, 'getSchedule').withArgs('test schema')
      .and.returnValue(of(response));

    component.getScheduleInfo('test schema');

    expect(schemaServiceSpy.getSchedule).toHaveBeenCalledWith('test schema');
    expect(component.canEditSchedule).toEqual(true);

  }));

  it('should getScheduleInfo', async(() => {
    spyOn(schemaServiceSpy, 'getSchedule').withArgs('test schema')
      .and.returnValue(of(null));

    component.getScheduleInfo('test schema');

    expect(schemaServiceSpy.getSchedule).toHaveBeenCalledWith('test schema');
    expect(component.canEditSchedule).toEqual(false);

  }));

  it('getWeightage(), should return weightage', async () => {
    const br: CoreSchemaBrInfo = {
      sno: 1299484,
      brId: '22',
      brType: 'TRANSFORMATION',
      refId: 1,
      fields: '',
      regex: '',
      order: 1,
      apiKey: '',
      message: 'Invalid',
      script: '',
      brInfo: 'Test Rule',
      brExpose: 0,
      status: '1',
      categoryId: '21474',
      standardFunction: '',
      brWeightage: '10',
      totalWeightage: 100,
      transformation: 0,
      tableName: '',
      qryScript: '',
      dependantStatus: 'ALL',
      plantCode: '0',
      percentage: 0,
      schemaId: '',
      brIdStr: '',
      udrDto: null,
      transFormationSchema: null,
      isCopied: false,
      duplicacyField: [],
      duplicacyMaster: []
    };
    expect(component.getWeightage(br)).toEqual(10);
  });

  it('setRunningSchedule(), should set runTime value in request form', async () => {
    const runId = { value: false };
    component.createForm();
    component.setRunningSchedule(runId);
    component.currentSchedule = null;
    expect(component.requestForm.controls.runTime.value).toEqual(false);

    const runid = { value: true };
    component.setRunningSchedule(runid);
    component.currentSchedule = null;
    expect(component.requestForm.controls.runTime.value).toEqual(true);

    component.currentSchedule = {
      end: null,
      endOn: '1610961949192',
      isEnable: true,
      monthOn: null,
      occurrenceVal: 2,
      repeatValue: '2',
      schemaId: null,
      schemaSchedulerRepeat: 'HOURLY',
      startOn: '1610961949191',
      weeklyOn: null
    } as SchemaScheduler;
    component.setRunningSchedule(runId);
    expect(component.requestForm.controls.runTime.value).toEqual(false);
    expect(component.currentSchedule.isEnable).toEqual(true);


    component.setRunningSchedule(runid);
    expect(component.requestForm.controls.runTime.value).toEqual(true);
    expect(component.currentSchedule.isEnable).toEqual(false);
  })

  it('addSubscribers(), should call openDialog', async () => {
    component.dialogSubscriber = new Subscription();
    spyOn(globaldialogService, 'openDialog').and.returnValue(null);
    component.addSubscribers();
    expect(globaldialogService.openDialog).toHaveBeenCalled();
  })

  it(`To get FormControl from fromGroup `, async(() => {
    component.createForm()
    const field = component.formField('objectDesc');
    expect(field).toBeDefined();
  }));

  it(`Toggle isEnable value for schedule using slide toggle `, async(() => {
    component.createForm();
    const event = { checked: true };

    component.currentSchedule = null;
    component.toggleScheduleStatus(event);
    expect(component.requestForm.controls.runTime.value).toEqual(true);

    component.currentSchedule = {
      end: null,
      endOn: '1610961949192',
      isEnable: true,
      monthOn: null,
      occurrenceVal: 2,
      repeatValue: '2',
      schemaId: null,
      schemaSchedulerRepeat: 'HOURLY',
      startOn: '1610961949191',
      weeklyOn: null
    } as SchemaScheduler;

    component.toggleScheduleStatus(event);

    expect(component.currentSchedule.isEnable).toEqual(true);
    expect(component.requestForm.controls.runTime.value).toEqual(false);
  }));

  it('showValidationError(), should hide validation message', fakeAsync(() => {
    component.uploadError = {
      status: false,
      message: ''
    }

    const message = 'Please fill the required fields.'
    component.showValidationError(message);
    expect(component.uploadError.status).toEqual(true);
    tick(3500);
    expect(component.uploadError.status).toEqual(false);
  }));

  it('toolbarHeaderText(), should return toolbar header array', async () => {
    component.headerText = ['material', 'mater'];
    component.headerTextIndex = 1;
    expect(component.toolbarHeaderText).toEqual('material')
  });

  it('getCurrentWeightageLimit(), should return current available weightage', async () => {
    const brWeightage = 10;
    component.selectedBusinessRules = [
      {
        brWeightage: '24'
      }
    ] as CoreSchemaBrInfo[];

    const res = component.getCurrentWeightageLimit(brWeightage);
    expect(res).toEqual(100 - 24 + 10);

    component.selectedBusinessRules = [];
    const res2 = component.getCurrentWeightageLimit();
    expect(res2).toEqual(100);
  });

  it('weightageChange(), should update weightage', async () => {
    const event = {
      value: 10
    };
    const i = 0;

    component.selectedBusinessRules = [
      {
        brWeightage: '10'
      }
    ] as CoreSchemaBrInfo[];

    component.weightageChange(event, i);
    expect(component.selectedBusinessRules[0].brWeightage).toEqual(event.value);
  });

  it('isdisabled(), should disable input', async () => {
    let value: any = 2;
    let res = component.isdisabled(value);
    expect(res).toEqual(true);

    value = ''
    res = component.isdisabled(value);
    expect(res).toEqual(false);
  });

  it('updateSubscriber(), should update subscriber', async () => {
    const data = {
      fieldId: 'mater',
      type: 'cleaning',
      values: ['ashish'],
      fldCtrl: [],
      filterCtrl: {}
    };

    component.updatesubscriber(data);
    expect(component.updatesubscriber).toBeTruthy();
  });

  it('isSchemaSet(), should set schema name', async () => {
    let value = {
      discription: 'materialGrpD'
    };
    expect(component.isSchemaSet(value)).toEqual(true);

    value = null;
    expect(component.isSchemaSet(value)).toEqual(false);
  });

  it('makeEditable(), should make editable', fakeAsync(() => {
    const data = {
      mdoFldId: '12234545667'
    } as DataSource;
    component.makeEditable(data);
    tick(10);
    expect(component.editableFieldIds.length).toEqual(1)
  }));

  it('checkIfExist(), should check for business rules existence', async () => {
    const rule = {
      brId: '123234344',
      brIdStr: '12323444',
      tempId: '1323443'
    } as CoreSchemaBrInfo;
    component.existingTempIds = ['1323443']
    expect(component.checkIfExist(rule)).toEqual(true);
  });

  it('setSchemaName(), should set schema name to field', async () => {
    component.createForm();
    const coreSchema = {
      discription: 'Ashish_Schema'
    }
    component.requestForm.controls.core_schema.setValue(coreSchema);
    const event = 'Ashish_Updated_Schema';

    component.setschemaName(event);
    expect(component.requestForm.controls.core_schema.value.discription).toEqual(event)
  });

  it('search(), should return search result of modules', async () => {
    const event = 'module';
    const whatToFilter = 'module';

    component.modulesListCopy = [];
    component.search('', whatToFilter);
    expect(component.modulesList.length).toEqual(0);

    component.modulesList = [
      {
        objectdesc: 'moduleAshishGouyal'
      },
      {
        objectdesc: 'Ashish'
      }
    ];
    // whatToFilter = 'schema';
    component.search(event, whatToFilter);
    expect(component.modulesList.length).toEqual(1)
  });

  it('getSchemaCollaboratorInfo(), should get subscriber info of schema', async () => {
    const schemaId = '121234';
    component.userDetails = { plantCode: '0' } as Userdetails;
    const mockRes = [
      {
        sno: '11323',
        filterCriteria: [
          {
            fieldId: 'ashishmaterial',
            type: 'DROPDOWN',
            values: ['ashish']
          }
        ],
        isAdmin: true,
        isReviewer: true,
        isEditer: true,
        isViewer: true
      }
    ] as SchemaDashboardPermission[];

    spyOn(schemadetailsService, 'getCollaboratorDetails').withArgs(schemaId).and.returnValue((of(mockRes)));

    component.getSchemaCollaboratorInfo(schemaId);
    expect(schemadetailsService.getCollaboratorDetails).toHaveBeenCalled()
  })

  it('getSchemaCollaboratorInfo(), should get subscriber info of schema', async () => {
    const schemaId = '121234';
    component.userDetails = { plantCode: '0' } as Userdetails;
    const mockRes = [
      {
        sno: '11323',
        filterCriteria: [
          {
            fieldId: 'ashishmaterial',
            type: 'DROPDOWN',
            values: ['ashish']
          }
        ],
        isAdmin: false,
        isReviewer: false,
        isEditer: false,
        isViewer: false
      }
    ] as SchemaDashboardPermission[];

    spyOn(schemadetailsService, 'getCollaboratorDetails').withArgs(schemaId).and.returnValue((of(mockRes)));

    component.getSchemaCollaboratorInfo(schemaId);
    expect(schemadetailsService.getCollaboratorDetails).toHaveBeenCalled()
  });

  it('ngOnInit(), should call It after loading component successfully.', async () => {
    const mockRes = {
      userName: 'AshishK',
      plantCode: '0'
    } as Userdetails;
    spyOn(component, 'createForm');
    spyOn(component, 'getObjectTypes');
    spyOn(userService, 'getUserDetails').and.returnValue(of(mockRes))
    spyOn(component, 'getBusinessRulesList');
    spyOn(component, 'getCollaborators');

    component.requestForm = new FormGroup({
      dataScope: new FormControl(''),
      schemaThreshold: new FormControl(),
      userId: new FormControl(''),
      plantCode: new FormControl()
    })
    component.ngOnInit();

    expect(userService.getUserDetails).toHaveBeenCalled();
  })


  it('updateDepRule() updateDepRule', async () => {
    component.selectedBusinessRules = [
      {
        sno: 101,
        brId: '21',
        brIdStr: '23',
        brType: 'TRANSFORMATION',
        refId: 1,
        fields: '',
        regex: '',
        order: 1,
        apiKey: '',
        message: 'Invalid',
        script: ''
      } as CoreSchemaBrInfo,
      {
        sno: 1299484,
        brId: '22',
        brIdStr: '22',
        brType: 'TRANSFORMATION',
        dep_rules: []
      } as CoreSchemaBrInfo
    ];
    const br = {
      sno: 1299484,
      brId: '22',
      brIdStr: '22',
      brType: 'TRANSFORMATION',
      dep_rules: []
    } as CoreSchemaBrInfo
    const event = { value: RuleDependentOn.SUCCESS };
    component.updateDepRule(br, event);
    expect(component.selectedBusinessRules.length).toEqual(1);

    component.selectedBusinessRules = [
      {
        sno: 101,
        brId: '21',
        brIdStr: '23',
        brType: 'TRANSFORMATION',
        refId: 1,
        fields: '',
        regex: '',
        order: 1,
        apiKey: '',
        message: 'Invalid',
        script: '',
        dep_rules: [{
          sno: 1299484,
          brId: '22',
          brIdStr: '25',
          brType: 'TRANSFORMATION',
          dep_rules: []
        } as CoreSchemaBrInfo]

      } as CoreSchemaBrInfo,
      {
        sno: 1299484,
        brId: '22',
        brIdStr: '22',
        brType: 'TRANSFORMATION',
        dep_rules: [{
          sno: 1299484,
          brId: '22',
          brIdStr: '22',
          brType: 'TRANSFORMATION', dependantStatus: 'SUCCESS'
        }]
      } as CoreSchemaBrInfo
    ];
    component.updateDepRule(br, event);
    expect(component.selectedBusinessRules.length).toEqual(1);
  });

  it('updateDepRuleForChild() updateDepRuleForChild', async () => {
    component.selectedBusinessRules = [
      {
        sno: 101,
        brId: '21',
        brIdStr: '23',
        brType: 'TRANSFORMATION',
        refId: 1,
        fields: '',
        regex: '',
        order: 1,
        apiKey: '',
        message: 'Invalid',
        script: ''
      } as CoreSchemaBrInfo,
      {
        sno: 1299484,
        brId: '22',
        brIdStr: '22',
        brType: 'TRANSFORMATION',
        dep_rules: [{
          sno: 1299484,
          brId: '22',
          brIdStr: '22',
          brType: 'TRANSFORMATION', dependantStatus: 'ALL'
        }]
      } as CoreSchemaBrInfo
    ];
    const br = {
      sno: 1299484,
      brId: '22',
      brIdStr: '22',
      brType: 'TRANSFORMATION',
    } as CoreSchemaBrInfo
    const event = { value: RuleDependentOn.ALL };
    component.updateDepRuleForChild(br, 0, event);
    expect(component.selectedBusinessRules.length).toEqual(3);

    component.selectedBusinessRules = [
      {
        sno: 101,
        brId: '21',
        brIdStr: '23',
        brType: 'TRANSFORMATION',
        refId: 1,
        fields: '',
        regex: '',
        order: 1,
        apiKey: '',
        message: 'Invalid',
        script: '',
        dep_rules: [{
          sno: 1299484,
          brId: '22',
          brIdStr: '25',
          brType: 'TRANSFORMATION',
        } as CoreSchemaBrInfo]

      } as CoreSchemaBrInfo,
      {
        sno: 1299484,
        brId: '22',
        brIdStr: '22',
        brType: 'TRANSFORMATION',
        dep_rules: [{
          sno: 1299484,
          brId: '22',
          brIdStr: '22',
          brType: 'TRANSFORMATION', dependantStatus: 'SUCCESS'
        }]
      } as CoreSchemaBrInfo
    ];
    component.updateDepRuleForChild(br, 0, event);
    expect(component.selectedBusinessRules.length).toEqual(3);
  });

  it(`mapSubscriberInfo() `, async(() => {
    const subscriber = {
      userName: 'test',
      groupid: 1345,
      sNo: 101,
      fName: 'testFirstName',
      lName: 'testLastName',
      userMdoModel: {
        fullName: 'testFullName'
      }
    };
    component.userDetails = {
      plantCode: ''
    } as Userdetails;
    const res = component.mapSubscriberInfo(subscriber);
    expect(res.userName).toEqual(subscriber.userName);
    expect(res.groupid).toEqual(subscriber.groupid);
    expect(res.userid).toEqual(subscriber.userName);
    expect(res.fullName).toEqual(subscriber.userMdoModel.fullName);
  }));

  it(`updateRole(), should be called to update correct role`, async(() => {
    const subscriber: any = {};
    component.subscribersList = [subscriber];
    component.updateRole('isAdmin', subscriber);
    expect(component.subscribersList[0].isAdmin).toBeTruthy();
    component.updateRole('isReviewer', subscriber);
    expect(component.subscribersList[0].isReviewer).toBeTruthy();
    component.updateRole('isViewer', subscriber);
    expect(component.subscribersList[0].isViewer).toBeTruthy();
    component.updateRole('isEditer', subscriber);
    expect(component.subscribersList[0].isEditer).toBeTruthy();
  }));

});
