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
import { of, Subscription, throwError } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { FormInputAutoselectComponent } from '@modules/shared/_components/form-input-autoselect/form-input-autoselect.component';
import { CoreSchemaBrInfo, DropDownValue, TransformationModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { AddFilterOutput, DataSource, ObjectTypeResponse } from '@models/schema/schema';
import { FilterCriteria, LookupFields } from '@models/schema/schemadetailstable';
import { SchemaScheduler } from '@models/schema/schemaScheduler';
import { SharedModule } from '@modules/shared/shared.module';
import { SchemaDashboardPermission } from '@models/collaborator';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { RuleDependentOn } from '@models/collaborator';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Validators } from '@angular/forms';


fdescribe('UploadDatasetComponent', () => {
  let component: UploadDatasetComponent;
  let fixture: ComponentFixture<UploadDatasetComponent>;
  let schemaServiceSpy: SchemaService;
  let schemadetailsService: SchemaDetailsService;
  let globaldialogService: GlobaldialogService;
  let userService: UserService;
  let usersSpy;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  let dialogRef: MatDialogRef<UploadDatasetComponent>;
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
        { provide: MatDialogRef, useValue: mockDialogRef },
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
    dialogRef = fixture.debugElement.injector.get(MatDialogRef);
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
        }, {
          userId: `1`,
          userName: 'abhilash-1',
          fName: 'Abhilash-1',
          lName: 'Rajoria-1',
          pwd: null,
          email: 'abhilash1.rajoria@prospecta.com',
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
          fullName: 'Abhilash Rajoria1',
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

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



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

/*  it(`createfieldObjectForRequest(), should create fieldValues`, async(done) => {
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
        component.createfieldObjectForRequest({length: 1} as any, component.headerForm.value)
        .then((res) => {
          expect(Array.isArray(res)).toBeTrue();
          done();          
        })
        .catch((error) => {
          expect(Array.isArray(error)).toBeFalse();
          done();
        });
      })
    });
  });
*/

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

    const object: any = {
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

    object.udrHierarchies = [1, 2];
    expect(component.createBrObject(object, formData.udrTreeData).udrDto.udrHierarchies.length).toBe(2);
    delete formData.udrTreeData.udrHierarchies;
    expect(component.createBrObject(object, formData.udrTreeData).udrDto.udrHierarchies.length).toBe(2);
    delete object.udrHierarchies;
    expect(component.createBrObject(object, formData.udrTreeData).udrDto.udrHierarchies).toBeUndefined();
    object.isCopied = true;
    expect(component.createBrObject(object, formData.udrTreeData).isCopied).toBeTruthy();
    object.duplicacyRuleData = {};
    expect(component.createBrObject(object, formData.udrTreeData).duplicacyField).toBeInstanceOf(Array);
    expect(component.createBrObject(object, formData.udrTreeData).duplicacyMaster).toBeInstanceOf(Array);
    object.blocks = true;
    object.object = [{}];
    expect(component.createBrObject(object, formData.udrTreeData).udrDto.blocks.length).toBe(1);
    expect(component.createBrObject(object, null).udrDto.udrHierarchies.length).toBe(0);
  }));

  it(`mapSubscriberInfo() `, async(() => {
    const subscriber = {
      userName: 'test',
      groupid: 1345,
      sNo: 101,
      fName: 'testFirstName',
      lName: 'testLastName',
      userMdoModel: {
        fName: 'testFirstName',
        lName: 'testLastName'
      }
    };
    component.userDetails = {
      plantCode: ''
    } as Userdetails;
    let res = component.mapSubscriberInfo(subscriber);
    expect(res.userName).toEqual(subscriber.userName);
    expect(res.groupid).toEqual(subscriber.groupid);
    expect(res.userid).toEqual(subscriber.userName);
    expect(res.fullName).toBeUndefined();
    expect(res.fName).toEqual(subscriber.userMdoModel.fName);
    expect(res.lName).toEqual(subscriber.userMdoModel.lName);
    delete subscriber.fName;
    delete subscriber.lName;
    res = component.mapSubscriberInfo(subscriber);
    expect(res.fName).toEqual(subscriber.userMdoModel.fName);
    expect(res.lName).toEqual(subscriber.userMdoModel.lName);
    delete subscriber.userMdoModel;
    res = component.mapSubscriberInfo(subscriber);
    expect(res.fName).toEqual('');
    expect(res.lName).toEqual('');
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
    let selectedValues = [];
    component.subscribersList = [];
    component.updateFilterCriteria(selectedValues, 0);
    selectedValues = [{
      FIELDNAME: 'test',
      CODE: 'test'
    }];
    component.subscribersList = [{
      sno: 0,
      filterCriteria: [{
        fieldId: 'test',
        values: []
      }]
    }, {
      sno: 1,
      filterCriteria: []
    }];
    expect(component.updateFilterCriteria(selectedValues, 0)).toBeUndefined();
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
    component.setValueToForm('schemaThreshold', {value: '3'});
    expect(component.requestForm.controls.schemaThreshold.value).toEqual('3');
  }))

  it(`isSchemaSet(), check if schema exists`, async(() => {
    component.createForm();
    component.requestForm.controls.core_schema.setValue(component.coreSchemaObject);
    expect(component.isSchemaSet(component.requestForm.controls.core_schema.value)).toBeFalse();
  }))

  it('should call service to get collaobrators', async () => {
    component.getCollaborators('a', 0);
    expect(usersSpy).toHaveBeenCalledWith('a', 0);
    expect(component.allSubscribers.length).toEqual(2);
    usersSpy.and.returnValue(throwError({message:'error'}));
    component.getCollaborators('a', 0);
    expect(component.subscriberLoader).toBeFalse();
  });

  it(`getBusinessRulesList(), get business rules service`, async(() => {
    const returnData: CoreSchemaBrInfo[] = [];
    const getBRRuleByModuleIdSpy = spyOn(schemaServiceSpy, 'getBusinessRulesByModuleId').and.returnValue(of(returnData));
    component.moduleId = '1005';

    // With module id
    component.getBusinessRulesList(component.moduleId, '', '', '0');
    expect(schemaServiceSpy.getBusinessRulesByModuleId).toHaveBeenCalledWith(component.moduleId, '', '', '0');

    // without module id
    spyOn(schemaServiceSpy, 'getAllBusinessRules').and.callFake(() => of([{
      brId: 'test'
    } as CoreSchemaBrInfo]));
    getBRRuleByModuleIdSpy.and.callFake(() => of([{
      brId: 'test'
    } as CoreSchemaBrInfo]));
    component.getBusinessRulesList(null, '', '', '0');
    expect(schemaServiceSpy.getAllBusinessRules).toHaveBeenCalled();
    
    component.getBusinessRulesList('test', '', '', '0');
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
      userName: 'test'
    }
    component.subscribersList = [];
    component.updateSubscribersList(subscriberObject);
    expect(component.subscribersList.length).toEqual(1);
    
    component.subscribersList = [{
      userName: 'test'
    }];
    component.updateSubscribersList(subscriberObject);
    expect(component.subscribersList.length).toEqual(1);
    component.updateSubscribersList([subscriberObject]);
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
    ctrl.filterCtrl.selectedValues[0].TEXT = 'ABCD';
    expect(component.prepareTextToShow(ctrl)).toEqual('ABCD');
    ctrl.filterCtrl.selectedValues.push({
      CODE: 'ABC',
      FIELDNAME: 'MaterialType'
    } as DropDownValue);
    expect(component.prepareTextToShow(ctrl)).toEqual('2');
    ctrl.filterCtrl.selectedValues = [];
    expect(component.prepareTextToShow(ctrl)).toEqual('Unknown');
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
    let res = component.mapTransformationData(transformationRule);
    expect(res).toBeTruthy();
    const transFormationSchema: TransformationModel[] = res;
    expect(transFormationSchema.length).toEqual(1);
    expect(transFormationSchema[0].excludeScript).toEqual('rwrewreew');
    expect(transFormationSchema[0].includeScript).toEqual('grfgsregr');
    transformationRule.lookupData = [{
      fieldId: '1',
      lookupTargetField:'1',
      fieldLookupConfig: {
        moduleId: '1'
      }
    }];
    res = component.mapTransformationData(transformationRule);
    expect(res).toBeTruthy();
    
    res = component.mapTransformationData({
      formData: {}
    });
    expect(res).toBeNull();
    
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

  it('should check getScheduleInfo error', async(() => {
    spyOn(schemaServiceSpy, 'getSchedule').withArgs('test schema').and.returnValue(throwError({message:'error'}));
    component.getScheduleInfo('test schema');
    expect(schemaServiceSpy.getSchedule).toHaveBeenCalledWith('test schema');
    expect(component.canEditSchedule).toBeFalsy();

  }));

  it('getWeightage(), should return weightage', async (() => {
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
  }));

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

    event.value = 30000;
    component.weightageChange(event, i);
    expect(component.selectedBusinessRules[0].brWeightage).toBeLessThan(event.value);
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
    component.selectedBusinessRules = [rule];
    expect(component.checkIfExist(rule)).toEqual(true);
    component.existingTempIds = [];
    expect(component.checkIfExist(rule)).toEqual(true);
    component.selectedBusinessRules = [];
    expect(component.checkIfExist(rule)).toEqual(false);
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
    spyOn(schemaServiceSpy, 'getAllBusinessRules');

    component.requestForm = new FormGroup({
      dataScope: new FormControl(''),
      schemaThreshold: new FormControl(),
      userId: new FormControl(''),
      plantCode: new FormControl()
    })
    component.ngOnInit();
    expect(userService.getUserDetails).toHaveBeenCalled();
  });

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
        tempId: '22',
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

    br.tempId = '22';
    delete br.brId;
    component.updateDepRuleForChild(br, 0, event);
    expect(component.selectedBusinessRules.length).toEqual(4);
  
    spyOn(component, 'getSelectedDependantStatus').withArgs(event.value).and.returnValue(null);
    br.brId = '22';
    component.updateDepRuleForChild(br, 0, event);
    expect(component.selectedBusinessRules[0].dep_rules[0].dependantStatus).toBeFalsy();
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

  
  it('ngAfterViewInit() should subscrie the stepper component change', async () => {
    fixture.detectChanges();
    spyOn(component.stepper.selectionChange, 'subscribe');
    spyOn(component, 'setProgressValue');
    component.ngAfterViewInit();
    expect(component.stepper.selectionChange.subscribe).toHaveBeenCalled();
    component.stepper.selectionChange.emit({
      selectedIndex: 0
    } as StepperSelectionEvent);
    fixture.detectChanges();
    expect(component.setProgressValue).toHaveBeenCalledWith(1);
  });


  it(`validateStep() should validate the steps`, async(done) => {
    component.createForm();
    await component.initHeaderForm([]);
    fixture.detectChanges();
    let res= component.validateStep();
    expect(res).toBeFalsy();
    
    let headerFormBody = {
      name: new FormControl('name', [Validators.required])
    };
    let requestFormBody = {
      core_schema: new FormControl('core_schema', [Validators.required])
    };
    component.headerForm = new FormGroup(headerFormBody);
    component.requestForm = new FormGroup(requestFormBody);
    component.headerForm.controls['name'].setValue('name');
    
    Object.defineProperty( component.stepper, 'selectedIndex', {
      writable: true,
      value: 2
    });
    
    res= component.validateStep();
    expect(res).toBeFalsy();

    component.requestForm.controls['core_schema'].setValue({
    });
    res= component.validateStep();
    expect(res).toBeFalsy();

    component.requestForm.controls['core_schema'].setValue({
      discription: 'test'
    });
    component.selectedBusinessRules = [];
    res= component.validateStep();
    expect(res).toBeFalsy();

    component.stepper.selectedIndex=3;
    res= component.validateStep();
    expect(res).toBeTruthy(); 
    done();
  });

  it('onClick() should reset editable field list on invalid id present', async() => {
    component.editableFieldIds = ['test'];
    const event = {
      target: {
        id: 'test'
      }
    };
    component.onClick(event);
    expect(component.editableFieldIds.length).toEqual(1);
    event.target.id = 'test2';
    component.onClick(event);
    expect(component.editableFieldIds.length).toEqual(0);
    component.editableFieldIds = ['test'];
    delete event.target.id;
    component.onClick(event);
    expect(component.editableFieldIds.length).toEqual(0);
  });


   it('closeDialog() will call dialog service close function', async() => {
    expect(component.closeDialog()).toBeFalsy();
  });

  it('getSelectedDependantStatus() will get currently selected dependant status', async() => {
    expect(component.getSelectedDependantStatus('Test').key).toBe(component.dependantStatusList[0].key);
    expect(component.getSelectedDependantStatus('ERROR').key).toBe('ERROR');
    expect(component.getSelectedDependantStatus('FAILURE').key).toBe('ERROR');
  });

  it('createUDRBlockFromLookup() will create new UDRBlocksModel', async() => {
    const lookupData: LookupFields= {
      fieldDescri: 'testDesc',
      fieldId: 'testId',
      fieldLookupConfig: {
        moduleId: '1',
        lookupColumnResult: 'colResult',
        lookupColumn: 'testCol'
      },
      lookupTargetField: 'targetTestId',
      lookupTargetText: 'targetTest',
      enableUserField: true
    };
    const res = component.createUDRBlockFromLookup(lookupData);
    expect(res).toBeTruthy();
    expect(res.id).toBeTruthy();
    expect(res.objectType).toEqual(lookupData.fieldLookupConfig.moduleId);
  });

  it('deleteSubscriber() shoud delete subscriber after confirm box displayed', async() => {
    component.subscribersList = [{}];
    component.initHeaderForm([]);
    component.createForm();
    component.requestForm.controls.subcribers.setValue(['1']);
    spyOn(globaldialogService, 'confirm').and.callFake((a,b) => b('yes'));
    component.deleteSubscriber(0);
    expect(globaldialogService.confirm).toHaveBeenCalled();
  });
  
  it('removeAllocation() should remove allocation', async() => {
    const ctrl: FilterCriteria = {
      fieldId: '1',
      values: [],
      type: ''
    };
    const sNo = 1;
    component.subscribersList = [{
      sno: 1,
      filterCriteria: [{
        fieldId: '1'
      }, {
        fieldId: '2'
      }]
    }];
    component.removeAllocation(ctrl, sNo);
    expect(component.subscribersList[0].filterCriteria.length).toEqual(1);
  });

  it('addTempIdToExisting() should add temp id to temp list', async(done) => {
    component.existingTempIds = [];
    await component.addTempIdToExisting('1');
    expect(component.existingTempIds.length).toEqual(1);
    done();
  });
  
  it('isExistingRule() should correct status of temp list', async() => {
    component.existingTempIds = ['1', '2'];
    expect(component.isExistingRule('1')).toBeTrue();
    expect(component.isExistingRule('15')).toBeFalse();
  });
  it('clearFileInput() should clear the input', async() => {
    component.clearFileInput();
    fixture.detectChanges();
    component.clearFileInput();
    expect(component.uploadedData).toBeNull();
    expect(component.uploadInput.nativeElement.value).toBeFalsy();
  });

  it('toggleBrStatus() should toggle the br status', async() => {
    component.createForm();
    let br: any = {
      fields: 'test',
      status: 0
    }
    component.requestForm.controls.coreSchemaBr.setValue([br]);
    component.toggleBrStatus(true, br);
    br = component.requestForm.controls.coreSchemaBr.value[0];
    expect(br.status).toEqual('1');
    component.toggleBrStatus(false, br);
    br = component.requestForm.controls.coreSchemaBr.value[0];
    expect(br.status).toEqual('0')
  });

