import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDatasetComponent } from './upload-dataset.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { FormInputAutoselectComponent } from '@modules/shared/_components/form-input-autoselect/form-input-autoselect.component';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { AddFilterOutput, DataSource } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';


describe('UploadDatasetComponent', () => {
  let component: UploadDatasetComponent;
  let fixture: ComponentFixture<UploadDatasetComponent>;
  let schemaServiceSpy: SchemaService;
  let schemadetailsService: SchemaDetailsService;
  let usersSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadDatasetComponent,
        SearchInputComponent,
        FilterValuesComponent,
        FormInputComponent,
        AddFilterMenuComponent,
        FormInputAutoselectComponent],
      imports: [AppMaterialModuleForSpec],
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
    };

    expect(component.createBrObject(formData, formData.udrTreeData)).not.toBeUndefined();
    expect(component.createBrObject(formData, formData.udrTreeData)).not.toBeNull();
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
    component.setValueToForm('threshold', '13');
    expect(component.requestForm.controls.threshold.value).toEqual('13');
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
    spyOn(schemaServiceSpy, 'getAllBusinessRules').and.returnValue(of(returnData));
    component.getBusinessRulesList();
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

  it('loadDropValues(), should load dropdown values of selected filters', async() => {
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
  })
});
