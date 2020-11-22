import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaInfoComponent } from './schema-info.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { Router } from '@angular/router';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaStaticThresholdRes, VariantDetails } from '@models/schema/schemalist';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';
import { CategoryInfo, FilterCriteria } from '@models/schema/schemadetailstable';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemaService } from '@services/home/schema.service';
import { AddFilterOutput } from '@models/schema/schema';
import { SchemaScheduler } from '@models/schema/schemaScheduler';

describe('SchemaInfoComponent', () => {
  let component: SchemaInfoComponent;
  let fixture: ComponentFixture<SchemaInfoComponent>;
  let router: Router;
  let schemaDetailsService: SchemaDetailsService;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchemaInfoComponent, FilterValuesComponent, AddFilterMenuComponent],
      imports: [
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
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
    component.schemaId = '1005'
    spyOn(schemaVariantService, 'getSchemaVariantDetails').withArgs(component.schemaId).and.returnValue(of({} as VariantDetails[]))
    component.getSchemaVariants(component.schemaId);
    expect(schemaVariantService.getSchemaVariantDetails).toHaveBeenCalledWith(component.schemaId);
  })

  it('getSchemaStatics(), should get stats of schema', async () => {
    spyOn(schemaService, 'getSchemaThresholdStatics').withArgs(component.schemaId).and.returnValue(of({} as SchemaStaticThresholdRes));
    component.getSchemaStatics(component.schemaId);
    expect(schemaService.getSchemaThresholdStatics).toHaveBeenCalledWith(component.schemaId);
  })

  it('getBusinessRuleList(), should get business rule list of schema', async () => {
    spyOn(schemaService, 'getAllBusinessRules').withArgs(component.schemaId).and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.getBusinessRuleList(component.schemaId);
    expect(schemaService.getAllBusinessRules).toHaveBeenCalledWith(component.schemaId);
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
    spyOn(router, 'navigate');
    component.openSubscriberSideSheet();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/subscriber/${component.moduleId}/${component.schemaId}/new` } }])
  })

  it('addBusinessRule(), should open the subscriber side sheet', async () => {
    component.moduleId = '1005';
    component.schemaId = '5642587452';
    spyOn(router, 'navigate');
    component.addBusinessRule();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/business-rule/${component.moduleId}/${component.schemaId}/new` } }])
  })

  it('updateCategory(), should update category of business rule', async () => {
    const cat = {
      categoryId: '985',
      categoryDesc: 'Category_1'
    } as CategoryInfo

    const br = {
      brIdStr: '36572',
    } as CoreSchemaBrInfo;

    spyOn(schemaService, 'createBusinessRule').withArgs(br).and.returnValue(of({} as CoreSchemaBrInfo));
    component.updateCategory(cat, br);
    expect(schemaService.createBusinessRule).toHaveBeenCalledWith(br);
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
    spyOn(router, 'navigate');
    component.addDataScope();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/data-scope/new` } }])
  })

  it('openSummarySideSheet(), should navigate to schema summary side sheet', () => {
    component.moduleId = '1005';
    component.schemaId = '2563145';

    spyOn(router, 'navigate');
    component.openSummarySideSheet(component.moduleId, component.schemaId);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/summary/${component.moduleId}/${component.schemaId}` } }])
  })

  it('editSubscriberInfo(), should open edit subscriber sidesheet', async () => {
    const sNo = 2345667;
    spyOn(router, 'navigate');
    component.editSubscriberInfo(sNo);
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/schema/subscriber/${component.moduleId}/${component.schemaId}/${sNo}` } }])
  })

  it('getPercentageStatics(), should return statics', async () => {
    const statics = {
      threshold: 0,
      errorCnt: 0,
      totalCnt: 0,
      successCnt: 0
    } as SchemaStaticThresholdRes
    component.getPercentageStatics(statics);
    expect(component.thresholdValue).toEqual(0);
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
    spyOn(router, 'navigate');
    component.openScheduleSideSheet();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: `sb/schema/schedule/2452141452`}}])
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
});
