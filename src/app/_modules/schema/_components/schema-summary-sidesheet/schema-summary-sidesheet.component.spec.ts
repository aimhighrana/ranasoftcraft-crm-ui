import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PermissionOn, ROLES, RuleDependentOn, SchemaDashboardPermission } from '@models/collaborator';
import { AddFilterOutput, CheckDataResponse } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { PermissionType, SchemaListDetails, VariantDetails } from '@models/schema/schemalist';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedModule } from '@modules/shared/shared.module';
import { FormInputAutoselectComponent } from '@modules/shared/_components/form-input-autoselect/form-input-autoselect.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaSummarySidesheetComponent } from './schema-summary-sidesheet.component';

describe('SchemaSummarySidesheetComponent', () => {
  let component: SchemaSummarySidesheetComponent;
  let fixture: ComponentFixture<SchemaSummarySidesheetComponent>;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;
  let schemaDetailsService: SchemaDetailsService;
  let schemaListService: SchemalistService;
  let schemaExecutionService: SchemaExecutionService;
  let sharedService: SharedServiceService;
  let globalDialogService: GlobaldialogService;
  let router: Router;
  const mockRouterQueryParams = {
    name: 'Material_Module_Ashish'
  };
  const mockRouterParams = {
    moduleId: '1002',
    schemaId: '1234455'
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SchemaSummarySidesheetComponent,
        FormInputAutoselectComponent,
        FormInputComponent
      ],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            queryParams: of(mockRouterQueryParams),
            params: of(mockRouterParams)
          }
        }
      ]
    })
      .compileComponents()
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaSummarySidesheetComponent);
    component = fixture.componentInstance;
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    schemaExecutionService = fixture.debugElement.injector.get(SchemaExecutionService);
    sharedService = fixture.debugElement.injector.get(SharedServiceService);
    globalDialogService = fixture.debugElement.injector.get(GlobaldialogService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaVariants(), should return all variants of a schema', async () => {
    component.schemaId = '1005'
    spyOn(schemaVariantService, 'getAllDataScopeList').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of({} as VariantDetails[]))
    component.getSchemaVariants(component.schemaId, 'RUNFOR');
    expect(schemaVariantService.getAllDataScopeList).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  })

  it('getBusinessRuleList(), should get business rule list of schema', async () => {
    spyOn(schemaService, 'getBusinessRulesBySchemaId').withArgs(component.schemaId).and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.getBusinessRuleList(component.schemaId);
    expect(schemaService.getBusinessRulesBySchemaId).toHaveBeenCalledWith(component.schemaId);
  });

  it('getBusinessRuleList(), should return business rule list of a schema', async()=>{
    component.schemaId = '1223443435';
    const mockRes = [
      {
        brIdStr: '124',
        isCopied: false,
        copiedFrom: null,
        schemaId: component.schemaId
      }
    ] as CoreSchemaBrInfo[];
    spyOn(schemaService, 'getBusinessRulesBySchemaId').withArgs(component.schemaId).and.returnValue(of(mockRes));

    component.getBusinessRuleList(component.schemaId);
    expect(schemaService.getBusinessRulesBySchemaId).toHaveBeenCalledWith(component.schemaId);
    expect(component.businessRuleData.length).toEqual(1);
  });

  it('shortName(), should return initials of subscriber', () => {
    let fName = 'Ashish';
    let lName = 'Goyal';
    let result = component.shortName(fName, lName);
    expect(result).toEqual('AG');

    fName = 'Ashish';
    lName = '';
    result = component.shortName(fName, lName);
    expect(result).toEqual('')
  })

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
    expect(result).toEqual(2);

    ctrl.values = ['12345'];
    expect(component.prepareTextToShow(ctrl)).toEqual('12345');
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
  })

  it('close(), should close the summary side sheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }]);
  });

  it('openBrLibrarySideSheet(), should open business rule side sheet', () => {
    component.moduleId = '1004';
    component.schemaId = '15125412';
    component.outlet = 'outer';

    spyOn(router, 'navigate');
    component.openBrLibrarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { outer: `outer/schema/businessrule-library/${component.moduleId}/${component.schemaId}/${component.outlet}` } }])
  });

  it('openSubscriberSideSheet(), should open subscriber side sheet', () => {
    component.schemaId = '15125412';
    component.outlet = 'outer';
    component.moduleId = '1005';
    spyOn(router, 'navigate');
    component.openSubscriberSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { outer: `outer/schema/subscriber/${component.moduleId}/${component.schemaId}/new/${component.outlet}` } }])
  })

  it('getAllBusinessRulesList(), should get all business rules', async () => {
    component.moduleId = '1005';
    const mockBrRes = [
      {
        brIdStr: '12344'
      },
      {
        brIdStr: '134545'
      }
    ] as CoreSchemaBrInfo[]

    spyOn(schemaService, 'getBusinessRulesByModuleId').and.returnValue(of(mockBrRes));
    component.getAllBusinessRulesList(component.moduleId, '', '', '0');
    expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
    expect(component.allBusinessRulesList).toEqual(mockBrRes);
  });

  it('getAllBusinessRulesList(), should get all business rules', async () => {
    component.moduleId = '1005';
    const mockBrRes = [

    ] as CoreSchemaBrInfo[]

    spyOn(schemaService, 'getBusinessRulesByModuleId').and.returnValue(of(mockBrRes));
    component.getAllBusinessRulesList(component.moduleId, '', '', '0');
    expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
  })

  it('getCollaborators(), should get all subscribers', async () => {
    spyOn(schemaDetailsService, 'getAllUserDetails').and.returnValue(of({} as PermissionOn));
    component.getCollaborators('', 0);
    expect(schemaDetailsService.getAllUserDetails).toHaveBeenCalled();
  });

  it('getCollaborators(), should get all subscribers', async () => {
    const mockCollaboratorsRes = {
      users: [
        {
          email: 'ashish@gmail.com'
        },
        {
          email: 'abc@gmail.com'
        }
      ]
    } as PermissionOn;

    spyOn(schemaDetailsService, 'getAllUserDetails').and.returnValue(of(mockCollaboratorsRes));
    component.getCollaborators('', 0);
    expect(schemaDetailsService.getAllUserDetails).toHaveBeenCalled();
    expect(component.allSubscribers).toEqual(mockCollaboratorsRes.users);
  })

  it('addBusinessRule(), should add business rule', async () => {
    component.businessRuleData = [];
    const brInfo = {
      brType: 'Meta data',
      brIdStr: '12254'
    } as CoreSchemaBrInfo;
    component.addBusinessRule(brInfo);
    expect(component.businessRuleData.length).toEqual(1);

    component.businessRuleData = [
      {
        brIdStr: '12254'
      } as CoreSchemaBrInfo
    ];
    component.addBusinessRule(brInfo);
    expect(component.businessRuleData.length).toEqual(1);
  })

  it('addSubscriber(), should add subscriber', async () => {
    component.subscriberData = [];
    const subscriber = {
      userName: 'AshishGoyal',
      userMdoModel: {
        fullName: 'Ashish Goyal',
        email: 'ashish.goyal@prospecta.com'
      }
    };
    component.addSubscriber(subscriber);
    expect(component.subscriberData.length).toEqual(1);

    component.subscriberData = [
      {
        userid: 'AshishGoyal'
      } as SchemaDashboardPermission
    ]
    component.addSubscriber(subscriber);
    expect(component.subscriberData.length).toEqual(1);
  });

  it('availableWeightage(), should return max avail weightage', async () => {
    const weightage = '46';
    component.businessRuleData = [
      {
        brWeightage: '46'
      },
      {
        brWeightage: '33'
      }
    ] as CoreSchemaBrInfo[];
    const result = component.availableWeightage(weightage);
    expect(result).toEqual(67);
  })

  it('getSchemaDetails(), should get schema details', async () => {
    component.schemaId = '12545';
    component.schemaThresholdControl = new FormControl(null);
    component.schemaName = new FormControl(null);
    component.isFromCheckData = true;

    const mockSchemaDetailsRes = {
      schemaThreshold: '100',
      runId: '1234'
    } as SchemaListDetails;
    spyOn(component, 'getCheckDataDetails');
    spyOn(component, 'getSubscriberList');
    spyOn(component, 'getBusinessRuleList');
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and.returnValue(of(mockSchemaDetailsRes));

    component.getSchemaDetails(component.schemaId);
    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);
    expect(component.getCheckDataDetails).toHaveBeenCalled();

    component.isFromCheckData = false;
    component.getSchemaDetails(component.schemaId);

    expect(component.getSubscriberList).toHaveBeenCalled();
    expect(component.getBusinessRuleList).toHaveBeenCalled();
  })

  it('getCheckDataDetails(), should get info about check data', async () => {
    const mockCheckDataRes = {
      CollaboratorModel: [],
      BrModel: []
    } as CheckDataResponse

    component.schemaId = '1224552';
    spyOn(schemaService, 'getCheckData').withArgs(component.schemaId).and.returnValue(of(mockCheckDataRes));
    spyOn(component, 'getSubscriberList');
    spyOn(component, 'getBusinessRuleList');

    component.getCheckDataDetails(component.schemaId);
    expect(schemaService.getCheckData).toHaveBeenCalledWith(component.schemaId);
    expect(component.getSubscriberList).toHaveBeenCalled();
    expect(component.getBusinessRuleList).toHaveBeenCalled();
  });


  it('getCheckDataDetails(), should get info about check data', async () => {
    const mockCheckDataRes = {
      CollaboratorModel: [
        {
          sno: 1244
        },
        {
          sno: 1234
        }
      ],
      BrModel: [
        {
          brIdStr: '12455677'
        },
        {
          brIdStr: '34567898'
        }
      ]
    } as CheckDataResponse

    component.schemaId = '1224552';
    spyOn(schemaService, 'getCheckData').withArgs(component.schemaId).and.returnValue(of(mockCheckDataRes));

    component.getCheckDataDetails(component.schemaId);
    expect(schemaService.getCheckData).toHaveBeenCalledWith(component.schemaId);
  });


  it('openUploadSideSheet(), should open upload dataset side sheet', async () => {
    component.moduleId = '1001';
    component.outlet = 'outer';
    spyOn(router, 'navigate');
    component.openUploadSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { outer: `outer/schema/upload-data/${component.moduleId}/${component.outlet}` } }])
  })

  it('openDataScopeSideSheet(), should open data scope side sheet', async () => {
    component.moduleId = '1001';
    component.schemaId = '15423'
    component.outlet = 'outer';
    spyOn(router, 'navigate');
    component.openDataScopeSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { outer: `outer/schema/data-scope/${component.moduleId}/${component.schemaId}/new/${component.outlet}` } }], { queryParamsHandling: 'preserve' });
  })

  it('openBusinessRuleSideSheet(), should openBusinessRuleSideSheet', async () => {
    component.moduleId = '1001';
    component.schemaId = '15423'
    spyOn(router, 'navigate');
    component.openBusinessRuleSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { outer: `outer/schema/business-rule/${component.moduleId}/${component.schemaId}/new/outer` } }])
  })

  it('updateRole(), should update subscriber role', async () => {
    component.roles = ROLES;
    component.schemaId = '125556221415';
    const subscriber = {
      isAdmin: false,
      isViewer: true,
      isReviewer: false,
      isEditer: false,
      schemaId: component.schemaId,
      permissionType: 'USER',
      sno: '22551',
      userid: 'ASHSH'
    } as SchemaDashboardPermission;

    component.subscriberData = [subscriber];
    component.updateRole(subscriber, 'isAdmin');
    expect(subscriber.isAdmin).toEqual(true);
  });

  it('prepareData(), should call createBusinessRule and createUpdateUserDetails', async () => {
    component.subscriberData = [
      {
        sno: '098978685586',
        schemaId: 'testId',
        userid: '123456',
        roleId: 'test',
        groupid: 'groupid',
        isAdmin: false,
        isViewer: false,
        isEditer: false,
        isReviewer: false,
        permissionType: PermissionType.USER,
        description: '',
        userMdoModel: null,
        rolesModel: null,
        groupHeaderModel: null,
        plantCode: '0',
        filterCriteria: [],
        dataAllocation: [],
        isCopied: false,
        isInvited: false,
        }
    ];
const mockdata={
  sno: 1299484,
  brId: '22',
  brIdStr: '112323',
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
  udrDto: null,
  transFormationSchema: null,
  isCopied: false,
  duplicacyField: [],
  duplicacyMaster: []
} as CoreSchemaBrInfo
    component.businessRuleData = [
      mockdata
    ];
    component.isFromCheckData = false;
    const schemaId = '12342424'
    spyOn(schemaService, 'createCheckDataBusinessRule').and.returnValue(of(mockdata));
    spyOn(schemaService, 'createBusinessRule').and.returnValue(of(mockdata));
    spyOn(schemaDetailsService, 'createUpdateUserDetails').and.returnValue(of([]));

    component.prepareData(schemaId);

    expect(schemaService.createBusinessRule).toHaveBeenCalled();
    expect(schemaDetailsService.createUpdateUserDetails).toHaveBeenCalled();

    component.isFromCheckData = true;
    component.prepareData(schemaId);

    expect(schemaService.createCheckDataBusinessRule).toHaveBeenCalled();

    component.businessRuleData[0].brId = '';
    component.businessRuleData[0].brIdStr = '';
    component.subscriberData[0].sno = '';
    component.prepareData(schemaId);

    expect(schemaService.createCheckDataBusinessRule).toHaveBeenCalled();
  })

  it('saveCheckData(), ', async() => {
    component.schemaName = new FormControl('');
    component.schemaThresholdControl = new FormControl('');

    component.schemaId = '15236896';
    component.schemaDetails = {
      schemaId: 'testId',
      schemaDescription: 'desc',
      errorCount: 0,
      successCount: 0,
      totalCount: 0,
      skippedValue: 0,
      correctionValue: 0,
      duplicateValue: 0,
      totalUniqueValue: 0,
      successUniqueValue: 0,
      errorUniqueValue: 0,
      skippedUniqueValue: 0,
      successTrendValue: '',
      errorTrendValue: '',
      createdBy: '',
      errorPercentage: 0,
      successPercentage: 0,
      variantCount: 0,
      executionStartTime: 0,
      executionEndTime: 0,
      variantId: '',
      runId: '',
      brInformation: [],
      moduleId: '',
      moduleDescription: '',
      isInRunning: false,
      schemaThreshold: '10',
      collaboratorModels: null,
      totalValue: 0,
      errorValue: 0,
      successValue: 0,
      variants: [],
      schemaCategory: '',
    };

    spyOn(schemaService, 'createUpdateSchema').and.returnValue(of(null));

    component.saveCheckData();
    expect(schemaService.createUpdateSchema).toHaveBeenCalled();
  });

  it('editBr(), should open side sheet of business rule', async() => {
    const br = {
      brIdStr: '122335'
    } as CoreSchemaBrInfo;
    component.moduleId = '2100';
    component.schemaId = '93487579456';

    spyOn(router, 'navigate');
    component.editBr(br);

    expect(router.navigate).toHaveBeenCalledWith(['',{outlets: {sb: `sb/schema/business-rule/${component.moduleId}/${component.schemaId}/${br.brIdStr}`}}])
  });

  it('runSchema(), should run the schema on click check data button', async() => {
    component.schemaId = '23445656';
    component.dataScopeControl = new FormControl('Ashish data scope');

    spyOn(schemaExecutionService, 'scheduleSChema').and.returnValue(of({}));
    component.runSchema();

    expect(schemaExecutionService.scheduleSChema).toHaveBeenCalled();

    component.dataScopeControl.setValue(null);
    component.runSchema();

    expect(schemaExecutionService.scheduleSChema).toHaveBeenCalled();
  });

  it('editSubscriberInfo(), should edit subscriber info', async() => {
    const sNo = 12345;
    component.moduleId = '12345';
    component.schemaId = '12334565';

    spyOn(router, 'navigate');
    component.editSubscriberInfo(sNo);

    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/subscriber/${component.moduleId}/${component.schemaId}/${sNo}`}}])
  });

  it('removeAppliedFilter(), should remove applied data allocation for subscriber', async() => {
    let sNo = 12345;
    const ctrl = {
      fieldId: 'APPROVER',
    } as FilterCriteria;

    component.subscriberData = [
      {
        sno: 12345,
        filterCriteria: [
          {
            fieldId: 'APPROVER',
            values: ['ASHISH', 'SANDEEP']
          },
          {
            fieldId: 'MATLASHISH',
            values: ['DIAMOND']
          }
        ]
      }
    ] as SchemaDashboardPermission[];

    component.removeAppliedFilter(ctrl, sNo);
    expect(component.subscriberData[0].filterCriteria.length).toEqual(1);

    sNo = 1234990;
    component.subscriberData = [
      {
        sno: 12345,
        filterCriteria: [
          {
            fieldId: 'APPROVER',
            values: ['ASHISH', 'SANDEEP']
          },
          {
            fieldId: 'MATLASHISH',
            values: ['DIAMOND']
          }
        ]
      }
    ] as SchemaDashboardPermission[];
    component.removeAppliedFilter(ctrl, sNo);
    expect(component.subscriberData[0].filterCriteria.length).toEqual(2);

    sNo = 12345;
    ctrl.fieldId = 'MATERIALTYPE';
    component.removeAppliedFilter(ctrl, sNo);
    expect(component.subscriberData[0].filterCriteria.length).toEqual(2);
  });


  it('getSubscriberList(), should return list of all subscribers.', async() => {
    component.schemaId = '121323';
    const mockSubscriberResponse = [
      {
        sno: 12123,
        userMdoModel: {
          fullName: 'Ashish Kumar Goyal'
        }
      },
      {
        sno: 124544,
        userMdoModel: {
          fullName: 'Anushri'
        }
      }
    ] as SchemaDashboardPermission[];

    spyOn(schemaDetailsService, 'getCollaboratorDetails').withArgs(component.schemaId).and.returnValue(of(mockSubscriberResponse));
    component.getSubscriberList(component.schemaId);

    expect(schemaDetailsService.getCollaboratorDetails).toHaveBeenCalledWith(component.schemaId)
  });

  it('fetchSelectedValues(), should fetch selected Values for data allocation filter', async() => {
    component.subscriberData = [
      {
        sno: 1234,
        userMdoModel: {
          email: 'ashish@gmail.com'
        },
        filterCriteria: [
          {
            fieldId: 'MATLGRP',
            selectedValues: [
              {
                CODE: 'VAL1'
              }
            ],
            values: []
          },
          {
            fieldId: 'MATKTYPE',
            values: ['materialtype1', 'materialtype2']
          }
        ]
      }
    ] as SchemaDashboardPermission[]

    const sNo = 1234;
    const selectedValues = [
      {
        CODE: 'V1',
        FIELDNAME: 'MATKTYPE'
      }
    ] as DropDownValue[];

    component.fetchSelectedValues(selectedValues, sNo);

    expect(component.subscriberData[0].filterCriteria[1].values.length).toEqual(1)
  });

  it('getRouterParams(), should get info for router', async() => {
    component.getRouteParams();
    expect(component.isFromCheckData).toEqual(false);
    expect(component.moduleDesc).toEqual('Material_Module_Ashish');
    expect(component.moduleId).toEqual('1002');
    expect(component.schemaId).toEqual('1234455');

    mockRouterQueryParams.name = '';
    component.getRouteParams();
    expect(component.isFromCheckData).toEqual(true)
  });

  it('ngOnInit(), should called on component loading', async()=>{
    component.schemaId = '134545';
    const mockBrsRes = [
      {
        brIdStr: '1234'
      }
    ] as CoreSchemaBrInfo[];

    const mockCollaboratorsRes = [
      {
        sno: 1234
      }
    ] as SchemaDashboardPermission[]

    spyOn(component, 'getRouteParams');
    spyOn(sharedService, 'getAfterBrSave').and.returnValue(of(mockBrsRes));
    spyOn(sharedService, 'getAfterSubscriberSave').and.returnValue(of(mockCollaboratorsRes))
    spyOn(sharedService, 'getDataScope').and.returnValue(of('Ashish'))
    spyOn(component, 'getSchemaVariants');

    component.ngOnInit();
    expect(component.getRouteParams).toHaveBeenCalled();
    expect(sharedService.getAfterBrSave).toHaveBeenCalled();
    expect(sharedService.getAfterSubscriberSave).toHaveBeenCalled();
    expect(sharedService.getDataScope).toHaveBeenCalled();
    expect(component.getSchemaVariants).toHaveBeenCalled();
  });


  it('ngOnInit(), should called on component loading', async()=>{
    component.schemaId = '134545';

    spyOn(component, 'getRouteParams');
    spyOn(sharedService, 'getAfterBrSave').and.returnValue(of(null));
    spyOn(sharedService, 'getAfterSubscriberSave').and.returnValue(of(null));
    spyOn(sharedService, 'getDataScope').and.returnValue(of(null));

    component.ngOnInit();
    expect(component.getRouteParams).toHaveBeenCalled();
    expect(sharedService.getAfterBrSave).toHaveBeenCalled();
    expect(sharedService.getAfterSubscriberSave).toHaveBeenCalled();
    expect(sharedService.getDataScope).toHaveBeenCalled();
  });

  it('deleteBr(), should delete business rule', async() => {
    component.businessRuleData = [
      {
        brId: '23542'
      },
      {
        brId: '12345'
      }
    ] as CoreSchemaBrInfo[];
    const br = {
      brId: '12345'
    } as CoreSchemaBrInfo;
    spyOn(globalDialogService, 'confirm').and.callFake((resp, response) => {
      response('no')
    })
    component.deleteBr(br);
    expect(component.businessRuleData.length).toEqual(2);
  });

  it('deleteBr(), should delete business rule', async() => {
    component.businessRuleData = [
      {
        brId: '23542'
      },
      {
        brId: '12345'
      }
    ] as CoreSchemaBrInfo[];
    const br = {
      brId: '12345'
    } as CoreSchemaBrInfo;
    spyOn(globalDialogService, 'confirm').and.callFake((resp, response) => {
      response('yes')
    })
    component.deleteBr(br);
    expect(component.businessRuleData.length).toEqual(1);
  });

  it('deleteBr(), should enable popup of delete businessrule', async()=>{
    component.businessRuleData = [
      {
        brId: '23542'
      },
      {
        brId: '12345'
      }
    ] as CoreSchemaBrInfo[];
    const br = {
      brId: '12345'
    } as CoreSchemaBrInfo;

    spyOn(globalDialogService, 'confirm').and.returnValue(null);
    component.deleteBr(br);

    expect(globalDialogService.confirm).toHaveBeenCalled();
  })

  it('deleteSubscriber(), should delete subscriber', async() => {
    component.subscriberData = [
      {
        sno: 23542
      },
      {
        sno: 12345
      }
    ] as SchemaDashboardPermission[]
    const sno = 12345;

    spyOn(globalDialogService, 'confirm').and.callFake((res, response)=>{
      response('no')
    })
    component.deleteSubscriber(sno);
    expect(component.subscriberData.length).toEqual(2);
  });

  it('deleteSubscriber(), should delete subscriber', async() => {
    component.subscriberData = [
      {
        sno: 23542
      },
      {
        sno: 12345
      }
    ] as SchemaDashboardPermission[]
    const sno = 12345;

    spyOn(globalDialogService, 'confirm').and.callFake((res, response)=>{
      response('yes')
    })
    component.deleteSubscriber(sno);
    expect(component.subscriberData.length).toEqual(1);
  });

  it('deleteSubscriber(), should enable popup of delete subscriber', async()=>{
    const sno = 12345;

    spyOn(globalDialogService, 'confirm').and.returnValue(null);
    component.deleteSubscriber(sno);

    expect(globalDialogService.confirm).toHaveBeenCalled();
  });

  it('updateDepRule() updateDepRule', async () => {
    component.businessRuleData = [
      {
        sno: 101,
        brId: '22',
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
    expect(component.businessRuleData.length).toEqual(1);

    component.businessRuleData = [
      {
        sno: 101,
        brId: '22',
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
    expect(component.businessRuleData.length).toEqual(1);
  });

  it('updateDepRuleForChild() updateDepRuleForChild', async () => {
    component.businessRuleData = [
      {
        sno: 101,
        brId: '22',
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
    const event = { value: RuleDependentOn.ALL };
    component.updateDepRule(br, event);
    expect(component.businessRuleData.length).toEqual(2);

    component.businessRuleData = [
      {
        sno: 101,
        brId: '22',
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
    component.updateDepRuleForChild(br, 0, event);
    expect(component.businessRuleData.length).toEqual(3);
  });
});