it('updateCurrentRulesList() should update current rule list', async() => {
  component.createForm();
  expect(component.updateCurrentRulesList(undefined)).toBeFalsy();
  component.selectedBusinessRules = [];
  const response = {
    tempId: '1',
    brId: '1',
    formDta: {

    }
  };
  component.updateCurrentRulesList(response);
  expect(component.selectedBusinessRules.length).toEqual(0);

});

it('openExplorer() should clear the error message', async() => {
  fixture.detectChanges();
  component.openExplorer();
  expect(component.uploadError.status).toBeFalse();
  expect(component.uploadError.message).toBeFalsy();
});


it('fileChange() should validate the file before parsing', async() => {
  component.createForm();
  component.initHeaderForm([]);
  const file = new File(new Array(300), 'test.csv');
  let files = [
    file
  ];
  const event = {
    target: {
      files: {
        item: (i) => files[i],
        files,
        length: files.length,
        ...files
      }
    }
  } as any;
  component.fileChange(event);
  expect(component.uploadedFile).toBeFalsy();
  
  Object.defineProperty(file, 'name', {
    writable: true,
    value: []
  });
  // expect(function() {
    component.fileChange(event);
  // }).toThrowError();
  expect(component.uploadedFile).toBeFalsy();
  Object.defineProperty(file, 'name', {
    writable: true,
    value: 'name.csv'
  });
  Object.defineProperty(file, 'size', {
    writable: true,
    value: 99999999999
  });
  spyOn(component,'showValidationError');
  component.fileChange(event);
  expect(component.showValidationError).toHaveBeenCalled();

  Object.defineProperty(file, 'name', {
    writable: true,
    value: 'test'
  });
  component.fileChange(event);
  expect(component.showValidationError).toHaveBeenCalled();

  event.target.files.length = 3;
  expect(function(){component.fileChange(event)}).toThrowError('Cannot use multiple files');

});


