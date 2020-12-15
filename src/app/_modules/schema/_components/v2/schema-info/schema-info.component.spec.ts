import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaInfoComponent } from './schema-info.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { Router } from '@angular/router';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';
import { CategoryInfo, FilterCriteria } from '@models/schema/schemadetailstable';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemaService } from '@services/home/schema.service';
import { AddFilterOutput } from '@models/schema/schema';
import { SchemaScheduler } from '@models/schema/schemaScheduler';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { ScheduleComponent } from '@modules/shared/_components/schedule/schedule.component';
import { DatePickerFieldComponent } from '@modules/shared/_components/date-picker-field/date-picker-field.component';
import { PermissionOn, SchemaDashboardPermission } from '@models/collaborator';
import { SchemalistService } from '@services/home/schema/schemalist.service';

describe('SchemaInfoComponent', () => {
  let component: SchemaInfoComponent;
  let fixture: ComponentFixture<SchemaInfoComponent>;
  let router: Router;
  let schemaDetailsService: SchemaDetailsService;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;
  let schemaListService: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SchemaInfoComponent,
        FilterValuesComponent,
        AddFilterMenuComponent,
        FormInputComponent,
        ScheduleComponent,
        DatePickerFieldComponent
      ],
      imports: [
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaInfoComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getAllCategoryInfo(), should get all categories of business rules', async () => {
    spyOn(schemaDetailsService, 'getAllCategoryInfo').and.returnValue(of({} as CategoryInfo[]));;
    component.getAllCategoryInfo();
    expect(schemaDetailsService.getAllCategoryInfo).toHaveBeenCalled();
  })

  it('getSchemaVariants(), should return all variants of a schema', async () => {
    component.schemaId = '1005';
    spyOn(schemaVariantService, 'getAllDataScopeList').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of())
    component.getSchemaVariants(component.schemaId, 'RUNFOR');
    expect(schemaVariantService.getAllDataScopeList).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  })

  it('getBusinessRuleList(), should get business rule list of schema', async () => {
    spyOn(schemaService, 'getBusinessRulesBySchemaId').withArgs(component.schemaId).and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.getBusinessRuleList(component.schemaId);
    expect(schemaService.getBusinessRulesBySchemaId).toHaveBeenCalledWith(component.schemaId);
  })

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

  it('openSubscriberSideSheet(), should open the subscriber side sheet', async () => {
    component.moduleId = '1005';
    component.schemaId = '5642587452';
    component.outlet = 'sb'
    spyOn(router, 'navigate');
    component.openSubscriberSideSheet();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/subscriber/${component.moduleId}/${component.schemaId}/new/${component.outlet}` } }])
  })

  it('openBusinessRuleSideSheet(), should open the Business rule side sheet', async () => {
    component.moduleId = '1005';
    component.schemaId = '5642587452';
    spyOn(router, 'navigate');
    component.openBusinessRuleSideSheet();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/business-rule/${component.moduleId}/${component.schemaId}/new` } }])
  })

  it('updateCategory(), should update category of business rule', async () => {
    const cat = {
      categoryId: '985',
      categoryDesc: 'Category_1'
    } as CategoryInfo

    const br = {
      brIdStr: '36572',
      brInfo: 'Missing Rule',
      brType: 'Meta data',
      fields: 'NDC',
      message: 'Test should passed..',
      moduleId: '1005',
      isCopied: false,
    } as CoreSchemaBrInfo;

    component.schemaId = '44514235';
    component.moduleId = '1004'

    const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();
    request.brId = br.brIdStr;
    request.schemaId = component.schemaId;
    request.categoryId = cat.categoryId;
    request.brInfo = br.brInfo;
    request.brType = br.brType;
    request.fields = br.fields;
    request.message = br.message;
    request.moduleId = component.moduleId;
    request.isCopied = br.isCopied;

    spyOn(schemaService, 'createBusinessRule').withArgs(request).and.returnValue(of({} as CoreSchemaBrInfo));
    component.updateCategory(cat, br);
    expect(schemaService.createBusinessRule).toHaveBeenCalledWith(request);
  })

  it('updateFragment(), should update tab selection', async () => {
    component.moduleId = '1005';
    component.schemaId = '5642785215';
    let tabLabel = 'business-rules';

    spyOn(router, 'navigate');
    component.updateFragment(tabLabel);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-info', component.moduleId, component.schemaId], { queryParams: { fragment: tabLabel } })
    expect(component.selectedIndex).toEqual(1);

    tabLabel = 'subscribers';
    component.updateFragment(tabLabel);
    expect(component.selectedIndex).toEqual(2);

    tabLabel = 'execution-logs';
    component.updateFragment(tabLabel);
    expect(component.selectedIndex).toEqual(3)
  })

  it('editBr(), should open side sheet of business rules', async () => {
    component.moduleId = '1005';
    component.schemaId = '2563145';

    const br = {
      brIdStr: '2356'
    } as CoreSchemaBrInfo
    spyOn(router, 'navigate');
    component.editBr(br);

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/business-rule/${component.moduleId}/${component.schemaId}/${br.brIdStr}` } }])
  })

  it('addDataScope(), should navigate to add datascope side sheet', () => {
    component.moduleId = '1005';
    component.schemaId = '2563145';
    spyOn(router, 'navigate');
    component.addDataScope();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/data-scope/${component.moduleId}/${component.schemaId}/new` } }])
  })

  it('openSummarySideSheet(), should navigate to schema summary side sheet', () => {
    component.moduleId = '1005';
    component.schemaId = '2563145';

    spyOn(router, 'navigate');
    component.openSummarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/check-data/${component.moduleId}/${component.schemaId}` } }])
  })

  it('editSubscriberInfo(), should open edit subscriber sidesheet', async () => {
    const sNo = 2345667;
    spyOn(router, 'navigate');
    component.editSubscriberInfo(sNo);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/subscriber/${component.moduleId}/${component.schemaId}/${sNo}` } }])
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
  })

  it('availableWeightage(), should return max avail weightage', async() => {
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

  it('openScheduleSideSheet(), should open schedule component in side sheet', async() => {
    component.schemaId = '2452141452';
    const scheduleId = '323344';
    spyOn(router, 'navigate');
    component.openScheduleSideSheet(scheduleId);
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/schedule/${component.schemaId}/${scheduleId}`}}]);

    component.openScheduleSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/schedule/${component.schemaId}/new`}}]);
  })

  it('getScheduleInfo(), should get schedule info', async() => {
    component.schemaId = '2452141452';
    const mockResponse = {} as SchemaScheduler;
    spyOn(schemaService, 'getSchedule').and.returnValue(of({} as SchemaScheduler));
    component.getScheduleInfo(component.schemaId);
    expect(schemaService.getSchedule).toHaveBeenCalledWith(component.schemaId);
    schemaService.getSchedule(component.schemaId).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(component.canEditSchedule).toEqual(true);
    })
  })

  it('toggleScheduleState(), should toggle state of schedule', async() => {
    component.scheduleInfo = {
      isEnable: false
    } as SchemaScheduler;
    component.schemaId = '2561141'
    spyOn(schemaService, 'createUpdateSchedule').and.returnValue(of());
    component.toggleScheduleState();
    expect(component.scheduleInfo.isEnable).toEqual(true);
    expect(schemaService.createUpdateSchedule).toHaveBeenCalledWith(component.schemaId, component.scheduleInfo)
  })

  it('editDataScope(), should open data scope side sheet in edit mode', async() => {
    component.moduleId = '1005';
    component.schemaId = '12550524553';
    const variantId = '125A';
    spyOn(router, 'navigate');
    component.editDataScope(variantId);
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/data-scope/${component.moduleId}/${component.schemaId}/${variantId}`}}])
  });

  it('getAllBusinessRulesList(), should get all business rules', async() => {
    spyOn(schemaService, 'getBusinessRulesByModuleId').and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.moduleId = '1004';
    component.getAllBusinessRulesList(component.moduleId, '', '', '0');
    expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
  })

  it('getCollaborators(), should get all subscribers', async() => {
    spyOn(schemaDetailsService, 'getAllUserDetails').and.returnValue(of({} as PermissionOn));
    component.getCollaborators('', 0);
    expect(schemaDetailsService.getAllUserDetails).toHaveBeenCalled();
  })

  it('openBrLibrarySideSheet(), should navigate to business rule library side sheet', () => {
    component.moduleId = '1004';
    component.schemaId = '2145214';
    component.outlet = 'sb';
    spyOn(router, 'navigate');
    component.openBrLibrarySideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/businessrule-library/${component.moduleId}/${component.schemaId}/${component.outlet}`}}])
  })

  it('addBusinessRule(), should add business rule from auto-complete', async() => {
    const brInfo = {
      brIdStr: '2452',
      brType: 'Meta Data',
      brInfo: 'Missing data',
      fields: 'Region',
      message: 'Region should be Asia',
      isCopied: true
    } as CoreSchemaBrInfo;
    component.schemaId = '245521';
    component.moduleId = '1005';

    const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();

    request.brId = '';
    request.schemaId = component.schemaId;
    request.brInfo = brInfo.brInfo;
    request.brType = brInfo.brType;
    request.fields = brInfo.fields;
    request.message = brInfo.message;
    request.isCopied = brInfo.isCopied;
    request.moduleId = component.moduleId;
    request.copiedFrom = brInfo.brIdStr;

    component.businessRuleData = [
      {
        brId: '2123243',
        brIdStr: '212343'
      }
    ] as CoreSchemaBrInfo[]

    spyOn(schemaService, 'createBusinessRule').withArgs(request).and.returnValue(of());
    component.addBusinessRule(brInfo);
    expect(schemaService.createBusinessRule).toHaveBeenCalledWith(request);
  })

  it('getSchemaDetails(), should get schema details', async() => {
    component.schemaId = '12545';
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and.returnValue(of({} as SchemaListDetails))
    component.getSchemaDetails(component.schemaId);
    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);
  })

  it('updateRole(), should update role of subscriber', async() => {
    component.schemaId = '125556221415'
    const subscriber = {
      isAdmin: false,
      isViewer: true,
      isReviewer: false,
      isEditer: false,
      schemaId: component.schemaId,
      permissionType : 'USER',
      sno: '22551',
      userid: 'ASHSH'
    } as SchemaDashboardPermission;
    const role = 'isAdmin';
    spyOn(schemaDetailsService, 'createUpdateUserDetails').withArgs(Array(subscriber)).and.returnValue(of())
    component.updateRole(subscriber, role);
    expect(schemaDetailsService.createUpdateUserDetails).toHaveBeenCalledWith(Array(subscriber));
  })
});