it('fileChange() should call initheader form after loading', async() => {
  component.createForm();
  component.initHeaderForm([]);
  const file = new File(new Array(300), 'test.csv');
  let files = [
    file
  ];
  const event = {
    target: {
      files: {
        item: (i) => files[i],
        files,
        length: files.length,
        ...files
      }
    }
  } as any;
  expect(component.fileChange(event)).toBeUndefined();
});

it(`step() should run the step function`, async() => {
  let formBody = {};
  formBody['name'] = new FormControl('name', [Validators.required]);
  component.headerForm = new FormGroup(formBody);
  component.createForm();
  fixture.detectChanges();
  component.headerTextIndex = 0;
  component.stepper['testFn'] = () => true;
  component.stepper['next'] = () => true;
  expect(component.step('testFn')).toBeUndefined();
  formBody = {};
  formBody['objectDesc'] = new FormControl('objectDesc', [Validators.required]);
  formBody['objectId'] = new FormControl('objectId', [Validators.required]);
  formBody['mappedData'] = new FormControl('mappedData', [Validators.required]);
  formBody['coreSchemaBr'] = new FormControl('coreSchemaBr', [Validators.required]);
  component.requestForm = new FormGroup(formBody);
  component.requestForm.controls.objectDesc.setValue(null);
  expect(component.requestForm.controls.objectDesc.invalid).toBeTrue();
  Object.defineProperty( component.stepper, 'selectedIndex', {
    writable: true,
    value: 1
  });
  expect(component.step('next', true)).toBeUndefined();
  component.progressBar = 100;
  expect(component.step('next', false)).toBeUndefined();
  component.stepper.selectedIndex = 1;
  component.requestForm.controls.objectId.setValue('test');
  component.requestForm.controls.mappedData.setValue([]);
  component.requestForm.controls.coreSchemaBr.setValue([]);
  component.progressBar = 0;
  expect(component.step('next', false)).toBeUndefined();
  component.stepper.selectedIndex = 2;
  expect(component.step('next', false)).toBeUndefined();


}); 

it('getSelectedFieldId() get selected field id from list', async() => {
  component.excelMdoFieldMappedData = [{
    columnIndex: 1,
    mdoFldId: 'test'
  } as DataSource];
  expect(component.getSelectedFieldId(1)).toEqual('test');
  expect(component.getSelectedFieldId(11)).toEqual('');
});
it('save() should save', async() => {
  component.createForm();
  component.initHeaderForm([]);
  const fields = [{
    fieldDescri: 'test',
    fieldId: '1'
  }];
  component.requestForm.controls.objectId.setValue('');
  component.requestForm.controls.fields.setValue(fields);
  expect(component.save()).toBeUndefined();
});
it('updateMapFields() should setupdate map field', async() => {
  component.createForm();
  component.initHeaderForm([]);
  const data: any = {};
  expect(component.updateMapFields(data)).toBeUndefined();
  data.index = 1;
  component.excelMdoFieldMappedData = [{
    columnIndex: 1
  } as DataSource];
  expect(component.updateMapFields(data)).toBeUndefined();
  data.fieldId = '';
  expect(component.updateMapFields(data)).toBeUndefined();
});
it('setModuleValueAndTakeStep() should set module value and take step', async() => {
  component.createForm();
  component.initHeaderForm([]);
  fixture.detectChanges();
  expect(component.setModuleValueAndTakeStep()).toBeUndefined();
});
it('removeTempId() should remove temp id', async() => {
  const val: any = {
    coreSchemaBr: [{
      tempId: 'test',
      brId: 'test',
      dep_rules: [{
        brId: 'test'
      }]
    }]
  };
  expect(component.removeTempId(val)).toBeTruthy();
});
it('deleteBR() should delete br', async() => {
  const rule: CoreSchemaBrInfo = {
    sno: 1,
    brId: 'test',
    brType: 'test',
    refId: 1,
    fields: 'test',
    dep_rules: [],
    regex: 'test'
  } as CoreSchemaBrInfo;
  fixture.detectChanges();
  component.initHeaderForm([]);
  component.createForm();
  component.selectedBusinessRules = [rule];
  expect(component.deleteBR(rule as any)).toBeUndefined();
});
it('deleteBrChild() should delete br child', async() => {
  const chldBr: any = {
    brId: '1',
    tempId: '1'
  };
  const parentBr: any = {
    dep_rules: [chldBr]
  };
  component.existingTempIds = ['1'];
  component.selectedBusinessRules = [parentBr];
  spyOn(globaldialogService, 'confirm').and.callFake((a,b) => b('yes'));
  expect(component.deleteBrChild(chldBr, parentBr)).toBeUndefined();
});

it('setFormValue() should set form value', async(done) => {
  component.createForm();
  component.initHeaderForm([]);
  const formBody = {};
  formBody['name'] = new FormControl('name', [Validators.required]);
  component.headerForm = new FormGroup(formBody);
  component.dataSource= [{
    mdoFldId: 'name'
  } as DataSource];
  component.setFormValue('test','name');
  expect(component.headerForm.controls.name.value).toEqual('test');
  done();
});

it('configureRule() should configure the rule', async() => {
  component.createForm();
  component.initHeaderForm([]);
  expect(component.configureRule({} as any)).toBeUndefined();
});

it('callSaveSchemaAPI() should call save schema api', async() => {
  const objectId = 'test';
  const variantId = 'test';
  const fileSerialNo = 'test';
  component.createForm();
  component.initHeaderForm([]);
  expect(component.callSaveSchemaAPI(objectId, variantId, fileSerialNo)).toBeUndefined();
  component.requestForm.controls.runTime.setValue('Run the schema once now');
  expect(component.callSaveSchemaAPI(objectId, variantId, fileSerialNo)).toBeUndefined();

  spyOn(schemadetailsService, 'saveNewSchemaDetails').and.returnValue(of(null));
  component.callSaveSchemaAPI(objectId, variantId, fileSerialNo);
  expect(schemadetailsService.saveNewSchemaDetails).toHaveBeenCalled();
  component.requestForm.controls.runTime.setValue('');
  component.callSaveSchemaAPI(objectId, variantId, fileSerialNo);
  expect(schemadetailsService.saveNewSchemaDetails).toHaveBeenCalled();

});
it('makeFilterControl() should make filter control', async() => {
  const event: any = {
    fldCtrl: {
      fieldId: ''
    },
    selectedValues: [],
    fieldId: 'test1',
    fieldDescription: 'testDescription'
  };
  component.subscribersList = [{
    filterCriteria: []
  }];
  expect(component.makeFilterControl(event, 0, {})).toBeUndefined();
  event.selectedValues = [{
    CODE: 'test'
  }];
  event.fldCtrl.fieldId = 'test';
  component.subscribersList = [{
    filterCriteria: [{
      fieldId: 'test',
      values: []
    }, {
      fieldId: 'test1',
      values: []      
    }]
  }];
  expect(component.makeFilterControl(event, 0, {})).toBeUndefined();
});
it(`getObjectTypes(), should call service getAllObjectTypes`, async(() => {
  const returnData = [];
  spyOn(schemaServiceSpy, 'getAllObjectType').and.returnValue(of(returnData));
  component.getObjectTypes();
  expect(schemaServiceSpy.getAllObjectType).toHaveBeenCalled();
}));
it('getSchemaBrInfo() should get business rules by schema id', async() => {
  component.createForm();
  const selectedData = {
    schemaId: `1`
  }
  const returnData: Array<CoreSchemaBrInfo> = [{
    sno: 1,
    brId: 'test',
    brType: 'test',
    refId: 1,
    fields: 'test',
    regex: 'test',
    order: 1
  } as CoreSchemaBrInfo];
  spyOn(schemaServiceSpy, 'getBusinessRulesBySchemaId').withArgs(selectedData.schemaId).and.returnValue(of(returnData));
  component.getSchemaBrInfo(selectedData);
  expect(schemaServiceSpy.getBusinessRulesBySchemaId).toHaveBeenCalledWith(selectedData.schemaId);
});
it('uploadFileData() should upload file data', async(() => {
  const file = new File([], 'test_file', {
    type: 'image/jpeg'
  });
  const mockRes = {
    userName: 'AshishK',
    plantCode: '0'
  } as Userdetails;
  spyOn(component, 'getObjectTypes');
  spyOn(userService, 'getUserDetails').and.returnValue(of(mockRes))

  spyOn(component, 'getBusinessRulesList');
  spyOn(schemaServiceSpy, 'getAllBusinessRules').and.callFake(() => of([]));
  spyOn(component, 'getCollaborators');

  spyOn(schemaServiceSpy, 'uploadUpdateFileData')
  .withArgs(file, '1')
  .and.returnValue(of(null));
  component.createForm();
  component.initHeaderForm([]);
  fixture.detectChanges();
  component.requestForm.controls.fileSerialNo.setValue('1');
  component.requestForm.controls.file.setValue(file);
  component.data = {};
  component.uploadFileData();
  expect(schemaServiceSpy.uploadUpdateFileData).toHaveBeenCalledWith(file, '1');
}));
it('onClick() should be called when an element on ui is clicked', async() => {
  spyOn(component, 'onClick');
  
  fixture.detectChanges();
  const inputEl = document.createElement('button');
  fixture.nativeElement.appendChild(inputEl);
  const event = new Event('click', { bubbles: true });

  inputEl.dispatchEvent(event);
  expect(component.onClick).toHaveBeenCalled();
  inputEl.id = 'test';
  component.editableFieldIds = ['test1', 'test2'];
  inputEl.dispatchEvent(event);
  expect(component.editableFieldIds.length).toEqual(2);
});
it('openGlobalDialog() should open global dialog', async() => {
  component.createForm();
  component.initHeaderForm([]);
  component.requestForm.controls.objectId.setValue('test');
  component.requestForm.controls.fields.setValue('test');
  expect(component.openGlobalDialog()).toBeUndefined();
});

it('selectBusinessRule() should select business rule', async() => {
  component.initHeaderForm([]);
  component.createForm();
  const schemaInfo: CoreSchemaBrInfo = {
    sno: 1299484,
      brId: '22',
      brType: 'TRANSFORMATION',
      refId: 1,
      fields: '',
      tempId: '1',
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
  component.existingTempIds = [];
  const checkIFspy = spyOn(component, 'checkIfExist');
  component.selectBusinessRule(schemaInfo);
  expect(component.checkIfExist).toHaveBeenCalled();
  checkIFspy.and.returnValue(true);
  component.selectBusinessRule(schemaInfo);
  expect(component.checkIfExist).toHaveBeenCalled();
  const brList: Array<CoreSchemaBrInfo> = [schemaInfo];
  component.existingTempIds = [];
  expect(component.selectBusinessRule(brList)).toBeUndefined();

});

it('openScheduleSideSheet() should open global schedule sheet', async() => {
  component.createForm();
  component.requestForm.controls.objectId.setValue('test');
  component.requestForm.controls.fields.setValue('test');
  expect(component.openScheduleSideSheet()).toBeUndefined();
});

it('createfieldObjectForRequest() should create field object for request', async(done) => {
  const list: Array<DataSource> = [{
    excelFld: 'test',
    excelFrstRow: 'test',
    mdoFldId: 'test',
    mdoFldDesc: 'test',
    columnIndex: 0
  }];
  await component.initHeaderForm(list);
  let res = await component.createfieldObjectForRequest(list);
  expect(res).toBeTruthy();
  
  try {
    await component.createfieldObjectForRequest({
      length: 1
    } as Array<DataSource>);
  } catch (e) {
    done();
    return;
  }
  done();
});

/*it('drop() should change element position in array', async() => {
  const event: any = {
    container: {
      data: [1,2,3],
      previousIndex: 1,
      currentIndex: 0
    }
  };
  expect(component.drop(event)).toBeUndefined();
}); */

/*it('reoderBR() should reorder br', async() => {
  expect(component.reoderBR({} as any)).toBeUndefined();
});*/
/*

*/
});
